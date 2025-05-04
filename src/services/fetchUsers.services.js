import User from "../models/user/User.js";
import Role from "../models/user/Role.js";
import UserCompany from "../models/UserCompany.js";
import Branch from "../models/Branch.js";
import Safe from "../models/Safe.js";

export const getAllTellers = async () => {
  return await User.findAll({
    attributes: ["id", "name", "email"],
    where: { is_active: true },
    include: [
      {
        model: Role,
        where: { name: "Teller" },
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
        as: "userSafe",
        attributes: ["id", "name"],
      },
    ],
  });
};

export const getAllOwnerBranches = async () => {
  return await User.findAll({
    attributes: ["id", "name", "email"],
    where: { is_active: true },
    include: [
      {
        model: Role,
        where: { name: "Branch Manager" },
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
        as: "userSafe",
        attributes: ["id", "name"],
      },
    ],
  });
};

// export const getAllCustomers = async () => {
//   return await User.findAll({
//     attributes: ["id", "name", "email", "phone"],
//     where: { is_active: true },
//     include: [
//       {
//         model: Role,
//         where: { name: "Customer" },
//         attributes: ["name"],
//       },
//     ],
//   });
// };

export const getAllCustomers = async () => {
  const users = await User.findAll({
    attributes: ["id", "name", "email", "phone"],
    where: { is_active: true },
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
    role: user.Role.name,
  }));
};

export const getCustomerByPhone = async (userPhone) => {
  return await User.findOne({ where: { phone: userPhone, role_id: 6 } });
};
