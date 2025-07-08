import jwt from "jsonwebtoken";

export const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided." });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
      roleName: decoded.roleName,
      company_id: decoded.company_id,
      branch_id: decoded.branch_id,
      safe_id: decoded.safe_id,
    };
    next();
  } catch {
    res.status(401).json({ error: "Invalid token." });
  }
};
