// src/services/fetchUsers.services.js
import db from "../models/index.js";
import { Op } from "sequelize";

const { User, Role, Safe, Branch } = db;

// ملاحظة: roleName "Company Owner" فيها مسافة — خلّي المقارنات موحّدة

export const getAllTellers = async (roleName, branch_id) => {
  const whereClause = {
    is_active: true,
    branch_id: { [Op.not]: null },
    company_id: { [Op.not]: null },
  };

  if (!["Admin", "Company Owner"].includes(roleName)) {
    whereClause.branch_id = branch_id;
  }

  return User.findAll({
    attributes: ["id", "name", "email", "phone", "branch_id", "company_id"],
    where: whereClause,
    include: [
      { model: Role, where: { name: "Teller" }, attributes: ["name"] },
      { model: Safe, as: "Safe", attributes: ["id", "name"] },
    ],
    raw: true,
    nest: true,
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
  } else if (roleName === "Company Owner") {
    whereClause.company_id = company_id;
  }

  return User.findAll({
    attributes: ["id", "name", "email", "phone", "branch_id", "company_id"],
    where: whereClause,
    include: [
      { model: Role, where: { name: "Branch Manager" }, attributes: ["name"] },
      { model: Branch, as: "branch", attributes: ["id", "name"] },
      { model: Safe, as: "Safe", attributes: ["id", "name"] },
    ],
    raw: true,
    nest: true,
  });
};

export const getAllCustomers = async (roleName, branch_id) => {
  const whereClause = {
    is_active: true,
    branch_id: { [Op.not]: null },
    company_id: { [Op.not]: null },
  };

  if (!["Admin", "Company Owner"].includes(roleName)) {
    whereClause.branch_id = branch_id;
  }

  return User.findAll({
    attributes: ["id", "name", "email", "phone", "branch_id", "company_id"],
    where: whereClause,
    include: [{ model: Role, where: { name: "Customer" }, attributes: ["name"] }],
    raw: true,
    nest: true,
  });
};

export const getCustomerByPhone = async (userPhone, roleName, branch_id) => {
  const whereClause = { phone: userPhone, is_active: true };

  if (!["Admin", "Company Owner"].includes(roleName)) {
    whereClause.branch_id = branch_id;
  }

  return User.findOne({
    attributes: ["id", "name", "email", "phone", "branch_id", "company_id"],
    where: whereClause,
    include: [{ model: Role, where: { name: "Customer" }, attributes: ["name"] }],
    raw: true,
    nest: true,
  });
};
