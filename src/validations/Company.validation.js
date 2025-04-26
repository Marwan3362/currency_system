import * as Yup from "yup";
import Company from "../models/Company.js";

export const createCompanyValidation = Yup.object({
  name: Yup.string()
    .required("Company name is required")
    .test(
      "unique-company-name",
      "Company name already exists",
      async (value) => {
        if (!value) return false;
        const company = await Company.findOne({ where: { name: value } });
        return !company; 
      }
    ),
  company_email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  phone: Yup.string().optional(),
  address: Yup.string().optional(),
  ownerName: Yup.string().required("Owner name is required"),
  ownerEmail: Yup.string()
    .email("Invalid email format")
    .required("Owner email is required"),
  ownerPassword: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Owner password is required"),
});
