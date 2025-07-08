export const up = async (queryInterface, Sequelize) => {
  await queryInterface.addColumn("transactions", "customer_id", {
    type: Sequelize.INTEGER,
    allowNull: true,
    references: {
      model: "users",
      key: "id",
    },
    onUpdate: "CASCADE",
    onDelete: "SET NULL",
  });
};

export const down = async (queryInterface, Sequelize) => {
  await queryInterface.removeColumn("transactions", "customer_id");
};
