import { ErrorMessage, Field, Form, Formik } from "formik";
import { useEffect } from "react";
import * as Yup from "yup";

const tradeValidationSchema = Yup.object({
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

const AutoCalculateField = ({ values, setFieldValue }) => {
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

const AnimatedExchangeRates = ({ currency, errors, touched }) => {
  const isVisible = currency !== "PLN";

  return (
    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
      isVisible 
        ? "max-h-40 opacity-100 translate-y-0" 
        : "max-h-0 opacity-0 -translate-y-2"
    }`}>
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 shadow-sm">
        <h3 className="text-sm font-medium text-blue-900 mb-3 flex items-center">
          <svg 
            className="w-4 h-4 mr-2" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" 
            />
          </svg>
          Exchange Rates
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {currency === "EUR" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                EUR/PLN Rate <span className="text-red-500">*</span>
              </label>
              <Field
                name="eurPlnRate"
                type="number"
                step="0.0001"
                placeholder="0.0000"
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.eurPlnRate && touched.eurPlnRate
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300 bg-white"
                }`}
              />
              <ErrorMessage
                name="eurPlnRate"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>
          )}

          {currency === "USD" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                USD/PLN Rate <span className="text-red-500">*</span>
              </label>
              <Field
                name="usdPlnRate"
                type="number"
                step="0.0001"
                placeholder="0.0000"
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.usdPlnRate && touched.usdPlnRate
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300 bg-white"
                }`}
              />
              <ErrorMessage
                name="usdPlnRate"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const TradeForm = ({
  trade = null,
  funds = [],
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const initialValues = {
    fund: trade?.fund || null,
    tradeDate: trade?.tradeDate || new Date().toISOString().split("T")[0],
    type: trade?.type || "BUY",
    currency: trade?.currency || "PLN",
    quantity: trade?.quantity || "",
    pricePerUnit: trade?.pricePerUnit || "",
    eurPlnRate: trade?.eurPlnRate || "",
    usdPlnRate: trade?.usdPlnRate || "",
    totalValuePln: trade?.totalValuePln || "",
  };

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      const baseTotal =
        parseFloat(values.quantity) * parseFloat(values.pricePerUnit);
      let totalInPln = baseTotal;

      if (values.currency === "EUR" && values.eurPlnRate) {
        totalInPln = baseTotal * parseFloat(values.eurPlnRate);
      } else if (values.currency === "USD" && values.usdPlnRate) {
        totalInPln = baseTotal * parseFloat(values.usdPlnRate);
      }

      const submitData = {
        ...values,
        totalValuePln: totalInPln.toFixed(2),
      };

      await onSubmit(submitData);
    } catch (error) {
      console.error("Error submitting trade:", error);
      if (error.fieldErrors) {
        Object.keys(error.fieldErrors).forEach((field) => {
          setFieldError(field, error.fieldErrors[field]);
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full flex flex-col">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {trade ? "Edit Trade" : "Add New Trade"}
        </h2>

        <Formik
          initialValues={initialValues}
          validationSchema={tradeValidationSchema}
          onSubmit={handleSubmit}
          enableReinitialize={true}
        >
          {({ values, setFieldValue, isSubmitting, errors, touched }) => (
            <Form className="space-y-6">
              <AutoCalculateField
                values={values}
                setFieldValue={setFieldValue}
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fund <span className="text-red-500">*</span>
                </label>
                <Field name="fund">
                  {({ field }) => (
                    <select
                      {...field}
                      value={values.fund?.id || ""}
                      onChange={(e) => {
                        const selectedFund = funds.find(
                          (f) => f.id === parseInt(e.target.value)
                        );
                        setFieldValue("fund", selectedFund || null);
                      }}
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        errors.fund && touched.fund
                          ? "border-red-500 bg-red-50"
                          : "border-gray-300"
                      }`}
                    >
                      <option value="">Select a fund</option>
                      {funds.map((fund) => (
                        <option key={fund.id} value={fund.id}>
                          {fund.name} ({fund.symbol || fund.code})
                        </option>
                      ))}
                    </select>
                  )}
                </Field>
                <ErrorMessage
                  name="fund"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Trade Date <span className="text-red-500">*</span>
                  </label>
                  <Field
                    name="tradeDate"
                    type="date"
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.tradeDate && touched.tradeDate
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300"
                    }`}
                  />
                  <ErrorMessage
                    name="tradeDate"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Currency <span className="text-red-500">*</span>
                  </label>
                  <Field
                    name="currency"
                    as="select"
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.currency && touched.currency
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300"
                    }`}
                  >
                    <option value="PLN">PLN (Polish Złoty)</option>
                    <option value="EUR">EUR (Euro)</option>
                    <option value="USD">USD (US Dollar)</option>
                  </Field>
                  <ErrorMessage
                    name="currency"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trade Type <span className="text-red-500">*</span>
                </label>
                <div className="flex space-x-6">
                  <label className="flex items-center">
                    <Field
                      type="radio"
                      name="type"
                      value="BUY"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700 flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      BUY
                    </span>
                  </label>
                  <label className="flex items-center">
                    <Field
                      type="radio"
                      name="type"
                      value="SELL"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700 flex items-center">
                      <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                      SELL
                    </span>
                  </label>
                </div>
                <ErrorMessage
                  name="type"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity <span className="text-red-500">*</span>
                  </label>
                  <Field
                    name="quantity"
                    type="number"
                    step="0.0001"
                    placeholder="0.0000"
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.quantity && touched.quantity
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300"
                    }`}
                  />
                  <ErrorMessage
                    name="quantity"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Per Unit ({values.currency}){" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <Field
                    name="pricePerUnit"
                    type="number"
                    step="0.0001"
                    placeholder="0.0000"
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.pricePerUnit && touched.pricePerUnit
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300"
                    }`}
                  />
                  <ErrorMessage
                    name="pricePerUnit"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
              </div>

              <AnimatedExchangeRates 
                currency={values.currency} 
                errors={errors} 
                touched={touched} 
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Value (PLN)
                </label>
                <Field
                  name="totalValuePln"
                  type="text"
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-700 cursor-not-allowed"
                  placeholder="Auto-calculated"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {values.currency === "PLN"
                    ? "Automatically calculated from quantity × price per unit"
                    : `Automatically calculated from quantity × price per unit × ${values.currency}/PLN rate`}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={onCancel}
                  disabled={isSubmitting || isLoading}
                  className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || isLoading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                >
                  {(isSubmitting || isLoading) && (
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  )}
                  {isSubmitting || isLoading
                    ? "Saving..."
                    : trade
                    ? "Update Trade"
                    : "Create Trade"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default TradeForm;