import db from "../models/index.js";
import {
  createTransactionServiceOut,
  createTransferTransaction,
  approveTransactionService,
  reverseTransactionService,
  getGroupedTransactionReportService,
  getGroupedTransactionReportAllService,
  createBulkTransactionsService,
  reportIncludes,
} from "../services/transaction.service.js";
import {
  createTransactionSchema,
  createTransferSchema,
} from "../validations/Transaction.validation.js";

const { Transaction } = db;

const send = (res, status, payload) => res.status(status).json(payload);
const ok = (res, message, data, meta) =>
  send(res, 200, { success: true, message, data, ...(meta ? { meta } : {}) });
const created = (res, message, data, meta) =>
  send(res, 201, { success: true, message, data, ...(meta ? { meta } : {}) });
const badRequest = (res, message, errors) =>
  send(res, 400, {
    success: false,
    code: "VALIDATION_ERROR",
    message,
    ...(errors ? { errors } : {}),
  });
const authError = (res, message) =>
  send(res, 403, { success: false, code: "AUTH_ERROR", message });
const serverError = (res, message) =>
  send(res, 500, { success: false, code: "SERVER_ERROR", message });

const toTransactionDTO = (tx) => {
  if (!tx) return null;
  const fromSafeName = tx.from_safe?.name || null;
  const toSafeName = tx.to_safe?.name || null;

  const customer = tx.customer
    ? {
        id: tx.customer.id,
        name: tx.customer.name,
        email: tx.customer.email,
        phone: tx.customer.phone,
      }
    : { id: null, name: null, email: null, phone: tx.customer_phone || null };

  return {
    id: tx.id,
    type: tx.type,
    status: tx.status,
    operation: tx.operation,
    amount: tx.amount,
    converted_amount: tx.converted_amount,
    from_safe_id: tx.from_safe_id,
    to_safe_id: tx.to_safe_id,
    from_safe_name: fromSafeName,
    to_safe_name: toSafeName,
    from_currency_id: tx.from_currency_id,
    to_currency_id: tx.to_currency_id,
    description: tx.description,
    notes: tx.notes || null,
    reversed: !!tx.reversed,
    customer,
    createdAt: tx.createdAt,
    updatedAt: tx.updatedAt,
  };
};

const loadTxDTOById = async (id) => {
  const full = await Transaction.findByPk(id, { include: reportIncludes });
  return toTransactionDTO(full);
};


export const createTransaction = async (req, res) => {
  try {
    const data = await createTransactionSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });
    if (!data.customer_id && !data.customer_phone) {
      return badRequest(res, "Either customer_id or customer_phone is required");
    }

    const createdTx = await createTransactionServiceOut(data, req.user);

    req.auditId = createdTx.id;
    res.locals.after = {
      id: createdTx.id,
      op: createdTx.operation,
      amount: createdTx.amount,
      status: createdTx.status,
    };

    const dto = await loadTxDTOById(createdTx.id);
    return created(res, "Transaction created successfully", dto);
  } catch (err) {
    if (err.name === "ValidationError") {
      return badRequest(
        res,
        "Validation error",
        err.errors?.map((e) => ({ field: null, message: e }))
      );
    }
    console.error("createTransaction error:", err);
    return serverError(res, err.message || "Server Error");
  }
};

export const createTransfer = async (req, res) => {
  try {
    const data = await createTransferSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    const tx = await createTransferTransaction(data, req.user);

    req.auditId = tx.id;
    res.locals.after = {
      id: tx.id,
      op: tx.operation,
      amount: tx.amount,
      status: tx.status,
      to_safe_id: tx.to_safe_id,
    };

    const dto = await loadTxDTOById(tx.id);
    return created(res, "Transfer transaction request created", dto);
  } catch (err) {
    if (err.name === "ValidationError") {
      return badRequest(
        res,
        "Validation error",
        err.errors?.map((e) => ({ field: null, message: e }))
      );
    }
    console.error("createTransfer error:", err);
    return serverError(res, err.message || "Server Error");
  }
};

export const approveTransaction = async (req, res) => {
  try {
    const transactionId = parseInt(req.params.id, 10);
    if (isNaN(transactionId)) {
      return badRequest(res, "Invalid transaction ID");
    }

    const updated = await approveTransactionService(transactionId, req.user);

    res.locals.after = { id: updated.id, status: updated.status };

    const dto = await loadTxDTOById(updated.id);
    return ok(res, "Transaction approved successfully", dto);
  } catch (err) {
    if (/not authorized/i.test(err.message)) {
      return authError(res, err.message);
    }
    console.error("approveTransaction error:", err);
    return serverError(res, err.message || "Server Error");
  }
};

export const reverseTransaction = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return badRequest(res, "Invalid transaction ID");

    const reversedTx = await reverseTransactionService(id, req.user);

    res.locals.after = {
      id: reversedTx.id,
      reversed: reversedTx.reversed,
      status: reversedTx.status,
    };

    const dto = await loadTxDTOById(reversedTx.id);
    return ok(res, "Transaction reversed successfully", dto);
  } catch (err) {
    if (/not authorized/i.test(err.message)) {
      return authError(res, err.message);
    }
    console.error("reverseTransaction error:", err);
    return serverError(res, err.message || "Server Error");
  }
};

export const getGroupedTransactionReport = async (req, res) => {
  try {
    const filters = req.query;
    const user = req.user;
    const io = req.app.get("io");

    const result = await getGroupedTransactionReportService(user, filters);
    if (io) io.emit("groupedTransactionReportFetched", result);

    return ok(
      res,
      "Filtered grouped report generated successfully",
      result.data,
      { pagination: result.pagination }
    );
  } catch (err) {
    console.error("getGroupedTransactionReport error:", err);
    return serverError(res, err.message || "Server Error");
  }
};

export const getGroupedTransactionReportAll = async (req, res) => {
  try {
    const filters = req.query;
    const user = req.user;

    const result = await getGroupedTransactionReportAllService(user, filters);
    return ok(res, "Full grouped report generated successfully", result.data);
  } catch (err) {
    console.error("getGroupedTransactionReportAll error:", err);
    return serverError(res, err.message || "Server Error");
  }
};

export const createBulkTransactions = async (req, res) => {
  try {
    const { transactions } = req.body;
    if (!Array.isArray(transactions) || transactions.length === 0) {
      return badRequest(res, "transactions array is required");
    }

    const results = await createBulkTransactionsService(transactions, req.user);

    const mapped = await Promise.all(
      results.map(async (r) => {
        if (!r.success) return r;
        const dto = await loadTxDTOById(r.data.id);
        return { index: r.index, success: true, transaction: dto };
      })
    );

    res.locals.after = { processed: mapped.length };

    return created(res, "Bulk processing finished", { results: mapped });
  } catch (err) {
    console.error("createBulkTransactions error:", err);
    return serverError(res, err.message || "Server Error");
  }
};
