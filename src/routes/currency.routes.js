import express from "express";
import {
  getAllCurrenciesHandler,
  updateCurrencyHandler,
  addCurrencyHandler,
} from "../controllers/currency.controller.js";
import { authenticateToken } from "../middlewares/authenticateToken.js";
import { authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get(
  "/all",
  authorizeRoles("Admin", "Company Owner", "Branch Manager", "Teller"),
  authenticateToken,
  getAllCurrenciesHandler
);
router.post(
  "/add",
  authorizeRoles("Admin", "Company Owner"),
  authenticateToken,
  addCurrencyHandler
);
router.post(
  "/update",
  authorizeRoles("Admin", "Company Owner"),
  authenticateToken,
  updateCurrencyHandler
);

export default router;
