import bcrypt from "bcryptjs";

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  const now = new Date();
  const password = bcrypt.hashSync("P@ssw0rd", 10);

  try {
    await queryInterface.bulkInsert("users", [
      {
        id: 1,
        name: "Admin 1",
        email: "admin1@example.com",
        password,
        role_id: 1,
        is_active: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 2,
        name: "Admin 2",
        email: "admin2@example.com",
        password,
        role_id: 1,
        is_active: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 3,
        name: "User 1",
        email: "user1@example.com",
        password,
        role_id: 2,
        is_active: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 4,
        name: "User 2",
        email: "user2@example.com",
        password,
        role_id: 2,
        is_active: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 5,
        name: "Company Owner 1",
        email: "owner1@example.com",
        password,
        role_id: 3,
        is_active: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 6,
        name: "Company Owner 2",
        email: "owner2@example.com",
        password,
        role_id: 3,
        is_active: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 7,
        name: "Branch Manager 1",
        email: "manager1@example.com",
        password,
        role_id: 4,
        is_active: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 8,
        name: "Branch Manager 2",
        email: "manager2@example.com",
        password,
        role_id: 4,
        is_active: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 9,
        name: "Teller 1",
        email: "teller1@example.com",
        password,
        role_id: 5,
        is_active: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 10,
        name: "Teller 2",
        email: "teller2@example.com",
        password,
        role_id: 5,
        is_active: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 11,
        name: "Customer 1",
        email: "customer1@example.com",
        password,
        role_id: 6,
        is_active: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 12,
        name: "Customer 2",
        email: "customer2@example.com",
        password,
        role_id: 6,
        is_active: true,
        createdAt: now,
        updatedAt: now,
      },
    ]);
  } catch (error) {
    console.error(" Error in seeding users:", error);
    throw error;
  }
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete("users", null, {});
}
