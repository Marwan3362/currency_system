import express from "express";
import {
  getTellers,
  getOwnerBranches,
  getCustomers,
  getOneCustomer,
} from "../controllers/fetchUsers.controller.js";
import { authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get(
  "/tellers",
  authorizeRoles("Admin", "Company Owner", "Branch Manager"),
  getTellers
);

router.get(
  "/branches",
  authorizeRoles("Admin", "Company Owner"),
  getOwnerBranches
);

router.get(
  "/customers",
  authorizeRoles("Admin", "Company Owner", "Branch Manager", "Teller"),
  getCustomers
);

router.get(
  "/customer-phone",
  authorizeRoles("Admin", "Company Owner", "Branch Manager", "Teller"),
  getOneCustomer
);

export default router;
