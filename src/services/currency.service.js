import db from "../models/index.js";
const { Currency } = db;

export const getAllCurrencies = async () => {
  return await Currency.findAll({
    attributes: [
      "id",
      "code",
      "name",
      "name_ar",
      "symbol",
      "exchange_rate",
      "buy_rate",
      "sell_rate",
      "custom_rate",
      "is_active",
    ],
  });
};

export const addCurrency = async (currencyData) => {
  const exists = await Currency.findOne({ where: { code: currencyData.code } });
  if (exists) throw new Error("Currency already exists");

  return await Currency.create(currencyData);
};

export const updateCurrency = async (code, updateData) => {
  const currency = await Currency.findOne({ where: { code } });
  if (!currency) throw new Error("Currency not found");

  Object.assign(currency, updateData);
  await currency.save();

  return currency;
};
