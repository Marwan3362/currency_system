export const up = async (queryInterface, Sequelize) => {
  await queryInterface.addColumn("transactions", "notes", {
    type: Sequelize.STRING,
    allowNull: true,
  });

  await queryInterface.addColumn("transactions", "customer_phone", {
    type: Sequelize.STRING,
    allowNull: true,
  });
};

export const down = async (queryInterface, Sequelize) => {
  await queryInterface.removeColumn("transactions", "notes");
  await queryInterface.removeColumn("transactions", "customer_phone");
};
