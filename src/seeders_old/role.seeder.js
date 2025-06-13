import Role from "../models_old/user/Role.js";

const seedRoles = async () => {
  try {
    const roles = [
      { id: 1, name: "Admin", description: "Full access" },
      { id: 2, name: "User", description: "Limited access" },
      {
        id: 3,
        name: "Company Owner",
        description: "Manages store operations",
      },
      {
        id: 4,
        name: "Branch Manager",
        description: "Handles financial transactions and reporting",
      },
      {
        id: 5,
        name: "Teller",
        description: "Make transactions",
      },
      
      {
        id: 6,
        name: "Customer",
        description: "End users of the platform",
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
