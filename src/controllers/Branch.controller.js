import bulkCreateBranchSchema from "../validations/Branch.validation.js";
import {
  createBranches,
  getBranchesByCompanyId,
} from "../services/Branch.service.js";

export const bulkCreateBranchHandler = async (req, res) => {
  try {
    const branchesInput = req.body.map((branch) => ({
      ...branch,
      company_id: req.user.company_id,
    }));

    const validatedBranches = await bulkCreateBranchSchema.validate(
      branchesInput,
      {
        abortEarly: false,
        stripUnknown: true,
      }
    );

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

export const getBranchesByCompanyIdHandler = async (req, res) => {
  try {
    const companyId = req.params.companyId;
    const branches = await getBranchesByCompanyId(companyId);

    if (!branches || branches.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No branches found for company ID ${companyId}`,
      });
    }

    return res.status(200).json({
      success: true,
      data: branches,
      message: "Branches fetched successfully",
    });
  } catch (err) {
    console.error("Error fetching branches:", err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
