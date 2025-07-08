// seeders/20250612-demo-multiple-users.js

"use strict";

import bcrypt from "bcryptjs";

export const up = async (queryInterface, Sequelize) => {
  // خصائص كل مستخدم حسب الدور
  const now = new Date();
  const users = [
    {
      name: "Admin User",
      email: "admin@example.com",
      password: await bcrypt.hash("Admin@123", 10),
      role_id: 1,
      phone: "01000000001",
      avatar: null,
      is_active: true,
      company_id: 1,
      branch_id: 1,
      createdAt: now,
      updatedAt: now,
    },
    {
      name: "Basic User",
      email: "user@example.com",
      password: await bcrypt.hash("User@123", 10),
      role_id: 2,
      phone: "01000000002",
      avatar: null,
      is_active: true,
      company_id: 1,
      branch_id: 1,
      createdAt: now,
      updatedAt: now,
    },
    {
      name: "Owner User",
      email: "owner@example.com",
      password: await bcrypt.hash("Owner@123", 10),
      role_id: 3,
      phone: "01000000003",
      avatar: null,
      is_active: true,
      company_id: 1,
      branch_id: 1,
      createdAt: now,
      updatedAt: now,
    },
    {
      name: "Branch Manager",
      email: "manager@example.com",
      password: await bcrypt.hash("Manager@123", 10),
      role_id: 4,
      phone: "01000000004",
      avatar: null,
      is_active: true,
      company_id: 1,
      branch_id: 1,
      createdAt: now,
      updatedAt: now,
    },
    {
      name: "Teller User",
      email: "teller@example.com",
      password: await bcrypt.hash("Teller@123", 10),
      role_id: 5,
      phone: "01000000005",
      avatar: null,
      is_active: true,
      company_id: 1,
      branch_id: 1,
      createdAt: now,
      updatedAt: now,
    },
    {
      name: "Customer User",
      email: "customer@example.com",
      password: await bcrypt.hash("Customer@123", 10),
      role_id: 6,
      phone: "01000000006",
      avatar: null,
      is_active: true,
      company_id: 1,
      branch_id: 1,
      createdAt: now,
      updatedAt: now,
    },
  ];

  await queryInterface.bulkInsert("users", users);
};

export const down = async (queryInterface, Sequelize) => {
  await queryInterface.bulkDelete("users", {
    email: [
      "admin@example.com",
      "user@example.com",
      "owner@example.com",
      "manager@example.com",
      "teller@example.com",
      "customer@example.com",
    ],
  });
};
