// src/controllers/auth.controller.js
import * as userService from "../services/users/User.services.js";
import jwt from "jsonwebtoken";
import { loginSchema } from "../validations/auth.validation.js";
import { toUserDTO } from "../utils/dto.js";

export const register = async (req, res) => {
  try {
    const result = await userService.createUserWithSafe(req.body, req.user);
    // result.user عندنا هنخليه جاي جاهز بالمعلومات، بس نعديه على DTO لتوحيد الشكل
    const dto = toUserDTO(result.user);
    res.status(201).json({ success: true, message: "User created", data: dto });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    await loginSchema.validate(req.body, { abortEarly: false });

    const user = await userService.authenticateUser(req.body.email, req.body.password);
    if (!user) return res.status(401).json({ success: false, message: "Invalid credentials" });

    const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "7d" });
    const dto = toUserDTO(user);

    res.json({ success: true, message: "Login successful", token, user: dto });
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ success: false, message: err.errors });
    }
    console.error(err);
    res.status(500).json({ success: false, message: "Login failed" });
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
    const dto = toUserDTO(customer);
    res.status(201).json({
      success: true,
      message: "Customer created successfully",
      data: dto,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const getCustomerByPhoneHandler = async (req, res) => {
  try {
    const { phone } = req.params;
    const customer = await userService.getCustomerByPhone(phone);
    // الخدمة دي مش مرجعّة Role، فهنثبت roleName = "Customer"
    const dto = toUserDTO({ ...customer?.toJSON?.() ?? customer, roleName: "Customer" });
    res.status(200).json({ success: true, data: dto });
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
