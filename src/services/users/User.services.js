import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../../models/user/User.js";
import Role from "../../models/user/Role.js";
import Safe from "../../models/Safe.js";
import {
  signupSchema,
  loginSchema,
} from "../../validations/auth.validation.js";

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.Role.name },
    process.env.JWT_SECRET,
    { expiresIn: "9h" }
  );
};

const registerUser = async (userData) => {
  await signupSchema.validate(userData);

  const existingUser = await User.findOne({ where: { email: userData.email } });
  if (existingUser) throw new Error("Email already exists");

  userData.password = await bcrypt.hash(userData.password, 10);

  const user = await User.create({
    name: userData.name,
    email: userData.email,
    password: userData.password,
    phone: userData.phone || null,
    avatar: userData.avatar || null,
    role_id: userData.role_id || 2,
  });

  await user.reload({ include: [{ model: Role, attributes: ["name"] }] });

  await Safe.create({
    name: `Safe for ${user.name}`,
    type: userData.safe_type || "company",
    user_id: user.id,
    branch_id: userData.branch_id || null,
  });
  // }
  return user;
};

const loginUser = async (userData) => {
  await loginSchema.validate(userData);

  const user = await User.findOne({
    where: { email: userData.email },
    include: [{ model: Role, attributes: ["name"] }],
  });

  if (!user) throw new Error("Invalid email or password");

  const isMatch = await bcrypt.compare(userData.password, user.password);
  if (!isMatch) throw new Error("Invalid email or password");

  const token = generateToken(user);
  return { user, token };
};

export default { registerUser, loginUser };
