import { Model, DataTypes } from "sequelize";

export default (sequelize) => {
  class AuditLog extends Model {
    static associate(models) {
      AuditLog.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user",
      });

      AuditLog.belongsTo(models.Company, {
        foreignKey: "company_id",
        as: "company",
      });

      AuditLog.belongsTo(models.Branch, {
        foreignKey: "branch_id",
        as: "branch",
      });
    }
  }

  AuditLog.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      company_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      branch_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      action: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      table_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      record_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      changes: {
        type: DataTypes.JSON,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "AuditLog",
      tableName: "audit_logs",
      timestamps: true,
    }
  );

  return AuditLog;
};
