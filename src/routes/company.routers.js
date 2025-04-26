import express from "express";
import upload from "../middlewares/upload.js";
// import { signup, login, getRole } from "../controllers/auth.controller.js";
import { authorizeRoles } from "../middlewares/authMiddleware.js";
import { createCompanyWithOwner } from "../controllers/company.controller.js";

const router = express.Router();

router.post(
  "/create-compony",
  authorizeRoles("Admin","Company Owner"),
  createCompanyWithOwner
);

export default router;
