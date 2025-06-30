import { ErrorMessage, Field } from "formik";

export const ExchangeRatesSection = ({
  values,
  errors,
  touched,
  exchangeRates,
  ratesLoading,
  onRefreshRates
}) => {
  // Don't render if currency is PLN
  if (values.currency === "PLN") {
    return null;
  }

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-700">
          Exchange Rates
        </h3>
        <button
          type="button"
          onClick={onRefreshRates}
          disabled={ratesLoading}
          className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          {ratesLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Updating...
            </>
          ) : (
            <>
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </>
          )}
        </button>
      </div>
      
      {exchangeRates.lastUpdated && (
        <p className="text-xs text-gray-500 mb-3">
          Last updated: {exchangeRates.lastUpdated}
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {values.currency === "EUR" && (
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
                  : "border-gray-300"
              }`}
            />
            <ErrorMessage
              name="eurPlnRate"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>
        )}

        {values.currency === "USD" && (
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
                  : "border-gray-300"
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
  );
};