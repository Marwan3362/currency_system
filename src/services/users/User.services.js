// src/services/users/User.services.js
import db from "../../models/index.js";
import bcrypt from "bcryptjs";
import { roleNames, hasPermission } from "../../utils/permissions.js";
import { signupSchema, loginSchema } from "../../validations/auth.validation.js";

const { User, Safe, Role, sequelize } = db;

export const createUserWithSafe = async (userData, creator) => {
  const { name, email, password, role_id, branch_id, company_id, phone } = userData;
  await signupSchema.validate(userData);

  const newRole = await Role.findByPk(role_id);
  if (!newRole) throw new Error("Target role not found");

  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) throw new Error("Email already exists");

  if (phone) {
    const existingPhone = await User.findOne({ where: { phone } });
    if (existingPhone) throw new Error("Phone is already exists");
  }

  const creatorRoleName = roleNames[creator.role];
  const targetRoleName = roleNames[role_id];

  if (creatorRoleName !== "Admin" && !hasPermission(creator.role, role_id)) {
    throw new Error(`Not authorized to assign role "${targetRoleName}" by "${creatorRoleName}"`);
  }

  let assignedBranchId;
  if (creatorRoleName === "Admin") {
    assignedBranchId = branch_id;
  } else if (creatorRoleName === "Company Owner") {
    if (!branch_id) throw new Error("Company Owner must provide a branch_id");
    assignedBranchId = branch_id;
  } else {
    assignedBranchId = creator.branch_id;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const t = await sequelize.transaction();

  try {
    const newUser = await User.create(
      {
        name,
        email,
        phone: phone || null,
        password: hashedPassword,
        role_id,
        branch_id: assignedBranchId,
        company_id: creatorRoleName === "Admin" ? company_id : creator.company_id,
      },
      { transaction: t }
    );

    const safe = await Safe.create(
      { name: `${name}_safe`, user_id: newUser.id },
      { transaction: t }
    );

    await t.commit();

    // رجّع شكل موحّد جاهز (هيتعدّي برضه على toUserDTO في الكنترولر)
    return {
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        roleName: newRole.name,
        branch_id: newUser.branch_id,
        company_id: newUser.company_id,
        safe_id: safe.id,
      },
    };
  } catch (error) {
    await t.rollback();
    throw error;
  }
};

export const authenticateUser = async (email, password) => {
  const user = await User.findOne({
    where: { email, is_active: true },
    include: [
      { model: Role, attributes: ["id", "name"] },
      { model: Safe, as: "Safe", attributes: ["id"] },
    ],
  });

  if (!user) return null;

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return null;

  await User.update({ is_login: true }, { where: { id: user.id } });

  // رجّع بيانات موحّدة (فيها phone و roleName)
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role_id,
    roleName: user.Role?.name,
    branch_id: user.branch_id,
    company_id: user.company_id,
    safe_id: user.Safe?.id,
  };
};

export const createCustomer = async (data) => {
  const { name, email, phone, company_id, branch_id } = data;
  const hashedPassword = await bcrypt.hash("P@ssw0rd", 10);

  if (email) {
    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) throw new Error("Email already exists");
  }

  const existing = await User.findOne({ where: { phone } });
  if (existing) throw new Error("Customer with this phone already exists");

  const newCustomer = await User.create({
    name,
    email,
    phone,
    password: hashedPassword,
    role_id: 6, // Customer
    company_id,
    branch_id,
  });

  return {
    id: newCustomer.id,
    name: newCustomer.name,
    email: newCustomer.email,
    phone: newCustomer.phone,
    roleName: "Customer",
    branch_id: newCustomer.branch_id,
    company_id: newCustomer.company_id,
    safe_id: null,
  };
};

export const getCustomerByPhone = async (phone) => {
  const customer = await User.findOne({
    where: { phone, role_id: 6 },
    attributes: ["id", "name", "email", "phone", "company_id", "branch_id"],
  });
  if (!customer) throw new Error("Customer not found");

  return customer;
};

export const logoutUser = async (userId) => {
  const user = await User.findByPk(userId);
  if (!user) throw new Error("User not found");
  if (!user.is_login) throw new Error("User is already logged out");

  user.is_login = false;
  await user.save();
  return true;
};
