import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Safe extends Model {
    static associate(models) {
      Safe.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "owner",
      });

      Safe.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "owner_for_to",
      });

      Safe.hasMany(models.SafeBalance, {
        foreignKey: "safe_id",
        as: "balances",
      });

      Safe.hasMany(models.SafeDailyBalance, {
        foreignKey: "safe_id",
        as: "daily_balances",
      });

      Safe.hasMany(models.Transaction, {
        foreignKey: "from_safe_id",
        as: "sent_transactions",
      });

      Safe.hasMany(models.Transaction, {
        foreignKey: "to_safe_id",
        as: "received_transactions",
      });
    }
  }

  Safe.init(
    {
      name: DataTypes.STRING,
      name_ar: DataTypes.STRING,
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      user_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Safe",
      tableName: "safes",
    }
  );

  return Safe;
};
