import {
  getAllCurrencies,
  updateCurrency,
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

export const addCurrencyHandler = async (req, res) => {
  try {
    const {
      code,
      name,
      name_ar,
      symbol,
      exchange_rate,
      buy_rate,
      sell_rate,
      custom_rate,
      is_active,
    } = req.body;

    if (!code || !name || !name_ar) {
      return res.status(400).json({
        success: false,
        message: "code, name, and name_ar are required",
      });
    }

    const newCurrency = await addCurrency({
      code,
      name,
      name_ar,
      symbol,
      exchange_rate,
      buy_rate,
      sell_rate,
      custom_rate,
      is_active,
    });

    req.app.get("io").emit("currencyAdded", newCurrency);

    res.status(201).json({
      success: true,
      message: "Currency added successfully",
      data: newCurrency,
    });
  } catch (error) {
    console.error("Error in addCurrencyHandler:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCurrencyHandler = async (req, res) => {
  try {
    const { code, ...updateData } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: "Currency code is required",
      });
    }

    const updatedCurrency = await updateCurrency(code, updateData);

    req.app.get("io").emit("currencyUpdated", updatedCurrency);

    res.status(200).json({
      success: true,
      message: `Currency ${code} updated successfully`,
      data: updatedCurrency,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
