import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./user/User.js";
import Company from "./Company.js";

const UserCompany = sequelize.define(
  "UserCompany",
  {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
    },
    company_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Company,
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
    },
  },
  {
    timestamps: false,
    tableName: "user_companies",
  }
);

User.belongsToMany(Company, {
  through: UserCompany,
  foreignKey: "user_id",
  as: "companies",
});

Company.belongsToMany(User, {
  through: UserCompany,
  foreignKey: "company_id",
  as: "users",
});

export default UserCompany;
