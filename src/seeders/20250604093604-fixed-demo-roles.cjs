
export const up = async (queryInterface) => {
  const now = new Date();

  await queryInterface.bulkInsert("roles", [
    {
      id: 1,
      name: "Admin",
      description: "Full access",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 2,
      name: "User",
      description: "Limited access",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 3,
      name: "Company Owner",
      description: "Manages store operations",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 4,
      name: "Branch Manager",
      description: "Handles financial transactions and reporting",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 5,
      name: "Teller",
      description: "Make transactions",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 6,
      name: "Customer",
      description: "End users of the platform",
      createdAt: now,
      updatedAt: now,
    },
  ]);
};

export const down = async (queryInterface) => {
  await queryInterface.bulkDelete("roles", {
    id: [1, 2, 3, 4, 5, 6],
  });
};
