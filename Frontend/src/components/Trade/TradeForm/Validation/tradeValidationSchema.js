import * as Yup from "yup";

export const tradeValidationSchema = Yup.object({
  fundId: Yup.string().required("Fund is required"),
  tradeDate: Yup.date()
    .required("Trade date is required")
    .max(new Date(), "Trade date cannot be in the future"),
  type: Yup.string()
    .oneOf(["BUY", "SELL"], "Invalid trade type")
    .required("Trade type is required"),
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
});