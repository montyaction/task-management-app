import { Router } from "express";
import { authRequired } from "../middleware/auth.middleware.js";
import { createTask, getTasks, updateTask, deleteTask, reorderTasks } from "../controllers/task.controller.js";

const router = Router();

router.use(authRequired);


// Bulk reorder endpoint
router.put("/reorder/bulk", reorderTasks);

router.post("/", createTask);
router.get("/", getTasks);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

export default router;
