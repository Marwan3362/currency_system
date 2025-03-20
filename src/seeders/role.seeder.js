import Role from "../models/user/Role.js";

const seedRoles = async () => {
  try {
    const roles = [
      { id: 1, name: "Admin", description: "Full access" },
      { id: 2, name: "User", description: "Limited access" },
      {
        id: 3,
        name: "Store Owner/Manager",
        description: "Manages store operations",
      },
      {
        id: 4,
        name: "Financial Manager",
        description: "Handles financial transactions and reporting",
      },
      {
        id: 5,
        name: "Operations Manager",
        description: "Oversees daily business operations",
      },
      { id: 6, name: "Teller", description: "Processes customer transactions" },
      {
        id: 7,
        name: "Compliance Officer",
        description: "Ensures regulatory compliance",
      },
      {
        id: 8,
        name: "Customer (Retail & Business)",
        description: "End users of the platform",
      },
      {
        id: 9,
        name: "IT Administrator",
        description: "Manages system infrastructure and security",
      },
    ];

    for (const role of roles) {
      await Role.findOrCreate({ where: { id: role.id }, defaults: role });
    }

    console.log("Roles seeded successfully!");
  } catch (error) {
    console.error("Error seeding roles:", error);
  }
};

export default seedRoles;
