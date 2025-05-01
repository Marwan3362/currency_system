// routes/branch.routes.js
import express from "express";
import {
  bulkCreateBranchHandler,
  getBranchesByCompanyIdHandler,
} from "../controllers/Branch.controller.js";
import { authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post(
  "/bulk",
  authorizeRoles("Admin", "Company Owner"),
  bulkCreateBranchHandler
);

export default router;

router.get(
  "/company/:companyId",
  authorizeRoles("Admin", "Company Owner"),
  getBranchesByCompanyIdHandler
);
