// src/services/transaction.service.js

import db from "../models/index.js";
// import sequelize from "../config/db.js";
import { Op } from "sequelize";

const { Transaction, Currency, SafeBalance, Safe, User, sequelize, Sequelize } =
  db;

export const createTransactionServiceOut = async (data, user) => {
  console.log("Received operation:", data.operation);

  const transaction = await sequelize.transaction();
  try {
    let fromCurrencyId;
    let toCurrencyId;
    let checkAmount;
    let convertedAmount;
    if (data.operation === "sell") {
      const baseCurrency = await Currency.findOne({ where: { code: "SAR" } });
      if (!baseCurrency) throw new Error("Base currency (SAR) not found");
      fromCurrencyId = baseCurrency.id;

      // fromCurrencyId = 3;
      if (!data.to_currency_id) {
        throw new Error("please insert to_currency_id");
      }
      toCurrencyId = data.to_currency_id;

      const toCurrency = await Currency.findByPk(toCurrencyId);
      if (!toCurrency || !toCurrency.sell_rate) {
        throw new Error("sell rate not found");
      }

      // checkAmount = data.amount;
      convertedAmount = data.amount / toCurrency.sell_rate;

      const fromBalance = await SafeBalance.findOne({
        where: {
          safe_id: user.safe_id,
          currency_id: fromCurrencyId,
        },
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (!fromBalance || fromBalance.balance < convertedAmount) {
        throw new Error("Insufficient balance in safe");
      }

      fromBalance.balance -= convertedAmount;
      await fromBalance.save({ transaction });

      const [toBalance] = await SafeBalance.findOrCreate({
        where: {
          safe_id: user.safe_id,
          currency_id: toCurrencyId,
        },
        defaults: {
          balance: 0,
          updated_by: user.id,
        },
        transaction,
      });

      toBalance.balance += data.amount;
      await toBalance.save({ transaction });
    } else if (data.operation === "buy") {
      const baseCurrency = await Currency.findOne({ where: { code: "SAR" } });
      if (!baseCurrency) throw new Error("Base currency (SAR) not found");
      toCurrencyId = baseCurrency.id;
      // toCurrencyId = 3;
      if (!data.from_currency_id) {
        throw new Error("please insert from_currency_id");
      }
      fromCurrencyId = data.from_currency_id;

      const fromCurrency = await Currency.findByPk(fromCurrencyId);
      if (!fromCurrency || !fromCurrency.buy_rate) {
        throw new Error("Target currency or buy rate not found");
      }

      // convertedAmount = data.amount;
      convertedAmount = data.amount * fromCurrency.buy_rate;

      const fromBalance = await SafeBalance.findOne({
        where: {
          safe_id: user.safe_id,
          currency_id: fromCurrencyId,
        },
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (!fromBalance || fromBalance.balance < convertedAmount) {
        throw new Error("Insufficient balance in safe");
      }

      fromBalance.balance -= convertedAmount;
      await fromBalance.save({ transaction });

      const [toBalance] = await SafeBalance.findOrCreate({
        where: {
          safe_id: user.safe_id,
          currency_id: toCurrencyId,
        },
        defaults: {
          balance: 0,
          updated_by: user.id,
        },
        transaction,
      });

      toBalance.balance += data.amount;
      await toBalance.save({ transaction });
    } else {
      throw new Error("Invalid operation type");
    }

    if (data.customer_id) {
      const customer = await User.findOne({
        where: {
          id: data.customer_id,
          is_active: true,
          role_id: 6,
        },
      });

      if (!customer) {
        throw new Error("Invalid customer: not found or not a customer role");
      }
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
      },
      { transaction }
    );

    await transaction.commit();
    return newTransaction;
  } catch (err) {
    await transaction.rollback();
    console.error("Transaction error:", err.message);
    throw err;
  }
};

export const createTransferTransaction = async (data, user) => {
  const transaction = await sequelize.transaction();
  try {
    const { to_safe_id, currency_id, amount, description } = data;

    if (!to_safe_id || !currency_id || !amount) {
      throw new Error("Missing required fields");
    }

    if (to_safe_id === user.safe_id) {
      throw new Error("Cannot transfer to the same safe");
    }

    const fromBalance = await SafeBalance.findOne({
      where: {
        safe_id: user.safe_id,
        currency_id,
      },
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!fromBalance || fromBalance.balance < amount) {
      throw new Error("Insufficient balance in source safe");
    }

    fromBalance.balance -= amount;
    await fromBalance.save({ transaction });

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
      },
      { transaction }
    );

    await transaction.commit();
    return newTransaction;
  } catch (err) {
    await transaction.rollback();
    console.error("Transfer creation error:", err.message);
    throw err;
  }
};

export const approveTransactionService = async (
  transactionId,
  approverUser
) => {
  const t = await sequelize.transaction();
  try {
    const pendingTransaction = await Transaction.findOne({
      where: {
        id: transactionId,
        status: "pending",
        // operation: "transfer",
      },
      transaction: t,
      lock: Sequelize.Transaction.LOCK.UPDATE,
    });

    if (!pendingTransaction) {
      throw new Error("Transaction not found or already approved/rejected");
    }

    // ✅ Ensure only recipient safe owner can approve
    if (pendingTransaction.to_safe_id !== approverUser.safe_id) {
      throw new Error("You are not authorized to approve this transaction");
    }

    // ✅ Add amount to recipient's balance
    const [toBalance] = await SafeBalance.findOrCreate({
      where: {
        safe_id: pendingTransaction.to_safe_id,
        currency_id: pendingTransaction.to_currency_id,
      },
      defaults: {
        balance: 0,
        updated_by: approverUser.id,
      },
      transaction: t,
    });

    toBalance.balance += pendingTransaction.amount;
    toBalance.updated_by = approverUser.id;
    await toBalance.save({ transaction: t });

    // ✅ Mark transaction as approved
    pendingTransaction.status = "approved";
    pendingTransaction.updated_by = approverUser.id;
    await pendingTransaction.save({ transaction: t });

    await t.commit();
    return pendingTransaction;
  } catch (err) {
    await t.rollback();
    console.error("Approve Transaction Error:", err.message);
    throw err;
  }
};
// export const getGroupedTransactionReportService = async (user, filters) => {
//   const whereClause = {};

//   if (user.roleName === "Company Owner") {
//     // whereClause.company_id = user.company_id;
//     whereClause["$from_safe.owner.company_id$"] = user.company_id;
//   } else if (user.roleName === "Branch Manager") {
//     whereClause[Op.or] = [
//       { "$from_safe.owner.branch_id$": user.branch_id },
//       { "$to_safe.owner_for_to.branch_id$": user.branch_id },
//     ];
//   } else if (user.roleName === "Teller") {
//     whereClause[Op.or] = [
//       { from_safe_id: user.safe_id },
//       { to_safe_id: user.safe_id },
//     ];
//   }

//   if (filters.start_date && filters.end_date) {
//     whereClause.createdAt = {
//       [Op.between]: [new Date(filters.start_date), new Date(filters.end_date)],
//     };
//   }

//   if (filters.type) {
//     whereClause.type = filters.type;
//   }

//   if (filters.status) {
//     whereClause.status = filters.status;
//   }

//   if (filters.user_id) {
//     whereClause[Op.or] = [
//       { "$from_safe.owner.id$": parseInt(filters.user_id) },
//       { "$to_safe.owner_for_to.id$": parseInt(filters.user_id) },
//     ];
//   }

//   if (filters.branch_id) {
//     whereClause[Op.and] = [
//       ...(whereClause[Op.and] || []),
//       {
//         [Op.or]: [
//           { "$from_safe.owner.branch_id$": filters.branch_id },
//           { "$to_safe.owner_for_to.branch_id$": filters.branch_id },
//         ],
//       },
//     ];
//   }

//   const transactions = await Transaction.findAll({
//     where: whereClause,
//     include: [
//       {
//         model: Safe,
//         as: "from_safe",
//         include: [
//           {
//             model: User,
//             as: "owner",
//             attributes: ["id", "name", "branch_id", "company_id"],
//           },
//         ],
//       },
//       {
//         model: Safe,
//         as: "to_safe",
//         include: [
//           {
//             model: User,
//             as: "owner_for_to",
//             attributes: ["id", "name", "branch_id", "company_id"],
//           },
//         ],
//       },
//     ],
//     order: [["createdAt", "DESC"]],
//     subQuery: false,
//   });

//   const grouped = {};

//   for (const tx of transactions) {
//     let safe, userInfo;

//     if (tx.type === "in" && tx.to_safe) {
//       safe = tx.to_safe;
//       userInfo = tx.to_safe.owner_for_to;
//     } else if (tx.type === "out" && tx.from_safe) {
//       safe = tx.from_safe;
//       userInfo = tx.from_safe.owner;
//     } else {
//       continue; // skip if data is incomplete
//     }

//     if (!safe || !userInfo) continue;

//     const key = safe.id;

//     if (!grouped[key]) {
//       grouped[key] = {
//         safe_id: safe.id,
//         safe_name: safe.name,
//         teller_name: userInfo.name,
//         branch_id: userInfo.branch_id,
//         company_id: userInfo.company_id,
//         transactions: [],
//       };
//     }

//     const transactionEntry = {
//       id: tx.id,
//       amount: tx.amount,
//       type: tx.type,
//       status: tx.status,
//       createdAt: tx.createdAt,
//       description: tx.description,
//     };

//     if (tx.type === "in") {
//       transactionEntry.from_safe_name = tx.from_safe?.name || null;
//       transactionEntry.to_safe_name = tx.to_safe?.name || null;
//     } else if (tx.type === "out") {
//       transactionEntry.from_safe_name = tx.from_safe?.name || null;
//     }

//     grouped[key].transactions.push(transactionEntry);
//   }

//   return Object.values(grouped);
// };

export const getGroupedTransactionReportService = async (user, filters) => {
  const whereClause = {};

  if (user.roleName === "Company Owner") {
    whereClause["$from_safe.owner.company_id$"] = user.company_id;
  } else if (user.roleName === "Branch Manager") {
    whereClause[Op.or] = [
      { "$from_safe.owner.branch_id$": user.branch_id },
      { "$to_safe.owner_for_to.branch_id$": user.branch_id },
    ];
  } else if (user.roleName === "Teller") {
    whereClause[Op.or] = [
      { from_safe_id: user.safe_id },
      { to_safe_id: user.safe_id },
    ];
  }

  if (filters.start_date && filters.end_date) {
    whereClause.createdAt = {
      [Op.between]: [new Date(filters.start_date), new Date(filters.end_date)],
    };
  }

  if (filters.type) {
    whereClause.type = filters.type;
  }

  if (filters.status) {
    whereClause.status = filters.status;
  }

  if (filters.user_id) {
    whereClause[Op.or] = [
      { "$from_safe.owner.id$": parseInt(filters.user_id) },
      { "$to_safe.owner_for_to.id$": parseInt(filters.user_id) },
    ];
  }

  if (filters.branch_id) {
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

  let page = parseInt(filters.page);
  let limit = parseInt(filters.limit);

  page = isNaN(page) || page < 1 ? 1 : page;
  limit = isNaN(limit) || limit < 1 ? 20 : Math.min(limit, 50);

  const offset = (page - 1) * limit;

  const { count, rows: transactions } = await Transaction.findAndCountAll({
    where: whereClause,
    include: [
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
    ],
    order: [["createdAt", "DESC"]],
    subQuery: false,
    limit,
    offset,
  });

  const grouped = {};

  for (const tx of transactions) {
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

    const transactionEntry = {
      id: tx.id,
      amount: tx.amount,
      type: tx.type,
      status: tx.status,
      createdAt: tx.createdAt,
      description: tx.description,
    };

    if (tx.type === "in") {
      transactionEntry.from_safe_name = tx.from_safe?.name || null;
      transactionEntry.to_safe_name = tx.to_safe?.name || null;
    } else if (tx.type === "out") {
      transactionEntry.from_safe_name = tx.from_safe?.name || null;
    }

    grouped[key].transactions.push(transactionEntry);
  }

  return {
    data: Object.values(grouped),
    pagination: {
      page,
      limit,
      total: count,
      totalPages: Math.ceil(count / limit),
    },
  };
};
