import { Router } from "express";
import { authRequired } from "../middleware/auth.middleware.js";
import { register, login, getProfile, updateProfile } from "../controllers/auth.controller.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", authRequired, getProfile);
router.put("/profile", authRequired, updateProfile);

export default router;
