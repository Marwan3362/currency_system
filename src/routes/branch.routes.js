import express from "express";
import {
  bulkCreateBranchHandler,
  getBranchesByCompanyIdHandler,
} from "../controllers/Branch.controller.js";
import { authenticateToken } from "../middlewares/authenticateToken.js";
import { authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post(
  "/bulk",
  authenticateToken,
  authorizeRoles("Admin", "Company Owner"),
  bulkCreateBranchHandler
);

router.get(
  "/company/:companyId",
  authenticateToken,
  authorizeRoles("Admin", "Company Owner"),
  getBranchesByCompanyIdHandler
);

export default router;
