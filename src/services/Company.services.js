import bcrypt from "bcryptjs";
import sequelize from "../config/db.js"; 
import { Op } from "sequelize";

import db from "../models/index.js";

const { User, Company } = db;
export const createCompanyWithOwnerService = async (companyData, ownerData) => {
  const t = await sequelize.transaction();

  try {
    // Check if user email already exists
    const existingUser = await User.findOne({
      where: { email: ownerData.email },
    });
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    const existingCompany = await Company.findOne({
      where: {
        [Op.or]: [{ name: companyData.name }, { name_ar: companyData.name_ar }],
      },
    });

    if (existingCompany) {
      throw new Error("Company with this name already exists");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(ownerData.password, 10);

    // Create user
    const newUser = await User.create(
      {
        name: ownerData.name,
        email: ownerData.email,
        password: hashedPassword,
        role_id: 3,
      },
      { transaction: t }
    );

    // Create company
    const newCompany = await Company.create(
      {
        ...companyData,
        owner_id: newUser.id,
      },
      { transaction: t }
    );

    await t.commit();



    return { newCompany, newUser };
  } catch (error) {
    await t.rollback();
    throw error;
  }
};
