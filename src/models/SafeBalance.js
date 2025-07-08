import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class SafeBalance extends Model {
    static associate(models) {
      SafeBalance.belongsTo(models.Safe, {
        foreignKey: "safe_id",
        as: "safe",
      });

      SafeBalance.belongsTo(models.Currency, {
        foreignKey: "currency_id",
        as: "currency",
      });

      SafeBalance.belongsTo(models.User, {
        foreignKey: "updated_by",
        as: "updater",
      });
    }
  }

  SafeBalance.init(
    {
      safe_id: DataTypes.INTEGER,
      currency_id: DataTypes.INTEGER,
      balance: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
      },
      updated_by: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "SafeBalance",
      tableName: "safe_balances",
      indexes: [
        {
          unique: true,
          fields: ["safe_id", "currency_id"],
        },
      ],
    }
  );

  return SafeBalance;
};
