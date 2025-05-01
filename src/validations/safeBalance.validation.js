import * as yup from "yup";

export const safeBalanceSchema = yup.object({
  safe_id: yup.number().required("Safe ID is required"),
  currency_id: yup.string().required("Currency code is required"),
  amount: yup
    .number()
    .positive("Amount must be a positive number")
    .required("Amount is required"),
});
