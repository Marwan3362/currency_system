import { hasPermission, roleNames } from "../utils/permissions.js";

export const canCreateRole = (req, res, next) => {
  const currentRole = req.user.role;
  const newRoleId = req.body.role_id;
  const newRoleName = roleNames[newRoleId];

  if (!hasPermission(currentRole, newRoleName)) {
    return res
      .status(403)
      .json({ error: "Forbidden: cannot assign this role." });
  }
  next();
};
