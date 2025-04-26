import authService from "../services/users/User.services.js";
import Role from "../models/user/Role.js";
export const signup = async (req, res) => {
  try {
    const { name, email, password, phone, role_id, safe_type} = req.body;
    const avatar = req.file ? `/uploads/${req.file.filename}` : null;

    const user = await authService.registerUser({
      name,
      email,
      password,
      phone,
      avatar,
      role_id,
      safe_type
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        role: user.Role.name,
        is_active: user.is_active,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { user, token } = await authService.loginUser(req.body);
    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        role: user.Role.name,
        is_active: user.is_active,
        createdAt: user.createdAt,
      },
      token,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getRole = async (req, res) => {
  try {
    const roles = await Role.findAll();
    res.status(200).json(roles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
