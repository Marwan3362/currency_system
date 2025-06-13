  import { DataTypes } from "sequelize";
  import sequelize from "../config_old/db.js";

  const Currency = sequelize.define(
    "Currency",
    {
      code: {
        type: DataTypes.STRING(10),
        primaryKey: true,
        allowNull: false,
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
      timestamps: true,
      tableName: "currencies",
    }
  );

  export default Currency;
