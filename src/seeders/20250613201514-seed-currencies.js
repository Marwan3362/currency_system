
/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  const now = new Date();

  await queryInterface.bulkInsert("currencies", [
    {
      id: 1,
      code: "USD",
      name: "US Dollar",
      name_ar: "دولار أمريكي",
      symbol: "$",
      exchange_rate: 1,
      is_active: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 2,
      code: "EGP",
      name: "Egyptian Pound",
      name_ar: "جنيه مصري",
      symbol: "ج.م",
      exchange_rate: 30,
      is_active: true,
      createdAt: now,
      updatedAt: now,
    },
  ]);
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete("currencies", null, {});
}
