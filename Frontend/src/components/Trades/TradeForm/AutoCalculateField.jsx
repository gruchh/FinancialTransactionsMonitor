import { useEffect } from "react";

export const AutoCalculateField = ({ values, setFieldValue }) => {
  useEffect(() => {
    if (values.quantity && values.pricePerUnit) {
      const baseTotal =
        parseFloat(values.quantity) * parseFloat(values.pricePerUnit);
      let totalInPln = baseTotal;

      if (values.currency === "EUR" && values.eurPlnRate) {
        totalInPln = baseTotal * parseFloat(values.eurPlnRate);
      } else if (values.currency === "USD" && values.usdPlnRate) {
        totalInPln = baseTotal * parseFloat(values.usdPlnRate);
      }

      setFieldValue("totalValuePln", totalInPln.toFixed(2));
    } else {
      setFieldValue("totalValuePln", "");
    }
  }, [
    values.quantity,
    values.pricePerUnit,
    values.currency,
    values.eurPlnRate,
    values.usdPlnRate,
    setFieldValue,
  ]);

  return null;
};