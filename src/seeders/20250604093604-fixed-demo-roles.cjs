import bcrypt from "bcrypt";

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  const now = new Date();
  const password = bcrypt.hashSync("P@ssw0rd", 10);

  // 1. Users (بدون company_id و branch_id مؤقتًا)
  await queryInterface.bulkInsert("users", [
    {
      id: 1,
      name: "Admin 1",
      email: "admin1@example.com",
      password,
      role_id: 1,
      company_id: null,
      branch_id: null,
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
      company_id: null,
      branch_id: null,
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
      company_id: null,
      branch_id: null,
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
      company_id: null,
      branch_id: null,
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
      company_id: null,
      branch_id: null,
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
      company_id: null,
      branch_id: null,
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
      company_id: null,
      branch_id: null,
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
      company_id: null,
      branch_id: null,
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
      company_id: null,
      branch_id: null,
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
      company_id: null,
      branch_id: null,
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
      company_id: null,
      branch_id: null,
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
      company_id: null,
      branch_id: null,
      is_active: true,
      createdAt: now,
      updatedAt: now,
    },
  ]);

  // 2. Companies
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

  // 3. Branches
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

  // 4. Currencies
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

  // 5. Update users with company_id & branch_id
  await queryInterface.bulkUpdate(
    "users",
    { company_id: 1, branch_id: 1 },
    { id: 1 }
  );
  await queryInterface.bulkUpdate(
    "users",
    { company_id: 2, branch_id: 2 },
    { id: 2 }
  );
  await queryInterface.bulkUpdate(
    "users",
    { company_id: 1, branch_id: 1 },
    { id: 3 }
  );
  await queryInterface.bulkUpdate(
    "users",
    { company_id: 2, branch_id: 2 },
    { id: 4 }
  );
  await queryInterface.bulkUpdate(
    "users",
    { company_id: 1, branch_id: 1 },
    { id: 5 }
  );
  await queryInterface.bulkUpdate(
    "users",
    { company_id: 2, branch_id: 2 },
    { id: 6 }
  );
  await queryInterface.bulkUpdate(
    "users",
    { company_id: 1, branch_id: 1 },
    { id: 7 }
  );
  await queryInterface.bulkUpdate(
    "users",
    { company_id: 2, branch_id: 2 },
    { id: 8 }
  );
  await queryInterface.bulkUpdate(
    "users",
    { company_id: 1, branch_id: 1 },
    { id: 9 }
  );
  await queryInterface.bulkUpdate(
    "users",
    { company_id: 2, branch_id: 2 },
    { id: 10 }
  );
  await queryInterface.bulkUpdate(
    "users",
    { company_id: 1, branch_id: 1 },
    { id: 11 }
  );
  await queryInterface.bulkUpdate(
    "users",
    { company_id: 2, branch_id: 2 },
    { id: 12 }
  );

  // 6. Safes
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

  // 7. Safe Balances
  const balances = [];
  for (let i = 1; i <= 12; i++) {
    balances.push(
      {
        safe_id: i,
        currency_id: 1,
        balance: 100 * i,
        updated_by: i,
        createdAt: now,
        updatedAt: now,
      },
      {
        safe_id: i,
        currency_id: 2,
        balance: 1000 * i,
        updated_by: i,
        createdAt: now,
        updatedAt: now,
      }
    );
  }
  await queryInterface.bulkInsert("safe_balances", balances);
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete("safe_balances", null, {});
  await queryInterface.bulkDelete("safes", null, {});
  await queryInterface.bulkDelete("currencies", null, {});
  await queryInterface.bulkDelete("branches", null, {});
  await queryInterface.bulkDelete("companies", null, {});
  await queryInterface.bulkDelete("users", null, {});
}
