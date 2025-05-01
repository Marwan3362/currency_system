import SafeBalanceService from "../services/safeBalance.service.js";
import { safeBalanceSchema } from "../validations/safeBalance.validation.js";

class SafeBalanceController {
  static async upsertBalance(req, res) {
    try {
      const validated = await safeBalanceSchema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });

      const balance = await SafeBalanceService.upsertBalance(validated);

      res.status(200).json({ message: "Balance saved successfully", balance });
    } catch (error) {
      console.error(error);

      if (error.name === "ValidationError") {
        return res.status(400).json({
          message: "Invalid input data",
          errors: error.errors,
        });
      }

      res.status(500).json({ message: "Failed to save balance", error: error.message });
    }
  }

  static async getBySafeId(req, res) {
    try {
      const { safe_id } = req.body;

      if (!safe_id) {
        return res.status(400).json({ message: "safe_id is required" });
      }

      const balances = await SafeBalanceService.getBalancesBySafeId(safe_id);

      res.status(200).json({ safe_id, balances });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to fetch balances", error: error.message });
    }
  }

  static async clearIfEmpty(req, res) {
    try {
      const { safe_id } = req.body;

      if (!safe_id) {
        return res.status(400).json({ message: "safe_id is required" });
      }

      const result = await SafeBalanceService.clearBalancesIfEmpty(safe_id);

      if (result.cleared) {
        return res.status(200).json({ message: "Balances cleared successfully" });
      } else {
        return res.status(400).json({
          message: "Cannot clear — non-zero balances exist",
          balances: result.balances,
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error occurred during check or deletion", error: error.message });
    }
  }
}

export default SafeBalanceController;
