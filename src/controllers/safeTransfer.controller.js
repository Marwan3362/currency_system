// controllers/safeTransfer.controller.js
import SafeTransferService from "../services/safeTransfer.service.js";
import { safeTransferSchema } from "../validations/safeTransfer.validation.js";

class SafeTransferController {
  static async createTransfer(req, res) {
    try {
      const validated = await safeTransferSchema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });

      const transfer = await SafeTransferService.createTransfer(validated);

      res.status(201).json({ message: "تم التحويل بنجاح", transfer });
    } catch (error) {
      console.error(error);

      if (error.name === "ValidationError") {
        return res.status(400).json({ message: "بيانات غير صحيحة", errors: error.errors });
      }

      res.status(500).json({ message: "حدث خطأ أثناء التحويل", error: error.message });
    }
  }
}

export default SafeTransferController;
