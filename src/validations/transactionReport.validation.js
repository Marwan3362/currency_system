import * as yup from "yup";

export const reportFilterSchema = yup.object({
  from_date: yup.date().nullable(),
  to_date: yup.date().nullable(),
  safe_id: yup.number().nullable(),
  user_id: yup.number().nullable(),
  type: yup.string().oneOf(["in", "out"]).nullable(),
  currency_id: yup.string().nullable(),
});
