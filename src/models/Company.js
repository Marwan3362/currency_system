"use strict";
import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Company extends Model {
    static associate(models) {
      Company.belongsTo(models.User, {
        foreignKey: "owner_id",
        as: "owner",
      });

      models.User.hasMany(Company, {
        foreignKey: "owner_id",
        as: "owned_companies",
      });
      Company.hasMany(models.Branch, {
        foreignKey: "company_id",
        as: "branches",
      });
      Company.hasMany(models.AuditLog, {
        foreignKey: "company_id",
        as: "audit_logs",
      });
    }
  }

  Company.init(
    {
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
      },
    },
    {
      sequelize,
      modelName: "Company",
      tableName: "companies",
      timestamps: true,
    }
  );

  return Company;
};
