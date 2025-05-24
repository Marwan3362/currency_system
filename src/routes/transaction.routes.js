import express from "express";
import TransactionController from "../controllers/transaction.controller.js";
import SafeTransferController from "../controllers/safeTransfer.controller.js";
import { authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post(
  "/transactions",
  authorizeRoles("Admin", "Company Owner", "Branch Manager", "Teller"),
  TransactionController.createTransaction
);

router.post(
  "/transactions",
  authorizeRoles("Admin", "Company Owner", "Branch Manager", "Teller"),
  TransactionController.getTransactionsByUser
);
router.post(
  "/safe-transfer",
  authorizeRoles("Admin", "Company Owner", "Branch Manager"),
  SafeTransferController.createTransfer
);

router.post(
  "/safe-transfer/approve",
  authorizeRoles("Admin", "Company Owner", "Branch Manager"),
  SafeTransferController.approveTransfer
);

router.post(
  "/transactions/by-safe",
  authorizeRoles("Admin", "Company Owner", "Branch Manager", "Teller"),
  SafeTransferController.getTransfersByUser
);
export default router;
