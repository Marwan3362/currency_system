import express from "express";
import {
  getAllCurrenciesHandler,
  updateCurrencyHandler,
  addCurrencyHandler,
} from "../controllers/currency.controller.js";

const router = express.Router();

router.get("/all", getAllCurrenciesHandler);
router.post("/add", addCurrencyHandler);
router.post("/update", updateCurrencyHandler);

export default router;
