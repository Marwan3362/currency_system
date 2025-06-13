// import express from "express";
// import {
//   getTellers,
//   getOwnerBranches,
//   getCustomers,
//   getOneCustomer,
// } from "../controllers/fetchUsers.controller.js";
// import { authorizeRoles } from "../middlewares/authMiddleware.js";

// const router = express.Router();

// router.get(
//   "/tellers",
//   authorizeRoles("Admin", "Company Owner", "Branch Manager"),
//   getTellers
// );

// router.get(
//   "/branches",
//   authorizeRoles("Admin", "Company Owner"),
//   getOwnerBranches
// );

// router.get(
//   "/customers",
//   authorizeRoles("Admin", "Company Owner", "Branch Manager", "Teller"),
//   getCustomers
// );

// router.get(
//   "/customer-phone",
//   authorizeRoles("Admin", "Company Owner", "Branch Manager", "Teller"),
//   getOneCustomer
// );

// export default router;

import express from "express";
import {
  getTellers,
  getOwnerBranches,
  getCustomers,
  getOneCustomer,
} from "../controllers/fetchUsers.controller.js";
import { authenticateToken } from "../middlewares/authenticateToken.js";
import { authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get(
  "/tellers",
  authenticateToken,
  authorizeRoles("Admin", "CompanyOwner", "BranchManager"),
  getTellers
);

router.get(
  "/branches",
  authenticateToken,
  authorizeRoles("Admin", "CompanyOwner"),
  getOwnerBranches
);

router.get(
  "/customers",
  authenticateToken,
  authorizeRoles("Admin", "CompanyOwner", "BranchManager", "Teller"),
  getCustomers
);

router.get(
  "/customer-phone",
  authenticateToken,
  authorizeRoles("Admin", "CompanyOwner", "BranchManager", "Teller"),
  getOneCustomer
);

export default router;
