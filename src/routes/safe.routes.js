import express from "express";
import SafeController from "../controllers/safe.controller.js";
import { authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get(
  "/safes",
  authorizeRoles("Admin", "Company Owner"),
  SafeController.getAllSafes
);

router.post(
  "/safes/by-user",
  authorizeRoles("Admin", "Company Owner"),
  SafeController.getSafeByUserId
);

router.post(
  "/safes/by-branch",
  authorizeRoles("Admin", "Company Owner", "Branch Manager"),
  SafeController.getSafesByBranchId
);

export default router;
