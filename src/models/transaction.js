// models/transaction.js
import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Transaction extends Model {
    static associate(models) {
      Transaction.belongsTo(models.Safe, {
        foreignKey: "from_safe_id",
        as: "from_safe",
      });

      Transaction.belongsTo(models.Safe, {
        foreignKey: "to_safe_id",
        as: "to_safe",
      });

      Transaction.belongsTo(models.Currency, {
        foreignKey: "from_currency_id",
        as: "from_currency",
      });

      Transaction.belongsTo(models.Currency, {
        foreignKey: "to_currency_id",
        as: "to_currency",
      });

      Transaction.belongsTo(models.User, {
        foreignKey: "customer_id",
        as: "customer",
      });
    }
  }

  Transaction.init(
    {
      from_safe_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      to_safe_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      from_currency_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      to_currency_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      customer_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM("pending", "approved", "rejected"),
        allowNull: false,
        defaultValue: "pending",
      },
      type: {
        type: DataTypes.ENUM("in", "out"),
        allowNull: false,
      },
      amount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
      },
      converted_amount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: true,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      operation: {
        type: DataTypes.ENUM("buy", "sell", "transfer"),
        allowNull: true,
      },

      notes: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      customer_phone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      reversed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false, // 0
      },
      // ----------------------
    },
    {
      sequelize,
      modelName: "Transaction",
      tableName: "transactions",
      timestamps: true,
    }
  );

  return Transaction;
};
