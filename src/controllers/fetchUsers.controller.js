// src/controllers/fetchUsers.controller.js
import {
  getAllTellers,
  getAllOwnerBranches,
  getAllCustomers,
  getCustomerByPhone,
} from "../services/fetchUsers.services.js";
import { toUserDTO } from "../utils/dto.js";

export const getTellers = async (req, res) => {
  try {
    const { roleName, branch_id } = req.user;
    const tellers = await getAllTellers(roleName, branch_id);
    const data = tellers.map(toUserDTO);
    res.status(200).json({ success: true, message: "Tellers fetched successfully", data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getOwnerBranches = async (req, res) => {
  try {
    const { roleName, branch_id, company_id } = req.user;
    const owners = await getAllOwnerBranches(roleName, branch_id, company_id);
    const data = owners.map(toUserDTO);
    res.status(200).json({ success: true, message: "Owners fetched successfully", data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getCustomers = async (req, res) => {
  try {
    const { roleName, branch_id } = req.user;
    const customers = await getAllCustomers(roleName, branch_id);
    const data = customers.map((u) => toUserDTO({ ...u, roleName: "Customer" }));
    res.status(200).json({ success: true, message: "Customers fetched successfully", data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getOneCustomer = async (req, res) => {
  const { userPhone } = req.body;
  const { roleName, branch_id } = req.user;

  try {
    const customer = await getCustomerByPhone(userPhone, roleName, branch_id);
    if (!customer) {
      return res.status(404).json({ success: false, message: "Customer not found" });
    }
    const dto = toUserDTO({ ...customer?.toJSON?.() ?? customer, roleName: "Customer" });
    res.status(200).json({ success: true, message: "Customer fetched successfully", data: dto });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
