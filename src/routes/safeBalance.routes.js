import express from "express";
import SafeBalanceController from "../controllers/safeBalance.controller.js";
import { authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post(
  "/safe-balance",
  // authorizeRoles("Admin", "Company Owner"),
  SafeBalanceController.upsertBalance
);

router.get(
  "/safe-balance/get",
  authorizeRoles("Admin", "Company Owner", "Branch Manager", "Teller"),
  SafeBalanceController.getBySafeId
);

router.post(
  "/safe-balance/clear",
  authorizeRoles("Admin", "Company Owner"),
  SafeBalanceController.clearIfEmpty
);

export default router;
