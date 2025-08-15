import * as yup from "yup";

export const createTransactionSchema = yup
  .object({
    operation: yup
      .string()
      .oneOf(["buy", "sell"], "Operation must be either 'buy' or 'sell'")
      .required("Operation is required"),

    amount: yup
      .number()
      .typeError("Amount must be a number")
      .positive("Amount must be greater than zero")
      .required("Amount is required"),

    from_currency_id: yup
      .number()
      .integer()
      .nullable()
      .when("operation", {
        is: "buy",
        then: (s) => s.required("from_currency_id is required for 'buy'"),
        otherwise: (s) => s.nullable(),
      }),

    to_currency_id: yup
      .number()
      .integer()
      .nullable()
      .when("operation", {
        is: "sell",
        then: (s) => s.required("to_currency_id is required for 'sell'"),
        otherwise: (s) => s.nullable(),
      }),

    description: yup.string().nullable(),
    notes: yup.string().nullable(),

    customer_id: yup.number().integer().nullable(),
    customer_phone: yup
      .string()
      .trim()
      .transform((v) => (v === "" ? null : v))
      .nullable(),

    custom_exchange_rate: yup
      .number()
      .typeError("custom_exchange_rate must be a number")
      .positive("Custom exchange rate must be greater than zero")
      .nullable(),
  })
  .test(
    "customer-id-or-phone",
    "Either customer_id or customer_phone is required",
    (val) => !!(val?.customer_id || val?.customer_phone)
  );

export const createTransferSchema = yup.object({
  to_safe_id: yup.number().integer().required("Target safe is required"),
  currency_id: yup.number().integer().required("Currency is required"),
  amount: yup
    .number()
    .typeError("Amount must be a number")
    .positive("Amount must be greater than 0")
    .required("Amount is required"),
  description: yup.string().nullable(),
  notes: yup.string().nullable(),
  customer_phone: yup
    .string()
    .trim()
    .transform((v) => (v === "" ? null : v))
    .nullable(),
});
