// controllers/branch.controller.js
import bulkCreateBranchSchema from "../validations/Branch.validation.js";
import { createBranches } from "../services/Branch.service.js";

export const bulkCreateBranchHandler = async (req, res) => {
  try {
    const validatedBranches = await bulkCreateBranchSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    const branches = await createBranches(validatedBranches);

    return res.status(201).json({
      success: true,
      data: branches,
      message: "Branches created successfully",
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        errors: err.errors,
      });
    }

    console.error("Error creating branches:", err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
