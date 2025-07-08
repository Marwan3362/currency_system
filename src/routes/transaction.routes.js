import express from "express";
import {
  createTransaction,
  createTransfer,
  approveTransaction,
  getGroupedTransactionReport,
  //   approveTransaction,
} from "../controllers/transaction.controller.js";
import { authenticateToken } from "../middlewares/authenticateToken.js";

const router = express.Router();

router.post("/create/out", authenticateToken, createTransaction);
router.post("/create/in", authenticateToken, createTransfer);
router.post("/active/:id", authenticateToken, approveTransaction);
router.get("/report/grouped", authenticateToken, getGroupedTransactionReport);

export default router;
