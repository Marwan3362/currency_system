
/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  const now = new Date();

  await queryInterface.bulkInsert("branches", [
    {
      id: 1,
      name: "Branch A1",
      name_ar: "فرع أ1",
      company_id: 1,
      branch_manager: 7,
      is_active: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 2,
      name: "Branch B1",
      name_ar: "فرع ب1",
      company_id: 2,
      branch_manager: 8,
      is_active: true,
      createdAt: now,
      updatedAt: now,
    },
  ]);
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete("branches", null, {});
}
