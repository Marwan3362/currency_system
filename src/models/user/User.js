import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";
import Role from "./Role.js";
import Safe from "../Safe.js"; 
import UserCompany from "../UserCompany.js"; 

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: true },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: false,
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 2,
      references: {
        model: Role,
        key: "id",
      },
    },
  },
  {
    timestamps: true,
    tableName: "users",
  }
);

User.hasMany(UserCompany, { foreignKey: "user_id" }); 
UserCompany.belongsTo(User, { foreignKey: "user_id" }); 

User.hasOne(Safe, { foreignKey: "user_id", as: "userSafe" });

Role.hasMany(User, { foreignKey: "role_id" });
User.belongsTo(Role, { foreignKey: "role_id" });

export default User;
