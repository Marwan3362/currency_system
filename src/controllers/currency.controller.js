// controllers/currency.controller.js
import {
    getAllCurrencies,
    updateExchangeRate,
    addCurrency,
  } from "../services/currency.service.js";
  
  export const getAllCurrenciesHandler = async (req, res) => {
    try {
      const currencies = await getAllCurrencies();
      res.status(200).json({
        success: true,
        data: currencies,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
  
  export const updateExchangeRateHandler = async (req, res) => {
    try {
      const { code, exchange_rate } = req.body;
  
      if (!code || !exchange_rate) {
        return res.status(400).json({
          success: false,
          message: "Code and exchange rate are required",
        });
      }
  
      const updatedCurrency = await updateExchangeRate(code, exchange_rate);
  
      res.status(200).json({
        success: true,
        message: `Exchange rate for ${updatedCurrency.name} updated successfully`,
        data: updatedCurrency,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
  
  
  export const addCurrencyHandler = async (req, res) => {
    try {
      const { code, name, name_ar, symbol, exchange_rate, is_active } = req.body;
  
      if (!code || !name || !name_ar) {
        return res.status(400).json({
          success: false,
          message: "Code, name, and name_ar are required",
        });
      }
  
      const newCurrency = await addCurrency({
        code,
        name,
        name_ar,
        symbol,
        exchange_rate,
        is_active,
      });
  
      res.status(201).json({
        success: true,
        message: "Currency added successfully",
        data: newCurrency,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
  