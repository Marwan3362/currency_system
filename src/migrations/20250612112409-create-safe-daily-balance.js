export const up = async (queryInterface, Sequelize) => {
  await queryInterface.createTable("safe_daily_balances", {
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
    date: {
      type: Sequelize.DATEONLY,
      allowNull: false,
    },
    opening_balance: {
      type: Sequelize.FLOAT,
      defaultValue: 0,
    },
    closing_balance: {
      type: Sequelize.FLOAT,
      defaultValue: 0,
    },
    total_in: {
      type: Sequelize.FLOAT,
      defaultValue: 0,
    },
    total_out: {
      type: Sequelize.FLOAT,
      defaultValue: 0,
    },
    closed_by: {
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

  await queryInterface.addConstraint("safe_daily_balances", {
    fields: ["safe_id", "currency_id", "date"],
    type: "unique",
    name: "unique_safe_currency_daily_entry",
  });
};

export const down = async (queryInterface, Sequelize) => {
  // Step 1: Drop any foreign-key constraints that depend on our unique index
  await queryInterface.sequelize.query(`
    ALTER TABLE \`safe_daily_balances\`
    DROP FOREIGN KEY \`safe_daily_balances_ibfk_1\`;  
  `);

  // Step 2: Remove the unique index safely
  await queryInterface.removeConstraint(
    "safe_daily_balances",
    "unique_safe_currency_daily_entry"
  );

  // Step 3: Drop the table
  await queryInterface.dropTable("safe_daily_balances");
};
