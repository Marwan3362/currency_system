"use strict";
import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.belongsTo(models.Role, { foreignKey: "role_id" });

      User.belongsTo(models.Company, {
        foreignKey: "company_id",
        as: "company",
      });
      User.hasMany(models.Branch, {
        foreignKey: "branch_manager",
        as: "managed_branches",
      });
      User.belongsTo(models.Branch, {
        foreignKey: "branch_id",
        as: "branch",
      });
      User.hasMany(models.AuditLog, {
        foreignKey: "user_id",
        as: "audit_logs",
      });
      User.hasOne(models.Safe, {
        foreignKey: "user_id",
        as: "Safe",
      });
    }
  }

  User.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: true },
      },
      name_ar: {
        type: DataTypes.STRING,
        allowNull: true,
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
      },
      company_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      branch_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      is_login: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users",
      timestamps: true,
    }
  );

  return User;
};
