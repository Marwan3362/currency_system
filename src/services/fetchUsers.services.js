import db from "../models/index.js";
const { User, Role, Safe, UserCompany, Branch } = db;
import { Op } from "sequelize";

export const getAllTellers = async (roleName, branch_id) => {
  const whereClause = {
    is_active: true,
    branch_id: { [Op.not]: null },
    company_id: { [Op.not]: null },
  };

  if (!["Admin", "CompanyOwner"].includes(roleName)) {
    whereClause.branch_id = branch_id;
  }

  return await User.findAll({
    attributes: ["id", "name", "email", "branch_id", "company_id"],
    where: whereClause,
    include: [
      {
        model: Role,
        where: { name: "Teller" },
        attributes: ["name"],
      },
      {
        model: Safe,
        as: "Safe",
        attributes: ["id", "name"],
      },
    ],
  });
};

export const getAllOwnerBranches = async (roleName, branch_id, company_id) => {
  const whereClause = {
    is_active: true,
    branch_id: { [Op.not]: null },
    company_id: { [Op.not]: null },
  };

  if (roleName === "Branch Manager") {
    whereClause.branch_id = branch_id;
  } else if (roleName === "CompanyOwner") {
    whereClause.company_id = company_id;
  }

  return await db.User.findAll({
    attributes: ["id", "name", "email"],
    where: whereClause,
    include: [
      {
        model: db.Role,
        where: { name: "Branch Manager" },
        attributes: ["name"],
      },
      {
        model: db.Branch,
        as: "branch",
        attributes: ["id", "name"],
      },
      {
        model: db.Safe,
        as: "Safe",
        attributes: ["id", "name"],
      },
    ],
  });
};

export const getAllCustomers = async (roleName, branch_id) => {
  const whereClause = {
    is_active: true,
    branch_id: { [Op.not]: null },
    company_id: { [Op.not]: null },
  };

  if (!["Admin", "CompanyOwner"].includes(roleName)) {
    whereClause.branch_id = branch_id;
  }

  const users = await User.findAll({
    attributes: ["id", "name", "email", "phone"],
    where: whereClause,
    include: [
      {
        model: Role,
        where: { name: "Customer" },
        attributes: ["name"],
      },
    ],
  });

  return users.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.Role?.name,
  }));
};

export const getCustomerByPhone = async (userPhone, roleName, branch_id) => {
  const whereClause = {
    phone: userPhone,
    is_active: true,
  };

  if (!["Admin", "CompanyOwner"].includes(roleName)) {
    whereClause.branch_id = branch_id;
  }

  return await User.findOne({
    attributes: ["id", "name", "email", "phone"],
    where: whereClause,
    include: [
      {
        model: Role,
        where: { name: "Customer" },
        attributes: ["name"],
      },
    ],
  });
};
