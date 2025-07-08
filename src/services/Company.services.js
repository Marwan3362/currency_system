import bcrypt from "bcryptjs";
import sequelize from "../config/db.js";
import { Op } from "sequelize";
import db from "../models/index.js";

const { User, Company, Safe } = db;

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

    // Check if company with same name or name_ar exists
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
        role_id: 3, // Company Owner
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

    // Create safe for the owner
    const newSafe = await Safe.create(
      {
        name: `Safe for ${newUser.name}`,
        user_id: newUser.id,
        company_id: newCompany.id,
        is_active: true,
      },
      { transaction: t }
    );

    // Update user with company_id and safe_id
    await newUser.update(
      {
        company_id: newCompany.id,
        safe_id: newSafe.id,
      },
      { transaction: t }
    );

    await t.commit();

    return { newCompany, newUser, newSafe };
  } catch (error) {
    await t.rollback();
    throw error;
  }
};
