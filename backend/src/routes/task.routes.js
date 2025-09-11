import { Router } from "express";
import { authRequired } from "../middleware/auth.js";
import { createTask, getTasks, updateTask, deleteTask } from "../controllers/task.controller.js";

const router = Router();

router.use(authRequired);

router.post("/", createTask);
router.get("/", getTasks);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

export default router;
