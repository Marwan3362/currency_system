import db from "../../models/index.js";
import bcrypt from "bcryptjs";
import { roleNames, hasPermission } from "../../utils/permissions.js";
import {
  signupSchema,
  loginSchema,
} from "../../validations/auth.validation.js";

const { User, Safe, Role } = db;

export const createUserWithSafe = async (userData, creator) => {
  const { name, email, password, role_id, branch_id, company_id } = userData;
  await signupSchema.validate(userData);

  const newRole = await Role.findByPk(role_id);
  if (!newRole) throw new Error("Target role not found");
  const existingUser = await User.findOne({ where: { email: userData.email } });
  if (existingUser) throw new Error("Email already exists");
  const existingPhone = await User.findOne({
    where: { phone: userData.phone },
  });
  if (existingPhone) throw new Error("Phone is already exists");
  const creatorRoleName = roleNames[creator.role];
  const targetRoleName = roleNames[role_id];

  // Allow Admin to create any role
  if (creatorRoleName !== "Admin" && !hasPermission(creator.role, role_id)) {
    throw new Error(
      `Not authorized to assign role "${targetRoleName}" by "${creatorRoleName}"`
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
    role_id,
    branch_id: creatorRoleName === "Admin" ? branch_id : creator.branch_id,
    company_id: creatorRoleName === "Admin" ? company_id : creator.company_id,
  });

  const safe = await Safe.create({
    name: `${name}_safe`,
    user_id: newUser.id,
  });

  return {
    user: {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role_id: newUser.role_id,
      branch_id: newUser.branch_id,
      company_id: newUser.company_id,
    },
    safe_id: safe.id,
  };
};

export const authenticateUser = async (email, password) => {
  const user = await User.findOne({
    where: { email, is_active: true },
    include: [
      {
        model: Role,
        attributes: ["id", "name"],
      },
    ],
  });

  if (!user) return null;

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return null;

  return {
    id: user.id,
    email: user.email,
    role: user.role_id,
    roleName: user.Role?.name,
    branch_id: user.branch_id,
    company_id: user.company_id,
    safe_id: user.safe_id,
  };
};
