import express from "express";
import upload from "../middlewares/upload.js";
import { signup, login, getRole } from "../controllers/auth.controller.js";
import { authorizeRoles } from "../middlewares/authMiddleware.js";
const router = express.Router();
router.post(
  "/signup",
  authorizeRoles("Admin"),
  upload.single("avatar"),
  signup
);

router.post("/login", login);

router.get("/roles", getRole);

export default router;
