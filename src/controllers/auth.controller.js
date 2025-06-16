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
