import express from "express";
import upload from "../middlewares/upload.js";
import { signup, login, getRole } from "../controllers/auth.controller.js";
import { authorizeRoles } from "../middlewares/authMiddleware.js";
import { createCompanyWithOwner } from "../controllers/company.controller.js";

const router = express.Router();
router.post(
  "/signup",
  authorizeRoles("Admin", "Company Owner", "Branch Manager"),
  upload.single("avatar"),
  signup
);

router.post("/login", login);

router.get("/roles", authorizeRoles("Admin"), getRole);

router.post("/create-compony", authorizeRoles("Admin"), createCompanyWithOwner);

export default router;
