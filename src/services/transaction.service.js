import axios from "axios";
import sequelize from "../config/db.js";
import Transaction from "../models/Transaction.js";
import SafeBalance from "../models/SafeBalance.js";
import Safe from "../models/Safe.js";

const API_KEY = "8939f69a54818d490aacd2fdc98f10a8";

class TransactionService {
  static async getConvertedAmount(from, to, amount) {
    const url = `https://api.exchangerate.host/convert`;

    try {
      const response = await axios.get(url, {
        params: {
          access_key: API_KEY,
          from,
          to,
          amount,
        },
      });

      const raw = response.data?.result;

      const result = Number(parseFloat(raw).toFixed(2));

      if (!result || isNaN(result)) {
        throw new Error("فشل في جلب سعر التحويل من API");
      }

      return result;
    } catch (error) {
      console.error("API Error:", error.message);
      throw new Error("تعذر الاتصال بخدمة تحويل العملات");
    }
  }

  static async createTransaction(data) {
    const {
      safe_id,
      currency_id_from,
      currency_id_to,
      amount,
      type,
      description,
      user_id,
      date,
      exchange_type,
      client_phone,
    } = data;

    const t = await sequelize.transaction();

    try {
      const safe = await Safe.findByPk(safe_id, { transaction: t });
      if (!safe) throw new Error("الخزنة غير موجودة");

      const rawConverted = await this.getConvertedAmount(
        currency_id_from,
        currency_id_to,
        amount
      );

      const convertedAmount = Number(parseFloat(rawConverted).toFixed(2));
      const fixedAmount = Number(parseFloat(amount).toFixed(2));

      if (isNaN(convertedAmount) || isNaN(fixedAmount)) {
        throw new Error("القيمة المحوّلة أو المبلغ غير صالح");
      }

      const transaction = await Transaction.create(
        {
          safe_id,
          currency_id_from,
          currency_id_to,
          amount: fixedAmount,
          type,
          description,
          user_id,
          date,
          exchange_type,
          client_phone,
          converted_amount: convertedAmount,
        },
        { transaction: t }
      );

      if (type === "out") {
        const fromBalance = await SafeBalance.findOne({
          where: { safe_id, currency_id: currency_id_from },
          transaction: t,
        });

        if (!fromBalance || Number(fromBalance.amount) < fixedAmount) {
          throw new Error("الرصيد غير كافي في العملة المصدر");
        }

        fromBalance.amount = Number(
          (Number(fromBalance.amount) - fixedAmount).toFixed(2)
        );
        await fromBalance.save({ transaction: t });

        let toBalance = await SafeBalance.findOne({
          where: { safe_id, currency_id: currency_id_to },
          transaction: t,
        });

        if (!toBalance) {
          await SafeBalance.create(
            {
              safe_id,
              currency_id: currency_id_to,
              amount: convertedAmount,
            },
            { transaction: t }
          );
        } else {
          toBalance.amount = Number(
            (Number(toBalance.amount) + convertedAmount).toFixed(2)
          );
          await toBalance.save({ transaction: t });
        }
      }

      if (type === "in") {
        let toBalance = await SafeBalance.findOne({
          where: { safe_id, currency_id: currency_id_to },
          transaction: t,
        });

        if (!toBalance) {
          await SafeBalance.create(
            {
              safe_id,
              currency_id: currency_id_to,
              amount: convertedAmount,
            },
            { transaction: t }
          );
        } else {
          toBalance.amount = Number(
            (Number(toBalance.amount) + convertedAmount).toFixed(2)
          );
          await toBalance.save({ transaction: t });
        }
      }

      await t.commit();

      return {
        id: transaction.id,
        safe_id,
        type,
        amount: fixedAmount,
        currency_from: currency_id_from,
        currency_to: currency_id_to,
        converted_amount: convertedAmount,
        description,
        date,
        exchange_type,
        client_phone,
        user_id,
        created_at: transaction.createdAt,
      };
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }
}

export default TransactionService;
