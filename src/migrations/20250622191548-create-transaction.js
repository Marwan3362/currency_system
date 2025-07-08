export const up = async (queryInterface, Sequelize) => {
  await queryInterface.createTable("transactions", {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    from_safe_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "safes",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    to_safe_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "safes",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    from_currency_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "currencies",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    to_currency_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "currencies",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    status: {
      type: Sequelize.ENUM("pending", "approved", "rejected"),
      allowNull: false,
      defaultValue: "pending",
    },
    type: {
      type: Sequelize.ENUM("in", "out"),
      allowNull: false,
    },
    amount: {
      type: Sequelize.DECIMAL(15, 2),
      allowNull: false,
    },
    converted_amount: {
      type: Sequelize.DECIMAL(15, 2),
      allowNull: true,
    },
    description: {
      type: Sequelize.STRING,
      allowNull: true,
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
};

export const down = async (queryInterface, Sequelize) => {
  await queryInterface.dropTable("transactions");
};
