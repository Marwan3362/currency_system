export const up = async (queryInterface, Sequelize) => {
  await queryInterface.addColumn("transactions", "reversed", {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false, 
  });
};

export const down = async (queryInterface, Sequelize) => {
  await queryInterface.removeColumn("transactions", "reversed");
};
