import { Model, DataTypes } from "sequelize";

export default (sequelize) => {
  class Currency extends Model {
    static associate(models) {
      Currency.hasMany(models.Transaction, {
        foreignKey: "from_currency_id",
        as: "transactions_from",
      });

      Currency.hasMany(models.Transaction, {
        foreignKey: "to_currency_id",
        as: "transactions_to",
      });
    }
  }

  Currency.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      code: {
        type: DataTypes.STRING(10),
        allowNull: false,
        unique: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      name_ar: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      symbol: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      exchange_rate: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 1,
      },
      buy_rate: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      sell_rate: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      custom_rate: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: "Currency",
      tableName: "currencies",
      timestamps: true,
    }
  );

  return Currency;
};
