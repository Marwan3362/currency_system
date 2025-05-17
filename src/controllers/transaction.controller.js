// controllers/transaction.controller.js
import TransactionService from "../services/transaction.service.js";
import { createTransactionSchema } from "../validations/Transaction.validation.js";
import Transaction from "../models/Transaction.js";
import Currency from "../models/Currency.js";
import Safe from "../models/Safe.js";
import User from "../models/user/User.js";
import Role from "../models/user/Role.js";

class TransactionController {
  static async createTransaction(req, res) {
    try {
      const validatedData = await createTransactionSchema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });

      const transaction = await TransactionService.createTransaction(
        validatedData,
        req.user.id,
      );

      res.status(201).json({ transaction });
    } catch (error) {
      console.error(error);

      if (error.name === "ValidationError") {
        return res.status(400).json({
          message: "Invalid input data",
          errors: error.errors,
        });
      }

      res.status(500).json({
        message: "An error occurred while creating the transaction",
        error: error.message,
      });
    }
  }

  static async getTransactionsByUser(req, res) {
    try {
      const userId = req.user.id;

      if (!userId) {
        return res.status(400).json({ message: "user_id is required" });
      }

      const transactions = await Transaction.findAll({
        where: { created_by: userId },
        include: [
          {
            model: Currency,
            as: "currency_from",
            attributes: ["code", "name", "name_ar", "symbol", "exchange_rate"],
          },
          {
            model: Currency,
            as: "currency_to",
            attributes: ["code", "name", "name_ar", "symbol", "exchange_rate"],
          },
          {
            model: User,
            as: "creator",
            attributes: ["id", "name", "email", "phone", "avatar", "is_active"],
            include: [{
              model: Role,
              attributes: ["name"]
            }]
          },
          {
            model: User,
            as: "user",
            attributes: ["id", "name", "email", "phone", "avatar", "is_active"],
            include: [{
              model: Role,
              attributes: ["name"]
            }]
          },
          { model: Safe, attributes: ["id", "name", "type"] },
        ],
        order: [["date", "DESC"]],
      });

      // Format response with user data mapped
      // const response = {
      //   user_id: userId,
      //   transactions: transactions.map(transaction => ({
      //     ...transaction.toJSON(),
      //     creator: transaction.creator, // creator data
      //   }))
      // };

      res.status(200).json({ userId, transactions });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Failed to fetch transactions",
        error: error.message,
      });
    }
  }
}

export default TransactionController;
