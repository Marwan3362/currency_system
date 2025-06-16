import db from "../models/index.js";

const { Branch } = db;

export const createBranches = async (branches) => {
  const createdBranches = await Branch.bulkCreate(branches);
  return createdBranches;
};

export const getBranchesByCompanyId = async (companyId) => {
  const branches = await Branch.findAll({
    where: { company_id: companyId },
  });
  return branches;
};
