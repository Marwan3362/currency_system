// import express from "express";
// import { register, login } from "../controllers/auth.controller.js";
// import { authenticateToken } from "../middlewares/authenticateToken.js";
// // import { authenticateToken } from "../middlewares/authenticate.js";

// const router = express.Router();

// router.post("/login", login);
// router.post("/create", authenticateToken, register);

// export default router;
import express from "express";
import { register, login } from "../controllers/auth.controller.js";
import { authenticateToken } from "../middlewares/authenticateToken.js";
import { auditLogger } from "../middlewares/auditLogger.js"; // تأكد من المسار

const router = express.Router();

router.post("/login", login);

router.post(
  "/create",
  authenticateToken,
  auditLogger({
    action: () => "Create user",
    table: "users",
    getId: (req) => "new_user", // أو ممكن تحط null وتجيبها من res
    getChanges: (req, res) => ({
      name: req.body.name,
      email: req.body.email,
      role_id: req.body.role_id,
    }),
  }),
  register
);

export default router;
