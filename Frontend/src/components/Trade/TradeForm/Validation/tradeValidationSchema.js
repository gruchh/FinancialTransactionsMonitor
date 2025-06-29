import * as Yup from "yup";

export const tradeValidationSchema = Yup.object({
  fund: Yup.object().nullable().required("Fund is required"),
  tradeDate: Yup.date()
    .required("Trade date is required")
    .max(new Date(), "Trade date cannot be in the future"),
  type: Yup.string()
    .oneOf(["BUY", "SELL"], "Invalid trade type")
    .required("Trade type is required"),
  currency: Yup.string()
    .oneOf(["PLN", "EUR", "USD"], "Invalid currency")
    .required("Currency is required"),
  quantity: Yup.number()
    .positive("Quantity must be positive")
    .required("Quantity is required")
    .test("decimal", "Quantity can have maximum 4 decimal places", (value) => {
      if (!value) return true;
      return /^\d+(\.\d{1,4})?$/.test(value.toString());
    }),
  pricePerUnit: Yup.number()
    .positive("Price per unit must be positive")
    .required("Price per unit is required")
    .test("decimal", "Price can have maximum 4 decimal places", (value) => {
      if (!value) return true;
      return /^\d+(\.\d{1,4})?$/.test(value.toString());
    }),
  eurPlnRate: Yup.number()
    .positive("EUR/PLN rate must be positive")
    .nullable()
    .when("currency", {
      is: "EUR",
      then: (schema) =>
        schema.required("EUR/PLN rate is required when currency is EUR"),
      otherwise: (schema) => schema,
    })
    .test("decimal", "Rate can have maximum 4 decimal places", (value) => {
      if (!value) return true;
      return /^\d+(\.\d{1,4})?$/.test(value.toString());
    }),
  usdPlnRate: Yup.number()
    .positive("USD/PLN rate must be positive")
    .nullable()
    .when("currency", {
      is: "USD",
      then: (schema) =>
        schema.required("USD/PLN rate is required when currency is USD"),
      otherwise: (schema) => schema,
    })
    .test("decimal", "Rate can have maximum 4 decimal places", (value) => {
      if (!value) return true;
      return /^\d+(\.\d{1,4})?$/.test(value.toString());
    }),
});