export const roleNames = {
  1: "Admin",
  2: "User",
  3: "Company Owner",
  4: "Branch Manager",
  5: "Teller",
  6: "Customer",
};

export const hasPermission = (creatorRoleId, targetRoleId) => {
  const hierarchy = {
    Admin: ["Company Owner", "Branch Manager", "Teller", "Customer"],
    "Company Owner": ["Branch Manager", "Teller"],
    "Branch Manager": ["Teller"],
    Teller: ["Customer"],
    Customer: [],
    User: [],
  };

  const creatorRoleName = roleNames[creatorRoleId];
  const targetRoleName = roleNames[targetRoleId];

  return hierarchy[creatorRoleName]?.includes(targetRoleName);
};
