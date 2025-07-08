import * as userService from "../services/users/User.services.js";
import jwt from "jsonwebtoken";

import { loginSchema } from "../validations/auth.validation.js";
export const register = async (req, res) => {
  try {
    const result = await userService.createUserWithSafe(req.body, req.user);
    res.status(201).json({ message: "User created", ...result });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    await loginSchema.validate(req.body);

    const user = await userService.authenticateUser(
      req.body.email,
      req.body.password
    );
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({ message: "Login successful", token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }
};

export const createCustomerHandler = async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    const customer = await userService.createCustomer({
      name,
      email,
      phone,
      company_id: req.user.company_id,
      branch_id: req.user.branch_id,
    });

    res.status(201).json({
      success: true,
      message: "Customer created successfully",
      data: customer,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const getCustomerByPhoneHandler = async (req, res) => {
  try {
    const { phone } = req.params;

    const customer = await userService.getCustomerByPhone(phone);

    res.status(200).json({ success: true, data: customer });
  } catch (err) {
    res.status(404).json({ success: false, message: err.message });
  }
};
export const logout = async (req, res) => {
  try {
    const userId = req.user.id;

    await userService.logoutUser(userId);

    res.status(200).json({ success: true, message: "Logout successful" });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
