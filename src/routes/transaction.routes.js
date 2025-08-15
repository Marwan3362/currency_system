import express from "express";
import {
  createTransaction,
  createTransfer,
  approveTransaction,
  reverseTransaction,
  getGroupedTransactionReport,
  getGroupedTransactionReportAll,
  createBulkTransactions,
} from "../controllers/transaction.controller.js";
import { authenticateToken } from "../middlewares/authenticateToken.js";
import { auditLogger } from "../middlewares/auditLogger.js";

const router = express.Router();


router.post(
  "/create/out",
  authenticateToken,
  auditLogger({
    table: "transactions",
    action: () => "transactions:create_out",
    getId: (req) => req.auditId || null,
    getChanges: (req) => ({ body: req.body }),
  }),
  createTransaction
);

router.post(
  "/create/in",
  authenticateToken,
  auditLogger({
    table: "transactions",
    action: () => "transactions:create_transfer",
    getId: (req) => req.auditId || null,
    getChanges: (req) => ({ body: req.body }),
  }),
  createTransfer
);

router.post(
  "/create/bulk",
  authenticateToken,
  auditLogger({
    table: "transactions",
    action: () => "transactions:create_bulk",
    getId: () => null,
    getChanges: (req) => ({
      items: Array.isArray(req.body?.transactions)
        ? req.body.transactions.length
        : 0,
    }),
  }),
  createBulkTransactions
);

router.post(
  "/active/:id",
  authenticateToken,
  auditLogger({
    table: "transactions",
    action: (req) => `transactions:approve:${req.params.id}`,
    getId: (req) => req.params.id,
    getChanges: (req) => ({ approved_by: req.user?.id }),
  }),
  approveTransaction
);

router.post(
  "/reverse/:id",
  authenticateToken,
  auditLogger({
    table: "transactions",
    action: (req) => `transactions:reverse:${req.params.id}`,
    getId: (req) => req.params.id,
    getChanges: (req, res) =>
      res.locals?.after ? { result: res.locals.after } : null,
  }),
  reverseTransaction
);

router.get("/report/grouped", authenticateToken, getGroupedTransactionReport);
router.get(
  "/report/grouped/all",
  authenticateToken,
  getGroupedTransactionReportAll
);

export default router;
