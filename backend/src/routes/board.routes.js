import express from "express";
import {
  createBoard,
  getBoard,
  updateBoard,
  deleteBoard,
} from "../controllers/board.controller.js";
import { authRequired } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(authRequired);

// Protected routes → require JWT auth
router.post("/", createBoard);
router.get("/:id", getBoard);
router.put("/:id", updateBoard);
router.delete("/:id", deleteBoard);

export default router;
