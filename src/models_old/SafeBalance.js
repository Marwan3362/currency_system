import { DataTypes } from "sequelize";
import sequelize from "../config_old/db.js";
import Safe from "./Safe.js";
import Currency from "./Currency.js";

const SafeBalance = sequelize.define(
  "SafeBalance",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    safe_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Safe,
        key: "id",
      },
    },
    currency_id: {
      type: DataTypes.STRING(10),
      allowNull: false,
      references: {
        model: Currency,
        key: "code",
      },
    },
    amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    timestamps: true,
    tableName: "safe_balances",
    indexes: [
      {
        unique: true,
        fields: ["safe_id", "currency_id"],
      },
    ],
  }
);

Safe.hasMany(SafeBalance, { foreignKey: "safe_id" });
SafeBalance.belongsTo(Safe, { foreignKey: "safe_id" });

Currency.hasMany(SafeBalance, { foreignKey: "currency_id" });
SafeBalance.belongsTo(Currency, { foreignKey: "currency_id" });

export default SafeBalance;
