// routes/branch.routes.js
import express from "express";
import { bulkCreateBranchHandler } from "../controllers/Branch.controller.js";

const router = express.Router();

router.post("/bulk", bulkCreateBranchHandler);

export default router;
