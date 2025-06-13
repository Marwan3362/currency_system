import db from "../models/index.js";
const { Safe, SafeBalance, Currency, User, Role, Branch } = db;

const applyRoleAccessFilter = (roleName, branch_id, company_id, user_id) => {
  const whereClause = { is_active: true };

  if (roleName === "Teller") {
    whereClause.user_id = user_id;
  } else if (roleName === "Branch Manager") {
    if (!branch_id) return null;
    whereClause["$owner.branch_id$"] = branch_id;
  } else if (roleName === "Company Owner") {
    if (!company_id) return null;
    whereClause["$owner.company_id$"] = company_id;
  } else {
    return null; 
  }

  return whereClause;
};

export const getAllSafes = async (roleName, branch_id, company_id, user_id) => {
  const whereClause = applyRoleAccessFilter(
    roleName,
    branch_id,
    company_id,
    user_id
  );
  if (!whereClause) return [];

  return await Safe.findAll({
    where: whereClause,
    include: [
      {
        model: User,
        as: "owner",
        attributes: ["id", "name", "branch_id", "company_id"],
        include: [
          { model: Role, attributes: ["name"] },
          { model: Branch, as: "branch", attributes: ["id", "name"] },
        ],
      },
    ],
  });
};

export const getSafeById = async (
  safe_id,
  roleName,
  branch_id,
  company_id,
  user_id
) => {
  const whereClause = applyRoleAccessFilter(
    roleName,
    branch_id,
    company_id,
    user_id
  );
  if (!whereClause) return null;

  whereClause.id = safe_id;

  return await Safe.findOne({
    where: whereClause,
    include: [
      {
        model: User,
        as: "owner",
        attributes: ["id", "name", "branch_id", "company_id"],
        include: [
          { model: Role, attributes: ["name"] },
          { model: Branch, as: "branch", attributes: ["id", "name"] },
        ],
      },
    ],
  });
};

export const getSafeByUserId = async (
  target_user_id,
  roleName,
  branch_id,
  company_id,
  user_id
) => {
  if (roleName === "Teller" && target_user_id !== user_id) return null;

  const whereClause = { user_id: target_user_id, is_active: true };

  if (roleName === "Branch Manager") {
    if (!branch_id) return null;
    whereClause["$owner.branch_id$"] = branch_id;
  } else if (roleName === "Company Owner") {
    if (!company_id) return null;
    whereClause["$owner.company_id$"] = company_id;
  } else if (roleName !== "Teller") {
    return null;
  }

  return await Safe.findOne({
    where: whereClause,
    include: [
      {
        model: User,
        as: "owner",
        attributes: ["id", "name", "branch_id", "company_id"],
        include: [
          { model: Role, attributes: ["name"] },
          { model: Branch, as: "branch", attributes: ["id", "name"] },
        ],
      },
    ],
  });
};

export const getSafeWithBalances = async (
  safe_id,
  roleName,
  user_id,
  branch_id,
  company_id
) => {
  const whereClause = applyRoleAccessFilter(
    roleName,
    branch_id,
    company_id,
    user_id
  );
  if (!whereClause) return null;

  whereClause.id = safe_id;

  return await Safe.findOne({
    where: whereClause,
    include: [
      {
        model: User,
        as: "owner",
        attributes: ["id", "name", "branch_id", "company_id"],
      },
      {
        model: SafeBalance,
        as: "balances",
        attributes: ["id", "balance"],
        include: [
          {
            model: Currency,
            as: "currency",
            attributes: ["id", "code", "name", "symbol"],
          },
        ],
      },
    ],
  });
};
