import { Router } from "express";


const router = Router();

router.get("/profile", (req, res) => {
    res.json({ message: "User profile" });
});

router.get("/tasks", (req, res) => {
    res.json({ message: "User tasks" });
});

export default router;
