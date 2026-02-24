import "dotenv/config";
import { createServer } from "http";
import mongoose from "mongoose";
import app from "./app.js";
import { connectDB } from "./config/db.js";
import { validateEnv } from "./config/env.js";

const PORT = process.env.PORT || 5000;
let server;
let shuttingDown = false;

const shutdown = async (signal, error) => {
  if (shuttingDown) {
    return;
  }
  shuttingDown = true;

  if (error) {
    console.error(error);
  }

  console.log(`${signal} received. Shutting down...`);

  try {
    if (server) {
      await new Promise((resolve, reject) => {
        server.close((closeError) => {
          if (closeError) {
            reject(closeError);
            return;
          }
          resolve();
        });
      });
    }

    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }

    process.exit(error ? 1 : 0);
  } catch (shutdownError) {
    console.error("Error during shutdown:", shutdownError);
    process.exit(1);
  }
};

const startServer = async () => {
  try {
    validateEnv();
    await connectDB();

    server = createServer(app);
    server.listen(PORT, () => {
      console.log(`API running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
process.on("uncaughtException", (error) => shutdown("uncaughtException", error));
process.on("unhandledRejection", (reason) => {
  const error = reason instanceof Error ? reason : new Error(String(reason));
  shutdown("unhandledRejection", error);
});

startServer();
