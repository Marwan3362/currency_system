export const up = async (queryInterface, Sequelize) => {
  await queryInterface.addColumn("users", "is_login", {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  });
};

export const down = async (queryInterface, Sequelize) => {
  await queryInterface.removeColumn("users", "is_login");
};
