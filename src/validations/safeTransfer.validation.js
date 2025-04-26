// validations/safeTransfer.validation.js
import * as yup from "yup";

export const safeTransferSchema = yup.object({
  from_safe_id: yup.number().required("Source safe is required"),
  to_safe_id: yup.number().required("Destination safe is required"),
  amount: yup.number().positive("Amount must be a positive number").required("Amount is required"),
  currency_id: yup.string().required("Currency is required"),
  date: yup.date().required("Date is required"),
  description: yup.string().nullable(),
  user_id: yup.number().required("User ID is required"),
});
