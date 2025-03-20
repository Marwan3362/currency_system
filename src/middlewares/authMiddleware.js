import jwt from "jsonwebtoken";

export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      const token = req.header("Authorization")?.split(" ")[1]; 
      if (!token) {
        return res
          .status(401)
          .json({ error: "Access Denied. No token provided." });
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;

      if (!allowedRoles.includes(req.user.role)) {
        return res
          .status(403)
          .json({ error: "Forbidden. You do not have permission." });
      }
      next();
    } catch (error) {
      res.status(401).json({ error: "Invalid Token." });
    }
  };
};
