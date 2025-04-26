import bcrypt from "bcryptjs";
import Company from "../models/Company.js";
import User from "../models/user/User.js";
import sequelize from "../config/db.js";

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

    // Check if company name already exists
    const existingCompany = await Company.findOne({
      where: { name: companyData.name },
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
        role_id: 3, // You can move this to a constant if needed
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

    // Commit transaction
    await t.commit();

    // Simulate sending welcome email
    console.log(`📧 Welcome email sent to ${newUser.email}`);

    return { newCompany, newUser };
  } catch (error) {
    await t.rollback();
    throw error;
  }
};
