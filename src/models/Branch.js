import { Model, DataTypes } from "sequelize";

export default (sequelize) => {
  class Branch extends Model {
    static associate(models) {
      Branch.belongsTo(models.Company, {
        foreignKey: "company_id",
        as: "company",
      });

      Branch.belongsTo(models.User, {
        foreignKey: "branch_manager",
        as: "manager",
      });
      Branch.hasMany(models.User, {
        foreignKey: "branch_id",
        as: "users",
      });
      Branch.hasMany(models.AuditLog, {
        foreignKey: "branch_id",
        as: "audit_logs",
      });
    }
  }

  Branch.init(
    {
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
      company_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      branch_manager: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Branch",
      tableName: "branches",
      timestamps: true,
    }
  );

  return Branch;
};
