// export default SafeTransferService;
import sequelize from "../config/db.js";
import SafeTransfer from "../models/SafeTransfer.js";
import SafeBalance from "../models/SafeBalance.js";
import Transaction from "../models/Transaction.js";
import Safe from "../models/Safe.js";

class SafeTransferService {
  static async createTransfer(data) {
    const { from_safe_id, to_safe_id, amount, currency_id, date, description } =
      data;

    if (from_safe_id === to_safe_id) {
      throw new Error("Cannot transfer to the same safe");
    }

    const transfer = await SafeTransfer.create({
      from_safe_id,
      to_safe_id,
      amount,
      currency_id,
      date,
      description,
      status: "pending",
    });

    return transfer;
  }

  static async approveTransfer(transfer_id, user_id) {
    const t = await sequelize.transaction();

    try {
      const transfer = await SafeTransfer.findByPk(transfer_id, {
        transaction: t,
      });

      if (!transfer) throw new Error("Transfer not found");
      if (transfer.status !== "pending")
        throw new Error("Transfer is not in pending status");

      const fromBalance = await SafeBalance.findOne({
        where: {
          safe_id: transfer.from_safe_id,
          currency_id: transfer.currency_id,
        },
        transaction: t,
      });

      if (
        !fromBalance ||
        Number(fromBalance.amount) < Number(transfer.amount)
      ) {
        throw new Error("Insufficient balance in source safe");
      }

      fromBalance.amount -= Number(transfer.amount);
      await fromBalance.save({ transaction: t });

      let toBalance = await SafeBalance.findOne({
        where: {
          safe_id: transfer.to_safe_id,
          currency_id: transfer.currency_id,
        },
        transaction: t,
      });

      if (!toBalance) {
        toBalance = await SafeBalance.create(
          {
            safe_id: transfer.to_safe_id,
            currency_id: transfer.currency_id,
            amount: transfer.amount,
          },
          { transaction: t }
        );
      } else {
        toBalance.amount += Number(transfer.amount);
        await toBalance.save({ transaction: t });
      }

      await Transaction.create(
        {
          safe_id: transfer.from_safe_id,
          currency_id_from: transfer.currency_id,
          currency_id_to: transfer.currency_id,
          type: "out",
          amount: transfer.amount,
          converted_amount: transfer.amount,
          description: `Transfer to safe ${transfer.to_safe_id}`,
          user_id,
          date: transfer.date,
          related_transaction_id: transfer.id,
        },
        { transaction: t }
      );

      await Transaction.create(
        {
          safe_id: transfer.to_safe_id,
          currency_id_from: transfer.currency_id,
          currency_id_to: transfer.currency_id,
          type: "in",
          amount: transfer.amount,
          converted_amount: transfer.amount,
          description: `Transfer from safe ${transfer.from_safe_id}`,
          user_id,
          date: transfer.date,
          related_transaction_id: transfer.id,
        },
        { transaction: t }
      );

      transfer.status = "approved";
      await transfer.save({ transaction: t });

      await t.commit();

      return transfer;
    } catch (err) {
      await t.rollback();
      throw err;
    }
  }
}

export default SafeTransferService;
