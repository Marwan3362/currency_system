// services/currency.service.js
import Currency from "../models/Currency.js";

export const getAllCurrencies = async () => {
  return await Currency.findAll({attributes: ['code', 'name', 'symbol', 'exchange_rate'],});
};
export const updateExchangeRate = async (code, newExchangeRate) => {
  const currency = await Currency.findOne({ where: { code: code } });
  if (!currency) throw new Error("Currency not found");

  currency.exchange_rate = newExchangeRate;
  await currency.save();

  return currency;
};
export const addCurrency = async (currencyData) => {
  return await Currency.create(currencyData);
};
