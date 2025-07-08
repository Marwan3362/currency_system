import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class SafeDailyBalance extends Model {
    static associate(models) {
      SafeDailyBalance.belongsTo(models.Safe, {
        foreignKey: "safe_id",
        as: "safe",
      });

      SafeDailyBalance.belongsTo(models.Currency, {
        foreignKey: "currency_id",
        as: "currency",
      });

      SafeDailyBalance.belongsTo(models.User, {
        foreignKey: "closed_by",
        as: "closer",
      });
    }
  }

  SafeDailyBalance.init(
    {
      safe_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      currency_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      opening_balance: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
      },
      closing_balance: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
      },
      total_in: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
      },
      total_out: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
      },
      closed_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "SafeDailyBalance",
      tableName: "safe_daily_balances",
      indexes: [
        {
          unique: true,
          fields: ["safe_id", "currency_id", "date"],
          name: "unique_safe_currency_daily_entry",
        },
      ],
    }
  );

  return SafeDailyBalance;
};
