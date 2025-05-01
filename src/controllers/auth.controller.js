import authService from "../services/users/User.services.js";
import Role from "../models/user/Role.js";

export const signup = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      role_id,
      safe_type,
      company_id,
      branch_id,
    } = req.body;
    const avatar = req.file ? `/uploads/${req.file.filename}` : null;

    const { user, safe_id } = await authService.registerUser({
      name,
      email,
      password,
      phone,
      avatar,
      role_id,
      safe_type,
      company_id,
      branch_id,
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
        safe_id, // إرجاع safe_id مع المستخدم
        branch_id, // إرجاع branch_id مع المستخدم
      },
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// دالة لتسجيل دخول المستخدم
export const login = async (req, res) => {
  try {
    const { user, safe_id, branch_id, token } = await authService.loginUser(
      req.body
    );

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
        safe_id, 
        branch_id, 
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


