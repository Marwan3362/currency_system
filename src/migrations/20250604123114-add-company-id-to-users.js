"use strict";

export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn("users", "company_id", {
    type: Sequelize.INTEGER,
    allowNull: true,
    references: {
      model: "companies",
      key: "id",
    },
    onUpdate: "CASCADE",
    onDelete: "SET NULL",
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.removeColumn("users", "company_id");
}
