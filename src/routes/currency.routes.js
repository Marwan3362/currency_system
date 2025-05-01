// routes/currency.routes.js
import express from "express";
import {
  getAllCurrenciesHandler,
  updateExchangeRateHandler,
  addCurrencyHandler,
} from "../controllers/currency.controller.js";

const router = express.Router();

router.get("/all", getAllCurrenciesHandler);


router.post("/exchange-rate", updateExchangeRateHandler);

router.post("/add", addCurrencyHandler);

export default router;
