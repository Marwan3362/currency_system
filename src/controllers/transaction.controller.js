// controllers/transaction.controller.js
import TransactionService from "../services/transaction.service.js";
import { createTransactionSchema } from "../validations/Transaction.validation.js";
import Transaction from "../models/Transaction.js";
import Currency from "../models/Currency.js";
import Safe from "../models/Safe.js";

class TransactionController {
  static async createTransaction(req, res) {
    try {
      const validatedData = await createTransactionSchema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });

      const transaction = await TransactionService.createTransaction(
        validatedData
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
      const { user_id } = req.body;

      if (!user_id) {
        return res.status(400).json({ message: "user_id is required" });
      }

      const transactions = await Transaction.findAll({
        where: { user_id },
        include: [
          {
            model: Currency,
            as: "currency_from",
            attributes: ["code", "name", "name_ar", "symbol"],
          },
          {
            model: Currency,
            as: "currency_to",
            attributes: ["code", "name", "name_ar", "symbol"],
          },
          { model: Safe, attributes: ["id", "name", "type"] },
        ],
        order: [["date", "DESC"]],
      });

      res.status(200).json({ user_id, transactions });
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
