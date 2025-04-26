// controllers/transaction.controller.js
import TransactionService from "../services/transaction.service.js";
import { createTransactionSchema } from "../validations/Transaction.validation.js";

class TransactionController {
  static async createTransaction(req, res) {
    try {
      const validatedData = await createTransactionSchema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });

      const transaction = await TransactionService.createTransaction(validatedData);
x
      res.status(201).json({ transaction });
    } catch (error) {
      console.error(error);

      if (error.name === "ValidationError") {
        return res.status(400).json({
          message: "خطأ في البيانات المدخلة",
          errors: error.errors,
        });
      }

      res.status(500).json({
        message: "حدث خطأ في إنشاء الترانزكشن",
        error: error.message,
      });
    }
  }
}

export default TransactionController;
