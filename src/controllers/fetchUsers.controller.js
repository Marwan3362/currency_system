import {
  getAllTellers,
  getAllOwnerBranches,
  getAllCustomers,
  getCustomerByPhone,
} from "../services/fetchUsers.services.js";

export const getTellers = async (req, res) => {
  try {
    const tellers = await getAllTellers();
    res
      .status(200)
      .json({ message: "All tellers fetched successfully", tellers });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getOwnerBranches = async (req, res) => {
  try {
    const owners = await getAllOwnerBranches();
    res
      .status(200)
      .json({ message: "All owners fetched successfully", owners });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getCustomers = async (req, res) => {
  try {
    const customers = await getAllCustomers();
    res
      .status(200)
      .json({ message: "All customers fetched successfully", customers });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getOneCustomer = async (req, res) => {
  const $userPhoneBody = req.body.userPhone;
  try {
    const customer = await getCustomerByPhone($userPhoneBody);
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
