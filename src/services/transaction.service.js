import db from "../models/index.js";
import { Op } from "sequelize";

const { Transaction, Currency, SafeBalance, Safe, User, sequelize, Sequelize } =
  db;

/* ===========================
   Helpers: filters/includes/DTO
   =========================== */

const buildReportWhereClause = (user, filters) => {
  const whereClause = {};

  if (user?.roleName === "Company Owner") {
    whereClause["$from_safe.owner.company_id$"] = user.company_id;
  } else if (user?.roleName === "Branch Manager") {
    whereClause[Op.or] = [
      { "$from_safe.owner.branch_id$": user.branch_id },
      { "$to_safe.owner_for_to.branch_id$": user.branch_id },
    ];
  } else if (user?.roleName === "Teller") {
    whereClause[Op.or] = [
      { from_safe_id: user.safe_id },
      { to_safe_id: user.safe_id },
    ];
  }

  if (filters?.start_date && filters?.end_date) {
    whereClause.createdAt = {
      [Op.between]: [new Date(filters.start_date), new Date(filters.end_date)],
    };
  }

  if (filters?.type) whereClause.type = filters.type;
  if (filters?.status) whereClause.status = filters.status;

  if (filters?.user_id) {
    whereClause[Op.or] = [
      ...(whereClause[Op.or] || []),
      { "$from_safe.owner.id$": parseInt(filters.user_id, 10) },
      { "$to_safe.owner_for_to.id$": parseInt(filters.user_id, 10) },
    ];
  }

  if (filters?.branch_id) {
    whereClause[Op.and] = [
      ...(whereClause[Op.and] || []),
      {
        [Op.or]: [
          { "$from_safe.owner.branch_id$": filters.branch_id },
          { "$to_safe.owner_for_to.branch_id$": filters.branch_id },
        ],
      },
    ];
  }

  return whereClause;
};

export const reportIncludes = [
  {
    model: Safe,
    as: "from_safe",
    include: [
      {
        model: User,
        as: "owner",
        attributes: ["id", "name", "branch_id", "company_id"],
      },
    ],
  },
  {
    model: Safe,
    as: "to_safe",
    include: [
      {
        model: User,
        as: "owner_for_to",
        attributes: ["id", "name", "branch_id", "company_id"],
      },
    ],
  },
  {
    model: User,
    as: "customer",
    attributes: ["id", "name", "email", "phone"],
  },
];

export const buildGroupedReportPayload = (transactions) => {
  const grouped = {};

  for (const tx of transactions) {
    const fromSafeName = tx.from_safe?.name || null;
    const toSafeName = tx.to_safe?.name || null;

    const customerObj = tx.customer
      ? {
          id: tx.customer.id,
          name: tx.customer.name,
          email: tx.customer.email,
          phone: tx.customer.phone,
        }
      : {
          id: null,
          name: null,
          email: null,
          phone: tx.customer_phone || null,
        };

    let safe, userInfo;
    if (tx.type === "in" && tx.to_safe) {
      safe = tx.to_safe;
      userInfo = tx.to_safe.owner_for_to;
    } else if (tx.type === "out" && tx.from_safe) {
      safe = tx.from_safe;
      userInfo = tx.from_safe.owner;
    } else {
      continue;
    }
    if (!safe || !userInfo) continue;

    const key = safe.id;
    if (!grouped[key]) {
      grouped[key] = {
        safe_id: safe.id,
        safe_name: safe.name,
        teller_name: userInfo.name,
        branch_id: userInfo.branch_id,
        company_id: userInfo.company_id,
        transactions: [],
      };
    }

    grouped[key].transactions.push({
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
      customer: customerObj,
      reversed: !!tx.reversed,
      createdAt: tx.createdAt,
      updatedAt: tx.updatedAt,
    });
  }

  return Object.values(grouped);
};

/* ===========================
   Create OUT (buy/sell)
   =========================== */

export const createTransactionServiceOut = async (data, user) => {
  if (!data.customer_id && !data.customer_phone) {
    throw new Error("Either customer_id or customer_phone is required");
  }

  const t = await sequelize.transaction();
  try {
    let fromCurrencyId;
    let toCurrencyId;
    let convertedAmount;

    if (data.operation === "sell") {
      // base = SAR
      const baseCurrency = await Currency.findOne({
        where: { code: "SAR" },
        transaction: t,
        lock: t.LOCK.UPDATE,
      });
      if (!baseCurrency) throw new Error("Base currency (SAR) not found");
      fromCurrencyId = baseCurrency.id;

      if (!data.to_currency_id) throw new Error("please insert to_currency_id");
      toCurrencyId = data.to_currency_id;

      const toCurrency = await Currency.findByPk(toCurrencyId, {
        transaction: t,
        lock: t.LOCK.UPDATE,
      });
      const rate = Number(
        data.custom_exchange_rate || toCurrency?.sell_rate || 0
      );
      if (!rate) throw new Error("sell rate not found");

      convertedAmount = Number(data.amount) / rate;

      const fromBalance = await SafeBalance.findOne({
        where: { safe_id: user.safe_id, currency_id: fromCurrencyId },
        transaction: t,
        lock: t.LOCK.UPDATE,
      });
      if (
        !fromBalance ||
        Number(fromBalance.balance) < Number(convertedAmount)
      ) {
        throw new Error("Insufficient balance in safe");
      }
      fromBalance.balance =
        Number(fromBalance.balance) - Number(convertedAmount);
      await fromBalance.save({ transaction: t });

      const [toBalance] = await SafeBalance.findOrCreate({
        where: { safe_id: user.safe_id, currency_id: toCurrencyId },
        defaults: { balance: 0, updated_by: user.id },
        transaction: t,
      });
      toBalance.balance = Number(toBalance.balance) + Number(data.amount);
      toBalance.updated_by = user.id;
      await toBalance.save({ transaction: t });
    } else if (data.operation === "buy") {
      // base = SAR
      const baseCurrency = await Currency.findOne({
        where: { code: "SAR" },
        transaction: t,
        lock: t.LOCK.UPDATE,
      });
      if (!baseCurrency) throw new Error("Base currency (SAR) not found");
      toCurrencyId = baseCurrency.id;

      if (!data.from_currency_id)
        throw new Error("please insert from_currency_id");
      fromCurrencyId = data.from_currency_id;

      const fromCurrency = await Currency.findByPk(fromCurrencyId, {
        transaction: t,
        lock: t.LOCK.UPDATE,
      });
      const rate = Number(
        data.custom_exchange_rate || fromCurrency?.buy_rate || 0
      );
      if (!rate) throw new Error("buy rate not found");

      convertedAmount = Number(data.amount) * rate;

      const fromBalance = await SafeBalance.findOne({
        where: { safe_id: user.safe_id, currency_id: fromCurrencyId },
        transaction: t,
        lock: t.LOCK.UPDATE,
      });
      if (
        !fromBalance ||
        Number(fromBalance.balance) < Number(convertedAmount)
      ) {
        throw new Error("Insufficient balance in safe");
      }
      fromBalance.balance =
        Number(fromBalance.balance) - Number(convertedAmount);
      await fromBalance.save({ transaction: t });

      const [toBalance] = await SafeBalance.findOrCreate({
        where: { safe_id: user.safe_id, currency_id: toCurrencyId },
        defaults: { balance: 0, updated_by: user.id },
        transaction: t,
      });
      toBalance.balance = Number(toBalance.balance) + Number(data.amount);
      toBalance.updated_by = user.id;
      await toBalance.save({ transaction: t });
    } else {
      throw new Error("Invalid operation type");
    }

    if (data.customer_id) {
      const customer = await User.findOne({
        where: { id: data.customer_id, is_active: true, role_id: 6 },
        transaction: t,
        lock: t.LOCK.UPDATE,
      });
      if (!customer)
        throw new Error("Invalid customer: not found or not a customer role");
    }

    const newTransaction = await Transaction.create(
      {
        from_safe_id: user.safe_id,
        to_safe_id: null,
        from_currency_id: fromCurrencyId,
        to_currency_id: toCurrencyId,
        amount: data.amount,
        converted_amount: convertedAmount,
        type: "out",
        status: "approved",
        operation: data.operation,
        description: data.description || null,
        customer_id: data.customer_id || null,
        notes: data.notes || null,
        customer_phone: data.customer_phone || null,
        reversed: false,
      },
      { transaction: t }
    );

    await t.commit();
    return newTransaction;
  } catch (err) {
    await t.rollback();
    throw err;
  }
};

/* ===========================
   Transfer (create)
   =========================== */

export const createTransferTransaction = async (data, user) => {
  const t = await sequelize.transaction();
  try {
    const {
      to_safe_id,
      currency_id,
      amount,
      description,
      notes,
      customer_phone,
    } = data;

    if (!to_safe_id || !currency_id || !amount)
      throw new Error("Missing required fields");
    if (to_safe_id === user.safe_id)
      throw new Error("Cannot transfer to the same safe");

    const fromBalance = await SafeBalance.findOne({
      where: { safe_id: user.safe_id, currency_id },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });
    if (!fromBalance || Number(fromBalance.balance) < Number(amount)) {
      throw new Error("Insufficient balance in source safe");
    }

    fromBalance.balance = Number(fromBalance.balance) - Number(amount);
    await fromBalance.save({ transaction: t });

    const newTransaction = await Transaction.create(
      {
        from_safe_id: user.safe_id,
        to_safe_id,
        from_currency_id: currency_id,
        to_currency_id: currency_id,
        amount,
        converted_amount: amount,
        type: "in",
        status: "pending",
        operation: "transfer",
        description: description || null,
        notes: notes || null,
        customer_phone: customer_phone || null,
        reversed: false,
      },
      { transaction: t }
    );

    await t.commit();
    return newTransaction;
  } catch (err) {
    await t.rollback();
    throw err;
  }
};

/* ===========================
   Approve Transfer
   =========================== */

export const approveTransactionService = async (
  transactionId,
  approverUser
) => {
  const t = await sequelize.transaction();
  try {
    const pendingTransaction = await Transaction.findOne({
      where: {
        id: transactionId,
        status: "pending" /*, operation: "transfer"*/,
      },
      transaction: t,
      lock: Sequelize.Transaction.LOCK.UPDATE,
    });
    if (!pendingTransaction)
      throw new Error("Transaction not found or already approved/rejected");

    if (pendingTransaction.to_safe_id !== approverUser.safe_id) {
      throw new Error("You are not authorized to approve this transaction");
    }

    const [toBalance] = await SafeBalance.findOrCreate({
      where: {
        safe_id: pendingTransaction.to_safe_id,
        currency_id: pendingTransaction.to_currency_id,
      },
      defaults: { balance: 0, updated_by: approverUser.id },
      transaction: t,
    });

    toBalance.balance =
      Number(toBalance.balance) + Number(pendingTransaction.amount);
    toBalance.updated_by = approverUser.id;
    await toBalance.save({ transaction: t });

    pendingTransaction.status = "approved";
    pendingTransaction.updated_by = approverUser.id;
    await pendingTransaction.save({ transaction: t });

    await t.commit();
    return pendingTransaction;
  } catch (err) {
    await t.rollback();
    throw err;
  }
};

/* ===========================
   Reverse Transaction
   =========================== */

export const reverseTransactionService = async (transactionId, actorUser) => {
  const t = await sequelize.transaction();
  try {
    const tx = await Transaction.findOne({
      where: { id: transactionId },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });
    if (!tx) throw new Error("Transaction not found");
    if (tx.reversed) throw new Error("Transaction already reversed");

    if (
      actorUser.safe_id !== tx.from_safe_id &&
      (tx.to_safe_id ? actorUser.safe_id !== tx.to_safe_id : true)
    ) {
      throw new Error("You are not authorized to reverse this transaction");
    }

    if (tx.operation === "transfer") {
      if (tx.status === "pending") {
        const [fromBal] = await SafeBalance.findOrCreate({
          where: { safe_id: tx.from_safe_id, currency_id: tx.from_currency_id },
          defaults: { balance: 0, updated_by: actorUser.id },
          transaction: t,
        });
        fromBal.balance = Number(fromBal.balance) + Number(tx.amount);
        fromBal.updated_by = actorUser.id;
        await fromBal.save({ transaction: t });

        tx.status = "rejected";
        tx.reversed = true;
        await tx.save({ transaction: t });
        await t.commit();
        return tx;
      }
      if (tx.status === "approved") {
        const toBal = await SafeBalance.findOne({
          where: { safe_id: tx.to_safe_id, currency_id: tx.to_currency_id },
          transaction: t,
          lock: t.LOCK.UPDATE,
        });
        if (!toBal || Number(toBal.balance) < Number(tx.amount)) {
          throw new Error("Insufficient balance in recipient safe to reverse");
        }
        toBal.balance = Number(toBal.balance) - Number(tx.amount);
        toBal.updated_by = actorUser.id;
        await toBal.save({ transaction: t });

        const [fromBal] = await SafeBalance.findOrCreate({
          where: { safe_id: tx.from_safe_id, currency_id: tx.from_currency_id },
          defaults: { balance: 0, updated_by: actorUser.id },
          transaction: t,
        });
        fromBal.balance = Number(fromBal.balance) + Number(tx.amount);
        fromBal.updated_by = actorUser.id;
        await fromBal.save({ transaction: t });

        tx.reversed = true;
        await tx.save({ transaction: t });
        await t.commit();
        return tx;
      }
      throw new Error("Unsupported transfer status for reversal");
    }

    const safeId = tx.from_safe_id;

    const [fromBal] = await SafeBalance.findOrCreate({
      where: { safe_id: safeId, currency_id: tx.from_currency_id },
      defaults: { balance: 0, updated_by: actorUser.id },
      transaction: t,
    });
    const toBal = await SafeBalance.findOne({
      where: { safe_id: safeId, currency_id: tx.to_currency_id },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });
    if (!toBal || Number(toBal.balance) < Number(tx.amount)) {
      throw new Error("Insufficient balance to reverse");
    }

    fromBal.balance =
      Number(fromBal.balance) + Number(tx.converted_amount || 0);
    fromBal.updated_by = actorUser.id;
    await fromBal.save({ transaction: t });

    toBal.balance = Number(toBal.balance) - Number(tx.amount);
    toBal.updated_by = actorUser.id;
    await toBal.save({ transaction: t });

    tx.reversed = true;
    await tx.save({ transaction: t });

    await t.commit();
    return tx;
  } catch (err) {
    await t.rollback();
    throw err;
  }
};

/* ===========================
   Reports
   =========================== */

export const getGroupedTransactionReportService = async (user, filters) => {
  const whereClause = buildReportWhereClause(user, filters);

  let page = parseInt(filters.page, 10);
  let limit = parseInt(filters.limit, 10);
  page = isNaN(page) || page < 1 ? 1 : page;
  limit = isNaN(limit) || limit < 1 ? 20 : Math.min(limit, 50);
  const offset = (page - 1) * limit;

  const { count, rows } = await Transaction.findAndCountAll({
    where: whereClause,
    include: reportIncludes,
    order: [["createdAt", "DESC"]],
    subQuery: false,
    limit,
    offset,
  });

  const data = buildGroupedReportPayload(rows);
  return {
    data,
    pagination: {
      page,
      limit,
      total: count,
      totalPages: Math.ceil(count / limit),
    },
  };
};

export const getGroupedTransactionReportAllService = async (user, filters) => {
  const whereClause = buildReportWhereClause(user, filters);

  const rows = await Transaction.findAll({
    where: whereClause,
    include: reportIncludes,
    order: [["createdAt", "DESC"]],
    subQuery: false,
  });

  const data = buildGroupedReportPayload(rows);
  return { data };
};

/* ===========================
   Bulk
   =========================== */

export const createBulkTransactionsService = async (items, user) => {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("transactions array is required");
  }

  const results = [];
  for (let i = 0; i < items.length; i++) {
    const payload = items[i];
    try {
      let created;
      if (payload.operation === "transfer") {
        created = await createTransferTransaction(payload, user);
      } else {
        if (!payload.customer_id && !payload.customer_phone) {
          throw new Error("Either customer_id or customer_phone is required");
        }
        created = await createTransactionServiceOut(payload, user);
      }
      results.push({ index: i, success: true, data: created });
    } catch (e) {
      results.push({ index: i, success: false, error: e.message });
    }
  }
  return results;
};
