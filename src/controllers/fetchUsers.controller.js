import {
  getAllTellers,
  getAllOwnerBranches,
  getAllCustomers,
  getCustomerByPhone,
} from "../services/fetchUsers.services.js";

export const getTellers = async (req, res) => {
  try {
    const { role, branch_id } = req.user;
    const tellers = await getAllTellers(role, branch_id);
    res.status(200).json({ message: "Tellers fetched successfully", tellers });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getOwnerBranches = async (req, res) => {
  try {
    const { role, branch_id, company_id } = req.user;
    const owners = await getAllOwnerBranches(role, branch_id, company_id);
    res.status(200).json({ message: "Owners fetched successfully", owners });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getCustomers = async (req, res) => {
  try {
    const { role, branch_id } = req.user;
    const customers = await getAllCustomers(role, branch_id);
    res
      .status(200)
      .json({ message: "Customers fetched successfully", customers });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getOneCustomer = async (req, res) => {
  const { userPhone } = req.query;
  const { role, branch_id } = req.user;

  try {
    const customer = await getCustomerByPhone(userPhone, role, branch_id);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res
      .status(200)
      .json({ message: "Customer fetched successfully", customer });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
