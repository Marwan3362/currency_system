import { DataTypes } from "sequelize";
import sequelize from "../config_old/db.js";

const Safe = sequelize.define(
  "Safe",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    name_ar: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    type: {
      type: DataTypes.ENUM("company", "branch", "teller"),
      allowNull: false,
    },
    company_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    branch_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      unique: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    timestamps: true,
    tableName: "safes",
  }
);

const associateUser = async () => {
  const { default: User } = await import("./user/User.js");
  Safe.belongsTo(User, { foreignKey: "user_id", as: "userSafe" }); 
};

associateUser();

export default Safe;
