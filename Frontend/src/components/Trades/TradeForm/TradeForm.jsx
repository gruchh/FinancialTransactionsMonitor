import { ErrorMessage, Field, Form, Formik } from "formik";
import { AutoCalculateField } from "./AutoCalculateField";
import { AnimatedExchangeRates } from "./AnimatedExchangeRates";
import { tradeValidationSchema } from "./Validation/tradeValidationSchema";

export const TradeForm = ({
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

              {/* Exchange Rates */}
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
