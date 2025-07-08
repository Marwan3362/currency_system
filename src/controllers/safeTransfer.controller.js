import SafeTransferService from "../services/safeTransfer.service.js";
import { safeTransferSchema } from "../validations/safeTransfer.validation.js";
import SafeTransfer from "../models_old/SafeTransfer.js";
import Transaction from "../models_old/Transaction.js";
import Currency from "../models_old/Currency.js";
import Safe from "../models_old/Safe.js";

class SafeTransferController {
  // Create a transfer request
  static async createTransfer(req, res) {
    try {
      const validated = await safeTransferSchema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });

      const transfer = await SafeTransferService.createTransfer(validated);

      res
        .status(201)
        .json({ message: "Transfer request created successfully", transfer });
    } catch (error) {
      console.error(error);

      if (error.name === "ValidationError") {
        return res
          .status(400)
          .json({ message: "Invalid input data", errors: error.errors });
      }

      res.status(500).json({
        message: "An error occurred while creating the transfer",
        error: error.message,
      });
    }
  }

  // Approve a transfer
  static async approveTransfer(req, res) {
    try {
      const { transfer_id, user_id } = req.body;

      if (!transfer_id || !user_id) {
        return res
          .status(400)
          .json({ message: "transfer_id and user_id are required" });
      }

      const result = await SafeTransferService.approveTransfer(
        transfer_id,
        user_id
      );

      res
        .status(200)
        .json({ message: "Transfer approved successfully", result });
    } catch (error) {
      console.error(error);
      res.status(400).json({ message: error.message });
    }
  }
  static async getTransfersByUser(req, res) {
    try {
      const { safe_id } = req.body;

      if (!safe_id) {
        return res.status(400).json({ message: "safe_id is required" });
      }

      const transfers = await SafeTransfer.findAll({
        where: {
          to_safe_id: safe_id,
          status: "pending",
        },
        include: [
          {
            model: Safe,
            as: "fromSafe",
            attributes: ["id", "name"],
          },
          {
            model: Safe,
            as: "toSafe",
            attributes: ["id", "name"],
          },
        ],
        order: [["date", "DESC"]],
      });

      res.status(200).json({ safe_id, transfers });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Failed to fetch incoming pending transfers",
        error: error.message,
      });
    }
  }
}

export default SafeTransferController;
