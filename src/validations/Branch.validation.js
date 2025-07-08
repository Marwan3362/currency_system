import * as yup from "yup";

const singleBranchSchema = yup.object().shape({
  name: yup.string().required("Branch name is required"),
  address: yup.string().nullable(),
  phone: yup.string().nullable(),
  is_active: yup.boolean().default(true),
  branch_manager: yup.number().nullable(),
  company_id: yup.number().required("Company ID is required"),
});

const bulkCreateBranchSchema = yup.array().of(singleBranchSchema);

export default bulkCreateBranchSchema;
