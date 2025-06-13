
import { DataTypes } from "sequelize";
import sequelize from "../config_old/db.js";
import Company from "./Company.js";
import Branch from "./Branch.js";

const UserCompany = sequelize.define(
  "UserCompany",
  {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
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
    branch_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Branch,
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

const associateUser = async () => {
  const { default: User } = await import("./user/User.js");
  User.hasMany(UserCompany, { foreignKey: "user_id" });
  UserCompany.belongsTo(User, { foreignKey: "user_id" });
};

associateUser();

Company.hasMany(UserCompany, { foreignKey: "company_id" });
UserCompany.belongsTo(Company, { foreignKey: "company_id" });

Branch.hasMany(UserCompany, { foreignKey: "branch_id", as: "branchDetails" }); 
UserCompany.belongsTo(Branch, { foreignKey: "branch_id", as: "branchDetails" });

export default UserCompany;
