// routes/transactionReport.routes.js
import express from "express";
import TransactionReportController from "../controllers/transactionReport.controller.js";
import { authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post(
  "/transaction-report",
//   authorizeRoles("Admin", "Company Owner", "Branch Manager"),
  TransactionReportController.getUnifiedTransactions
);

export default router;
