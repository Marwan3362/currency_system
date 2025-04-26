import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Transaction from "./Transaction.js";
import Safe from "./Safe.js";
import Currency from "./Currency.js";

const SafeTransfer = sequelize.define(
  "SafeTransfer",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    from_safe_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Safe,
        key: "id",
      },
    },
    to_safe_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Safe,
        key: "id",
      },
    },
    amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },
    currency_id: {
      type: DataTypes.STRING(10), 
      allowNull: false,
      references: {
        model: Currency,
        key: "code",
      },
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    tableName: "safe_transfers",
  }
);

SafeTransfer.hasMany(Transaction, { foreignKey: "related_transfer_id" });
Transaction.belongsTo(SafeTransfer, { foreignKey: "related_transfer_id" });

Safe.hasMany(SafeTransfer, { foreignKey: "from_safe_id" });
Safe.hasMany(SafeTransfer, { foreignKey: "to_safe_id" });

export default SafeTransfer;
