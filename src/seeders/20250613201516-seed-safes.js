
/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  const now = new Date();

  await queryInterface.bulkInsert("safes", [
    {
      name: "Safe 1",
      name_ar: "خزنة 1",
      is_active: true,
      user_id: 1,
      createdAt: now,
      updatedAt: now,
    },
    {
      name: "Safe 2",
      name_ar: "خزنة 2",
      is_active: true,
      user_id: 2,
      createdAt: now,
      updatedAt: now,
    },
    {
      name: "Safe 3",
      name_ar: "خزنة 3",
      is_active: true,
      user_id: 3,
      createdAt: now,
      updatedAt: now,
    },
    {
      name: "Safe 4",
      name_ar: "خزنة 4",
      is_active: true,
      user_id: 4,
      createdAt: now,
      updatedAt: now,
    },
    {
      name: "Safe 5",
      name_ar: "خزنة 5",
      is_active: true,
      user_id: 5,
      createdAt: now,
      updatedAt: now,
    },
    {
      name: "Safe 6",
      name_ar: "خزنة 6",
      is_active: true,
      user_id: 6,
      createdAt: now,
      updatedAt: now,
    },
    {
      name: "Safe 7",
      name_ar: "خزنة 7",
      is_active: true,
      user_id: 7,
      createdAt: now,
      updatedAt: now,
    },
    {
      name: "Safe 8",
      name_ar: "خزنة 8",
      is_active: true,
      user_id: 8,
      createdAt: now,
      updatedAt: now,
    },
    {
      name: "Safe 9",
      name_ar: "خزنة 9",
      is_active: true,
      user_id: 9,
      createdAt: now,
      updatedAt: now,
    },
    {
      name: "Safe 10",
      name_ar: "خزنة 10",
      is_active: true,
      user_id: 10,
      createdAt: now,
      updatedAt: now,
    },
    {
      name: "Safe 11",
      name_ar: "خزنة 11",
      is_active: true,
      user_id: 11,
      createdAt: now,
      updatedAt: now,
    },
    {
      name: "Safe 12",
      name_ar: "خزنة 12",
      is_active: true,
      user_id: 12,
      createdAt: now,
      updatedAt: now,
    },
  ]);
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete("safes", null, {});
}
