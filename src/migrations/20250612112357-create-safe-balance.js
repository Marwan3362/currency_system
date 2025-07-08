// export const up = async (queryInterface, Sequelize) => {
//   await queryInterface.createTable("safe_balances", {
//     id: {
//       allowNull: false,
//       autoIncrement: true,
//       primaryKey: true,
//       type: Sequelize.INTEGER,
//     },
//     safe_id: {
//       type: Sequelize.INTEGER,
//       allowNull: false,
//       references: {
//         model: "safes",
//         key: "id",
//       },
//       onUpdate: "CASCADE",
//       onDelete: "CASCADE",
//     },
//     currency_id: {
//       type: Sequelize.INTEGER,
//       allowNull: false,
//       references: {
//         model: "currencies",
//         key: "id",
//       },
//       onUpdate: "CASCADE",
//       onDelete: "RESTRICT",
//     },
//     balance: {
//       type: Sequelize.FLOAT,
//       defaultValue: 0,
//     },
//     updated_by: {
//       type: Sequelize.INTEGER,
//       allowNull: false,
//       references: {
//         model: "users",
//         key: "id",
//       },
//       onUpdate: "CASCADE",
//       onDelete: "CASCADE",
//     },
//     createdAt: {
//       allowNull: false,
//       type: Sequelize.DATE,
//       defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
//     },
//     updatedAt: {
//       allowNull: false,
//       type: Sequelize.DATE,
//       defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
//     },
//   });

//   await queryInterface.addConstraint("safe_balances", {
//     fields: ["safe_id", "currency_id"],
//     type: "unique",
//     name: "unique_safe_currency_balance",
//   });
// };

// export const down = async (queryInterface, Sequelize) => {
//   await queryInterface.removeConstraint(
//     "safe_balances",
//     "unique_safe_currency_balance"
//   );
//   await queryInterface.dropTable("safe_balances");
// };

// create-safe-balances.js

export const up = async (queryInterface, Sequelize) => {
  await queryInterface.createTable("safe_balances", {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    safe_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: "safes", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    currency_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: "currencies", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
    },
    balance: {
      type: Sequelize.FLOAT,
      defaultValue: 0,
    },
    updated_by: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: "users", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
  });

  await queryInterface.addConstraint("safe_balances", {
    fields: ["safe_id", "currency_id"],
    type: "unique",
    name: "unique_safe_currency_balance",
  });
};

export const down = async (queryInterface, Sequelize) => {
  await queryInterface.sequelize.query(`
    ALTER TABLE \`safe_balances\`
    DROP FOREIGN KEY \`safe_balances_ibfk_1\`;
  `);

  await queryInterface.removeConstraint(
    "safe_balances",
    "unique_safe_currency_balance"
  );

  await queryInterface.dropTable("safe_balances");
};
