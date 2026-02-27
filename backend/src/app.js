import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.routes.js";
import taskRoutes from "./routes/task.routes.js";
import boardRoutes from "./routes/board.routes.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, "public");

const LOCALHOST_PATTERN = /^(localhost|127(?:\.\d{1,3}){3})(:\d+)?(\/.*)?$/i;

const normalizeOrigin = (rawOrigin) => {
  const value = rawOrigin.trim();
  if (!value) return "";
  if (value === "*") return value;

  try {
    return new URL(value).origin;
  } catch {
    const protocol = LOCALHOST_PATTERN.test(value) ? "http://" : "https://";
    try {
      return new URL(`${protocol}${value}`).origin;
    } catch {
      return value.replace(/\/+$/, "");
    }
  }
};

const getAllowedOrigins = () =>
  [...new Set((process.env.CLIENT_URL || "").split(",").map(normalizeOrigin).filter(Boolean))];

const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = getAllowedOrigins();
    if (!origin || allowedOrigins.includes("*")) {
      callback(null, true);
      return;
    }

    const normalizedOrigin = normalizeOrigin(origin);
    if (allowedOrigins.includes(normalizedOrigin)) {
      callback(null, true);
      return;
    }

    callback(new Error("CORS origin not allowed"));
  },
  credentials: true
};

const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false
});

const dbStateLabelByCode = {
  0: "disconnected",
  1: "connected",
  2: "connecting",
  3: "disconnecting"
};

app.set("trust proxy", 1);
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json({ limit: "1mb" }));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(express.static(publicDir));
app.use("/api", apiRateLimiter);

app.get("/", (req, res) => {
  res.sendFile(path.join(publicDir, "index.html"));
});

app.get("/api/health", (req, res) => {
  const dbState = mongoose.connection.readyState;
  const isHealthy = dbState === 1;

  res.status(isHealthy ? 200 : 503).json({
    status: isHealthy ? "ok" : "degraded",
    timestamp: new Date().toISOString(),
    uptimeSeconds: Number(process.uptime().toFixed(0)),
    database: dbStateLabelByCode[dbState] || "unknown"
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/boards", boardRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
