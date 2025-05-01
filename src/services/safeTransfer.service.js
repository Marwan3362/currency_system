// export default SafeTransferService;
import sequelize from "../config/db.js";
import SafeTransfer from "../models/SafeTransfer.js";
import SafeBalance from "../models/SafeBalance.js";
import Transaction from "../models/Transaction.js";

class SafeTransferService {
  static async createTransfer(data) {
    const {
      from_safe_id,
      to_safe_id,
      amount,
      currency_id,
      date,
      description,
      user_id,
    } = data;

    const t = await sequelize.transaction();

    try {
      const fromBalance = await SafeBalance.findOne({
        where: { safe_id: from_safe_id, currency_id },
        transaction: t,
      });

      if (!fromBalance || Number(fromBalance.amount) < Number(amount)) {
        throw new Error("الرصيد غير كافي في الخزنة المحولة");
      }

      fromBalance.amount = Number(fromBalance.amount) - Number(amount);
      await fromBalance.save({ transaction: t });

      let toBalance = await SafeBalance.findOne({
        where: { safe_id: to_safe_id, currency_id },
        transaction: t,
      });

      if (!toBalance) {
        toBalance = await SafeBalance.create(
          {
            safe_id: to_safe_id,
            currency_id,
            amount: Number(amount),
          },
          { transaction: t }
        );
      } else {
        toBalance.amount = Number(toBalance.amount) + Number(amount);
        await toBalance.save({ transaction: t });
      }

      const transfer = await SafeTransfer.create(
        {
          from_safe_id,
          to_safe_id,
          amount,
          currency_id,
          date,
          description,
        },
        { transaction: t }
      );

      await Transaction.create(
        {
          safe_id: from_safe_id,
          currency_id_from: currency_id,
          currency_id_to: currency_id,
          type: "out",
          amount,
          converted_amount: amount,
          description: `تحويل إلى خزنة ${to_safe_id} - ${description || ""}`,
          user_id,
          date,
          related_transfer_id: transfer.id,
        },
        { transaction: t }
      );

      await Transaction.create(
        {
          safe_id: to_safe_id,
          currency_id_from: currency_id,
          currency_id_to: currency_id,
          type: "in",
          amount,
          converted_amount: amount,
          description: `تحويل من خزنة ${from_safe_id} - ${description || ""}`,
          user_id,
          date,
          related_transfer_id: transfer.id,
        },
        { transaction: t }
      );

      await t.commit();

      return transfer;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }
}

export default SafeTransferService;
