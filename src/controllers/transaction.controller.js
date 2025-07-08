import {
  createTransactionSchema,
  createTransferSchema,
} from "../validations/Transaction.validation.js";
import {
  createTransactionServiceOut,
  createTransferTransaction,
  approveTransactionService,
  getGroupedTransactionReportService,
} from "../services/transaction.service.js";

export const createTransaction = async (req, res) => {
  try {
    const data = await createTransactionSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    const result = await createTransactionServiceOut(data, req.user);

    res.status(201).json({
      success: true,
      message: "Transaction created successfully",
      data: result,
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ success: false, errors: err.errors });
    }

    console.error("Transaction error:", err.message);
    res.status(500).json({
      success: false,
      message: err.message || "Server Error",
    });
  }
};

export const createTransfer = async (req, res) => {
  try {
    const data = await createTransferSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    const result = await createTransferTransaction(data, req.user);

    res.status(201).json({
      success: true,
      message: "Transfer transaction request created",
      data: result,
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ success: false, errors: err.errors });
    }
    console.error("Transfer error:", err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const approveTransaction = async (req, res) => {
  try {
    const transactionId = parseInt(req.params.id);
    if (isNaN(transactionId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid transaction ID" });
    }

    const result = await approveTransactionService(transactionId, req.user);

    return res.status(200).json({
      success: true,
      message: "Transaction approved successfully",
      data: result,
    });
  } catch (err) {
    console.error("Approve error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};
export const getGroupedTransactionReport = async (req, res) => {
  try {
    const filters = req.query;
    const user = req.user;
    const io = req.app.get("io");

    const result = await getGroupedTransactionReportService(user, filters);

    io.emit("groupedTransactionReportFetched", result);

    res.status(200).json({
      success: true,
      message: "Filtered grouped report generated successfully",
      data: result,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
