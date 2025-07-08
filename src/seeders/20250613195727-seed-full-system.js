import bcrypt from "bcryptjs";

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  const now = new Date();
  const password = bcrypt.hashSync("P@ssw0rd", 10);

  // 1. Users (بدون company_id و branch_id)
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

  // 2. Companies (بدون owner_id مؤقتًا)
  await queryInterface.bulkInsert("companies", [
    {
      id: 1,
      name: "Company A",
      name_ar: "شركة أ",
      owner_id: null,
      is_active: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 2,
      name: "Company B",
      name_ar: "شركة ب",
      owner_id: null,
      is_active: true,
      createdAt: now,
      updatedAt: now,
    },
  ]);

  // 3. Branches (بدون branch_manager مؤقتًا)
  await queryInterface.bulkInsert("branches", [
    {
      id: 1,
      name: "Branch A1",
      name_ar: "فرع أ1",
      company_id: 1,
      branch_manager: null,
      is_active: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 2,
      name: "Branch B1",
      name_ar: "فرع ب1",
      company_id: 2,
      branch_manager: null,
      is_active: true,
      createdAt: now,
      updatedAt: now,
    },
  ]);

  // 4. Update users with company & branch
  const userUpdates = [
    [1, 1, 1],
    [2, 2, 2],
    [3, 1, 1],
    [4, 2, 2],
    [5, 1, 1],
    [6, 2, 2],
    [7, 1, 1],
    [8, 2, 2],
    [9, 1, 1],
    [10, 2, 2],
    [11, 1, 1],
    [12, 2, 2],
  ];
  for (const [id, companyId, branchId] of userUpdates) {
    await queryInterface.bulkUpdate(
      "users",
      { company_id: companyId, branch_id: branchId },
      { id }
    );
  }

  // 5. Update companies with owner_id
  await queryInterface.bulkUpdate("companies", { owner_id: 5 }, { id: 1 });
  await queryInterface.bulkUpdate("companies", { owner_id: 6 }, { id: 2 });

  // 6. Update branches with branch_manager
  await queryInterface.bulkUpdate("branches", { branch_manager: 7 }, { id: 1 });
  await queryInterface.bulkUpdate("branches", { branch_manager: 8 }, { id: 2 });

  // 7. Currencies
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

  // 8. Safes
  const safes = [];
  for (let i = 1; i <= 12; i++) {
    safes.push({
      name: `Safe ${i}`,
      name_ar: `خزنة ${i}`,
      is_active: true,
      user_id: i,
      createdAt: now,
      updatedAt: now,
    });
  }
  await queryInterface.bulkInsert("safes", safes);

  // 9. Safe Balances
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
