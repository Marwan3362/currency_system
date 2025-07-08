export const up = async (queryInterface, Sequelize) => {
  await queryInterface.addColumn("transactions", "operation", {
    type: Sequelize.ENUM("sell", "buy", "transfer"),
    allowNull: false,
    defaultValue: "transfer", 
  });
};

export const down = async (queryInterface, Sequelize) => {
  await queryInterface.removeColumn("transactions", "operation");


};
