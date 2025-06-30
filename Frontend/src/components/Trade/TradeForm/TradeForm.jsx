import { ErrorMessage, Field, Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { tradeValidationSchema } from "./Validation/tradeValidationSchema";
import { useTrades } from "../../../hooks/useTrades";
import { fundsService } from "../../../service/fundsService";
import { ExchangeRateManager } from "../../../hooks/exchangeRateManager";
import toast from "react-hot-toast";

export const TradeForm = ({
  trade = null,
  onCancel,
  isLoading = false,
}) => {
  const { createTrade, updateTrade } = useTrades();
  const [funds, setFunds] = useState([]);
  const [fundsLoading, setFundsLoading] = useState(true);
  const [exchangeRates, setExchangeRates] = useState({
    eurPln: null,
    usdPln: null,
    lastUpdated: null,
  });

  const exchangeRateManager = ExchangeRateManager({
    onRatesUpdate: setExchangeRates,
    initialRates: {
      eurPln: null,
      usdPln: null,
      lastUpdated: null,
    },
  });

  useEffect(() => {
    const fetchFunds = async () => {
      try {
        setFundsLoading(true);
        const fundsData = await fundsService.fetchFunds();
        setFunds(fundsData);
      } catch (error) {
        console.error("Error fetching funds:", error);
        setFunds([]);
      } finally {
        setFundsLoading(false);
      }
    };
    fetchFunds();
  }, []);

  const initialValues = {
    fundId: trade?.fund?.id || "",
    tradeDate: trade?.tradeDate || new Date().toISOString().split("T")[0],
    type: trade?.type || "BUY",
    quantity: trade?.quantity || "",
    pricePerUnit: trade?.pricePerUnit || "",
  };

  const calculatePreviewValue = (values) => {
    const selectedFund = funds.find(f => f.id === parseInt(values.fundId));
    if (!selectedFund || !values.quantity || !values.pricePerUnit) return "";
    
    const baseTotal = parseFloat(values.quantity) * parseFloat(values.pricePerUnit);
    if (isNaN(baseTotal)) return "";
    
    const currency = selectedFund.currencyType;
    
    if (currency === "PLN") {
      return baseTotal.toFixed(2);
    } else if (currency === "EUR" && exchangeRates.eurPln) {
      const eurRate = typeof exchangeRates.eurPln === 'number' ? exchangeRates.eurPln : parseFloat(exchangeRates.eurPln);
      return !isNaN(eurRate) ? (baseTotal * eurRate).toFixed(2) : "";
    } else if (currency === "USD" && exchangeRates.usdPln) {
      const usdRate = typeof exchangeRates.usdPln === 'number' ? exchangeRates.usdPln : parseFloat(exchangeRates.usdPln);
      return !isNaN(usdRate) ? (baseTotal * usdRate).toFixed(2) : "";
    }
    return "Rate not available";
  };

  const formatExchangeRate = (rate) => {
    if (!rate) return "Loading...";
    
    const numericRate = typeof rate === 'number' ? rate : parseFloat(rate);
    
    return !isNaN(numericRate) ? numericRate.toFixed(4) : "Loading...";
  };

  const handleSubmit = async (values, { setSubmitting, setFieldError, resetForm }) => {
    try {
      setSubmitting(true);
      
      const submitData = {
        fundId: parseInt(values.fundId),
        tradeDate: values.tradeDate,
        type: values.type,
        quantity: parseFloat(values.quantity),
        pricePerUnit: parseFloat(values.pricePerUnit),
      };

      const result = trade
        ? await updateTrade(trade.id, submitData)
        : await createTrade(submitData);
        
      if (result.success) {
        toast.success(`Trade ${trade ? "updated" : "created"} successfully!`);
        resetForm();
        onCancel();
      } else {
        toast.error(`Failed to ${trade ? "update" : "create"} trade: ${result.message}`);
        if (result.fieldErrors) {
          Object.entries(result.fieldErrors).forEach(([field, error]) => {
            setFieldError(field, error);
          });
        } else {
          setFieldError("general", result.message || "An error occurred while saving");
        }
      }
    } catch (error) {
      console.error("Error submitting trade:", error);
      setFieldError("general", "An unexpected error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  const refreshRates = async () => {
    await exchangeRateManager.refreshRates();
  };

  if (fundsLoading) {
    return (
      <div className="flex justify-center">
        <div className="w-full max-w-4xl bg-white p-4 rounded-lg shadow-md">
          <div className="animate-pulse space-y-2">
            <div className="h-6 bg-gray-200 rounded"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-4xl bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          {trade ? "Edit Trade" : "Add New Trade"}
        </h2>
        
        <Formik
          initialValues={initialValues}
          validationSchema={tradeValidationSchema}
          onSubmit={(values, actions) => {
            return handleSubmit(values, actions);
          }}
          enableReinitialize
        >
          {({ values, setFieldValue, isSubmitting, errors, touched }) => {
            const selectedFund = funds.find(f => f.id === parseInt(values.fundId));
            const previewValue = calculatePreviewValue(values);
            
            return (
              <Form className="space-y-4">
                <ErrorMessage
                  name="general"
                  component="div"
                  className="text-red-500 text-sm p-2 bg-red-50 border border-red-200 rounded-md"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fund <span className="text-red-500">*</span>
                    </label>
                    <Field
                      name="fundId"
                      as="select"
                      className={`w-full px-2 py-1 border rounded-md text-sm ${
                        errors.fundId && touched.fundId
                          ? "border-red-500 bg-red-50"
                          : "border-gray-300"
                      }`}
                    >
                      <option value="">Select fund</option>
                      {funds.map((fund) => (
                        <option key={fund.id} value={fund.id}>
                          {fund.name} ({fund.symbol}) - {fund.currencyType}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage name="fundId" component="div" className="text-red-500 text-xs mt-1" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Trade Date <span className="text-red-500">*</span>
                    </label>
                    <Field
                      name="tradeDate"
                      type="date"
                      max={new Date().toISOString().split('T')[0]}
                      className={`w-full px-2 py-1 border rounded-md text-sm ${
                        errors.tradeDate && touched.tradeDate
                          ? "border-red-500 bg-red-50"
                          : "border-gray-300"
                      }`}
                    />
                    <ErrorMessage name="tradeDate" component="div" className="text-red-500 text-xs mt-1" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Trade Type <span className="text-red-500">*</span>
                  </label>
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={() => setFieldValue("type", "BUY")}
                      className={`flex items-center px-4 py-2 rounded-md border-2 text-sm font-medium ${
                        values.type === "BUY"
                          ? "border-green-500 bg-green-50 text-green-700"
                          : "border-gray-300 bg-white text-gray-700 hover:border-green-300"
                      }`}
                    >
                      BUY
                    </button>
                    <button
                      type="button"
                      onClick={() => setFieldValue("type", "SELL")}
                      className={`flex items-center px-4 py-2 rounded-md border-2 text-sm font-medium ${
                        values.type === "SELL"
                          ? "border-red-500 bg-red-50 text-red-700"
                          : "border-gray-300 bg-white text-gray-700 hover:border-red-300"
                      }`}
                    >
                      SELL
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quantity <span className="text-red-500">*</span>
                    </label>
                    <Field
                      name="quantity"
                      type="number"
                      step="0.0001"
                      min="0.0001"
                      placeholder="0.0000"
                      className={`w-full px-2 py-1 border rounded-md text-sm ${
                        errors.quantity && touched.quantity
                          ? "border-red-500 bg-red-50"
                          : "border-gray-300"
                      }`}
                    />
                    <ErrorMessage name="quantity" component="div" className="text-red-500 text-xs mt-1" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price Per Unit {selectedFund && `(${selectedFund.currencyType})`}
                      <span className="text-red-500">*</span>
                    </label>
                    <Field
                      name="pricePerUnit"
                      type="number"
                      step="0.0001"
                      min="0.0001"
                      placeholder="0.0000"
                      className={`w-full px-2 py-1 border rounded-md text-sm ${
                        errors.pricePerUnit && touched.pricePerUnit
                          ? "border-red-500 bg-red-50"
                          : "border-gray-300"
                      }`}
                    />
                    <ErrorMessage name="pricePerUnit" component="div" className="text-red-500 text-xs mt-1" />
                  </div>
                </div>

                {selectedFund && (
                  <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-sm font-medium text-gray-700">Preview & Exchange Rates</h3>
                      <button
                        type="button"
                        onClick={refreshRates}
                        className="text-xs text-blue-600 hover:text-blue-800"
                      >
                        Refresh rates
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Total Value (PLN):</span>
                        <div className="font-medium">
                          {previewValue ? `${previewValue} PLN` : "Enter values to see preview"}
                        </div>
                      </div>
                      
                      {selectedFund.currencyType !== "PLN" && (
                        <>
                          <div>
                            <span className="text-gray-600">EUR/PLN Rate:</span>
                            <div className="font-medium">
                              {formatExchangeRate(exchangeRates.eurPln)}
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-600">USD/PLN Rate:</span>
                            <div className="font-medium">
                              {formatExchangeRate(exchangeRates.usdPln)}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                    
                    <p className="text-xs text-gray-500 mt-2">
                      * Final values will be calculated by the system using exchange rates for the trade date
                    </p>
                  </div>
                )}

                <div className="flex justify-end space-x-2 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      onCancel();
                    }}
                    disabled={isSubmitting || isLoading}
                    className="px-4 py-1 border border-gray-300 rounded-md text-sm text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || isLoading}
                    className="px-4 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 disabled:opacity-50"
                  >
                    {isSubmitting || isLoading ? "Saving..." : trade ? "Update Trade" : "Create Trade"}
                  </button>
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
};