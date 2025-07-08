"use strict";

export const up = async (queryInterface, Sequelize) => {
  await queryInterface.addColumn("users", "branch_id", {
    type: Sequelize.INTEGER,
    allowNull: true,
    references: {
      model: "branches",
      key: "id",
    },
    onUpdate: "CASCADE",
    onDelete: "SET NULL",
  });

  await queryInterface.addColumn("users", "name_ar", {
    type: Sequelize.STRING,
    allowNull: true,
  });
};

export const down = async (queryInterface, Sequelize) => {
  await queryInterface.removeColumn("users", "branch_id");
  await queryInterface.removeColumn("users", "name_ar");
};
