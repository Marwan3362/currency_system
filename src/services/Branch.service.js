// services/branch.service.js
import Branch from "../models/Branch.js";

export const createBranches = async (branches) => {
  const createdBranches = await Branch.bulkCreate(branches);
  return createdBranches;
};
