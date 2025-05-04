// validations/transaction.validation.js
import * as yup from "yup";

export const createTransactionSchema = yup.object({
  safe_id: yup.number().required("Safe ID is required"),
  currency_id_from: yup.string().required("Source currency is required"),
  currency_id_to: yup.string().required("Target currency is required"),
  amount: yup
    .number()
    .positive("Amount must be a positive number")
    .required("Amount is required"),
  type: yup
    .string()
    .oneOf(["in", "out"], "Invalid transaction type")
    .required("Transaction type is required"),
  description: yup.string().nullable(),
  user_id: yup.number().nullable(),
  date: yup.date().required("Date is required"),
  exchange_type: yup
    .string()
    .oneOf(["buy", "sell"], "exchange_type must be 'buy' or 'sell'")
    .required("exchange_type is required"),

  client_phone: yup.string().nullable(),
});
