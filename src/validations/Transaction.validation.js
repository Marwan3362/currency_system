import * as yup from "yup";

export const createTransactionSchema = yup.object({
  amount: yup
    .number()
    .required("Amount is required")
    .positive("Amount must be greater than zero"),
  to_currency_id: yup.number(),
  from_currency_id: yup.number(),
  customer_id: yup.number().integer().nullable(),
  operation: yup
    .string()
    .oneOf(["buy", "sell"], "Operation must be either 'buy' or 'sell'")
    .required("Operation is required"),
  description: yup.string().nullable(),
  custom_exchange_rate: yup
    .number()
    .nullable()
    .positive("Custom exchange rate must be greater than zero"),
});

export const createTransferSchema = yup.object().shape({
  to_safe_id: yup.number().required("Target safe is required"),
  currency_id: yup.number().required("Currency is required"),
  amount: yup
    .number()
    .positive("Amount must be greater than 0")
    .required("Amount is required"),
  description: yup.string().nullable(),
});
