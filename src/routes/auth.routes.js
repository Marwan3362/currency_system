import express from "express";
import {
  register,
  login,
  createCustomerHandler,
  getCustomerByPhoneHandler,
  logout,
} from "../controllers/auth.controller.js";
import { authenticateToken } from "../middlewares/authenticateToken.js";
import { auditLogger } from "../middlewares/auditLogger.js";

const router = express.Router();

router.post("/login", login);

router.post(
  "/create",
  authenticateToken,
  auditLogger({
    action: () => "Create user",
    table: "users",
    getId: (req) => "new_user",
    getChanges: (req, res) => ({
      name: req.body.name,
      email: req.body.email,
      role_id: req.body.role_id,
    }),
  }),
  register
);

router.post("/create/customer", authenticateToken, createCustomerHandler);
router.get("/customer/:phone", authenticateToken, getCustomerByPhoneHandler);
router.post("/logout", authenticateToken, logout);
export default router;
