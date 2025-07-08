import express from "express";
import {
  fetchAllSafes,
  fetchSafeById,
  fetchSafeByUserId,
  fetchSafeWithBalances,
  addBalanceToSafeHandler,
} from "../controllers/safe.controller.js";
import { authenticateToken } from "../middlewares/authenticateToken.js";
import { authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get(
  "/",
  authenticateToken,
  authorizeRoles("Admin", "Company Owner", "Branch Manager", "Teller"),
  fetchAllSafes
);

router.get(
  "/:safeId",
  authenticateToken,
  authorizeRoles("Admin", "Company Owner", "Branch Manager", "Teller"),
  fetchSafeById
);

router.get(
  "/by-user/:userId",
  authenticateToken,
  authorizeRoles("Admin", "Company Owner", "Branch Manager", "Teller"),
  fetchSafeByUserId
);

router.get(
  "/:safeId/balances",
  authenticateToken,
  authorizeRoles("Admin", "Company Owner", "Branch Manager", "Teller"),
  fetchSafeWithBalances
);

router.post(
  "/add-balance",
  authenticateToken,
  authorizeRoles("Admin", "Company Owner"),
  addBalanceToSafeHandler
);
export default router;
