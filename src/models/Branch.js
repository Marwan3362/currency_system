import { DataTypes } from "sequelize";
// import sequelize from "../../config/db.js";
import sequelize from "../config/db.js";

import User from "./user/User.js";
import Company from "./Company.js";


const Branch = sequelize.define(
  "Branch",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    company_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      
      references: {
        model: Company,
        key: "id",
      },
    },
    branch_manager: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: User,
        key: "id",
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name_ar: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    timestamps: true,
    tableName: "branches",
  }
);

Company.hasMany(Branch, { foreignKey: "company_id" });
Branch.belongsTo(Company, { foreignKey: "company_id" });

User.hasMany(Branch, { foreignKey: "branch_manager", as: "managed_branches" });
Branch.belongsTo(User, { foreignKey: "branch_manager", as: "manager" });

export default Branch;
