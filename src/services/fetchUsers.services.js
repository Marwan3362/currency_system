// import User from "../models_old/user/User.js";
// import Role from "../models_old/user/Role.js";
// import UserCompany from "../models_old/UserCompany.js";
// import Branch from "../models_old/Branch.js";
// import Safe from "../models_old/Safe.js";

// export const getAllTellers = async () => {
//   return await User.findAll({
//     attributes: ["id", "name", "email"],
//     where: { is_active: true },
//     include: [
//       {
//         model: Role,
//         where: { name: "Teller" },
//         attributes: ["name"],
//       },
//       {
//         model: UserCompany,
//         include: [
//           {
//             model: Branch,

//             as: "branchDetails",
//             attributes: ["id", "name"],
//           },
//         ],
//       },
//       {
//         model: Safe,
//         as: "userSafe",
//         attributes: ["id", "name"],
//       },
//     ],
//   });
// };

// export const getAllOwnerBranches = async () => {
//   return await User.findAll({
//     attributes: ["id", "name", "email"],
//     where: { is_active: true },
//     include: [
//       {
//         model: Role,
//         where: { name: "Branch Manager" },
//         attributes: ["name"],
//       },
//       {
//         model: UserCompany,
//         include: [
//           {
//             model: Branch,
//             as: "branchDetails",
//             attributes: ["id", "name"],
//           },
//         ],
//       },
//       {
//         model: Safe,
//         as: "userSafe",
//         attributes: ["id", "name"],
//       },
//     ],
//   });
// };

// // export const getAllCustomers = async () => {
// //   return await User.findAll({
// //     attributes: ["id", "name", "email", "phone"],
// //     where: { is_active: true },
// //     include: [
// //       {
// //         model: Role,
// //         where: { name: "Customer" },
// //         attributes: ["name"],
// //       },
// //     ],
// //   });
// // };

// export const getAllCustomers = async () => {
//   const users = await User.findAll({
//     attributes: ["id", "name", "email", "phone"],
//     where: { is_active: true },
//     include: [
//       {
//         model: Role,
//         attributes: ["name"],
//         where: { name: "Customer" },
//       },
//     ],
//   });

//   return users.map((user) => ({
//     id: user.id,
//     name: user.name,
//     email: user.email,
//     phone: user.phone,
//     role: user.Role.name,
//   }));
// };

// export const getCustomerByPhone = async (userPhone) => {
//   return await User.findOne({ where: { phone: userPhone, role_id: 6 } });
// };

import db from "../models/index.js";
const { User, Role, Safe, UserCompany, Branch } = db;

// ✅ Get all tellers (with optional branch filter)
export const getAllTellers = async (role, branch_id) => {
  const whereClause = { is_active: true };

  if (!["Admin", "CompanyOwner"].includes(role)) {
    whereClause.branch_id = branch_id;
  }

  return await User.findAll({
    attributes: ["id", "name", "email"],
    where: whereClause,
    include: [
      {
        model: Role,
        where: { name: "Teller" },
        attributes: ["name"],
      },
      {
        model: Safe,
        as: "owner",
        attributes: ["id", "name"],
      },
    ],
  });
};

// ✅ Get all branch managers (owners of branches)
export const getAllOwnerBranches = async (role, branch_id, company_id) => {
  const whereClause = { is_active: true };

  if (role === "BranchManager") {
    whereClause.branch_id = branch_id;
  } else if (role === "CompanyOwner") {
    whereClause.company_id = company_id;
  }

  return await User.findAll({
    attributes: ["id", "name", "email"],
    where: whereClause,
    include: [
      {
        model: Role,
        where: { name: "BranchManager" },
        attributes: ["name"],
      },
      {
        model: UserCompany,
        include: [
          {
            model: Branch,
            as: "branchDetails",
            attributes: ["id", "name"],
          },
        ],
      },
      {
        model: Safe,
        as: "owner",
        attributes: ["id", "name"],
      },
    ],
  });
};

// ✅ Get all customers (with optional branch filter)
export const getAllCustomers = async (role, branch_id) => {
  const whereClause = { is_active: true };

  if (!["Admin", "CompanyOwner"].includes(role)) {
    whereClause.branch_id = branch_id;
  }

  const users = await User.findAll({
    attributes: ["id", "name", "email", "phone"],
    where: whereClause,
    include: [
      {
        model: Role,
        attributes: ["name"],
        where: { name: "Customer" },
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

// ✅ Get single customer by phone (restricted by branch if not admin)
export const getCustomerByPhone = async (userPhone, role, branch_id) => {
  const whereClause = {
    phone: userPhone,
    is_active: true,
  };

  if (!["Admin", "CompanyOwner"].includes(role)) {
    whereClause.branch_id = branch_id;
  }

  return await User.findOne({
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
