import SafeBalance from "../models/SafeBalance.js";
import Currency from "../models/Currency.js";

class SafeBalanceService {
  static async upsertBalance({ safe_id, currency_id, amount }) {
    let balance = await SafeBalance.findOne({
      where: { safe_id, currency_id },
    });

    if (balance) {
      balance.amount = Number(balance.amount) + Number(amount);
      await balance.save();
    } else {
      balance = await SafeBalance.create({ safe_id, currency_id, amount });
    }

    return balance;
  }

  static async getBalancesBySafeId(safe_id) {
    return SafeBalance.findAll({
      where: { safe_id },
      attributes: ["amount", "currency_id"],
      include: [
        {
          model: Currency,
          attributes: ["code", "name", "name_ar", "symbol"],
        },
      ],
      order: [["currency_id", "ASC"]],
    });
  }

  static async clearBalancesIfEmpty(safe_id) {
    const balances = await SafeBalance.findAll({ where: { safe_id } });

    const nonZeroBalances = balances.filter((b) => Number(b.amount) > 0);

    if (nonZeroBalances.length > 0) {
      return {
        cleared: false,
        balances: nonZeroBalances.map((b) => ({
          currency_id: b.currency_id,
          amount: b.amount,
        })),
      };
    }

    await SafeBalance.destroy({ where: { safe_id } });

    return { cleared: true };
  }
}

export default SafeBalanceService;
