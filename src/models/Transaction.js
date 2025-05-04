import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Safe from "./Safe.js";
import Currency from "./Currency.js";
import User from "./user/User.js";

const Transaction = sequelize.define(
  "Transaction",
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
    currency_id_from: {
      type: DataTypes.STRING(10),
      allowNull: false,
      references: {
        model: Currency,
        key: "code",
      },
    },
    currency_id_to: {
      type: DataTypes.STRING(10),
      allowNull: false,
      references: {
        model: Currency,
        key: "code",
      },
    },
    type: {
      type: DataTypes.ENUM("in", "out"),
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      comment: "المبلغ المحول بالعملة المصدر",
    },
    converted_amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
      comment: "المبلغ المحول بالعملة المستقبلة",
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    related_transaction_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: User,
        key: "id",
      },
    },
    exchange_type: {
      type: DataTypes.ENUM("buy", "sell"),
      allowNull: true,
    },
    client_phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
  },
  {
    timestamps: true,
    tableName: "transactions",
  }
);

Safe.hasMany(Transaction, { foreignKey: "safe_id" });
Transaction.belongsTo(Safe, { foreignKey: "safe_id" });

Currency.hasMany(Transaction, { foreignKey: "currency_id_from" });
Transaction.belongsTo(Currency, {
  foreignKey: "currency_id_from",
  as: "currency_from",
});

Currency.hasMany(Transaction, { foreignKey: "currency_id_to" });
Transaction.belongsTo(Currency, {
  foreignKey: "currency_id_to",
  as: "currency_to",
});

Transaction.belongsTo(Transaction, {
  as: "related_transaction",
  foreignKey: "related_transaction_id",
});

User.hasMany(Transaction, { foreignKey: "user_id" });
Transaction.belongsTo(User, { foreignKey: "user_id" });

export default Transaction;
