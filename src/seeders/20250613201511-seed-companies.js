
/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  const now = new Date();

  await queryInterface.bulkInsert("companies", [
    {
      id: 1,
      name: "Company A",
      name_ar: "شركة أ",
      owner_id: 5,
      is_active: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 2,
      name: "Company B",
      name_ar: "شركة ب",
      owner_id: 6,
      is_active: true,
      createdAt: now,
      updatedAt: now,
    },
  ]);
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete("companies", null, {});
}
