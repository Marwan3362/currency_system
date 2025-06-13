// import { Request, Response } from "express";
import { createCompanyWithOwnerService } from "../services/Company.services.js";
import { createCompanyValidation } from "../validations/Company.validation.js";


export const createCompanyWithOwner = async (req = Request, res = Response) => {
  try {
    await createCompanyValidation.validate(req.body, { abortEarly: false });

    const {
      name,
      name_ar,
      company_email,
      phone,
      address,
      ownerName,
      ownerEmail,
      ownerPassword,
    } = req.body;

    const { newCompany, newUser } = await createCompanyWithOwnerService(
      { name, name_ar, company_email, phone, address },
      { name: ownerName, email: ownerEmail, password: ownerPassword }
    );

    return res.status(201).json({
      message: "Company and Owner created successfully",
      company: {
        name: newCompany.name,
        company_email: newCompany.company_email,
      },
      owner: {
        id: newUser.id,
        name: newUser.name,
      },
    });
  } catch (error) {
    return res.status(400).json({
      message: "Validation error",
      details: error.errors || error.message,
    });
  }
};

