import { ErrorMessage, Field } from "formik";

export const AnimatedExchangeRates = ({ currency, errors, touched }) => {
  const isVisible = currency !== "PLN";

  return (
    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
      isVisible 
        ? "max-h-40 animate-fade-down " 
        : "max-h-0 animate-fade-up"
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