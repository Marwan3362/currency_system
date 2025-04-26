import { DataTypes } from "sequelize";
// import sequelize from "../../config/db.js";
import sequelize from "../config/db.js";

import User from "./user/User.js";

const Company = sequelize.define(
  "Company",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    name_ar: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    company_email: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmail: true,
      },
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    owner_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
    },
  },
  {
    timestamps: true,
    tableName: "companies",
  }
);

Company.belongsTo(User, {
  foreignKey: "owner_id",
  as: "owner",
});

User.hasMany(Company, {
  foreignKey: "owner_id",
  as: "owned_companies",
});

export default Company;
