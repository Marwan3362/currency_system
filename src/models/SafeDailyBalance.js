import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Safe from "./Safe.js";
import Currency from "./Currency.js";

const SafeDailyBalance = sequelize.define("SafeDailyBalance", {
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
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
}, {
  timestamps: true,
  tableName: "safe_daily_balances",
  indexes: [
    {
      unique: true,
      fields: ["safe_id", "currency_id", "date"],
    },
  ],
});

Safe.hasMany(SafeDailyBalance, { foreignKey: "safe_id" });
SafeDailyBalance.belongsTo(Safe, { foreignKey: "safe_id" });

Currency.hasMany(SafeDailyBalance, { foreignKey: "currency_id" });
SafeDailyBalance.belongsTo(Currency, { foreignKey: "currency_id" });

export default SafeDailyBalance;
