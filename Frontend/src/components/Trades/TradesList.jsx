import { useEffect } from 'react';
import { useTrades } from '../../hooks/useTrades';

const TradesList = ({ onFundClick }) => {
  const {
    trades,
    loading,
    error,
    fetchTrades,
    updateTrade,
    deleteTrade,
    clearError,
  } = useTrades();

  useEffect(() => {
    fetchTrades();
  }, []);

  const formatCurrency = (value, currency = 'PLN') => {
    if (!value) return 'N/A';
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency,
    }).format(value);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('pl-PL');
  };

  const handleFundClick = (fund) => {
    if (onFundClick && fund) {
      onFundClick(fund.id || fund.symbol);
    }
  };

  const handleEdit = async (trade) => {
    try {
      const updatedData = { ...trade }; // Placeholder, w aplikacji dane z formularza
      const result = await updateTrade(trade.id, updatedData);
      if (!result.success) {
        console.error(result.message);
      }
    } catch (err) {
      console.error('Błąd podczas edycji:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Czy na pewno chcesz usunąć tę transakcję?')) {
      const result = await deleteTrade(id);
      if (!result.success) {
        console.error(result.message);
      }
    }
  };

  if (loading) {
    return <div className="text-center py-4">Ładowanie...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-4 text-red-600">
        Błąd: {error}
        <button
          onClick={clearError}
          className="ml-2 text-blue-600 hover:underline"
        >
          Wyczyść błąd
        </button>
      </div>
    );
  }

  if (!trades || trades.length === 0) {
    return <div className="text-center py-4">Brak transakcji do wyświetlenia.</div>;
  }

  return (
    <div className="w-full overflow-x-auto mt-0">
      <table className="w-full bg-white border border-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data transakcji</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fundusz</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Typ</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ilość</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cena/Jednostka</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kurs EUR/PLN</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kurs USD/PLN</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Wartość (PLN)</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Akcje</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {trades.map((trade) => (
            <tr key={trade.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {formatDate(trade.tradeDate)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {trade.fund ? (
                  <button
                    onClick={() => handleFundClick(trade.fund)}
                    className="text-blue-600 hover:text-blue-800 hover:underline focus:outline-none focus:underline transition-colors duration-200"
                  >
                    {trade.fund.name || trade.fund.symbol || 'N/A'}
                  </button>
                ) : (
                  'N/A'
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    trade.type === 'BUY'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {trade.type || 'N/A'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {trade.quantity ? trade.quantity.toString() : 'N/A'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {formatCurrency(trade.pricePerUnit)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {trade.eurPlnRate ? trade.eurPlnRate.toString() : 'N/A'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {trade.usdPlnRate ? trade.usdPlnRate.toString() : 'N/A'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {formatCurrency(trade.totalValuePln)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <button
                  onClick={() => handleEdit(trade)}
                  className="text-blue-600 hover:text-blue-900 mr-2"
                >
                  Edytuj
                </button>
                <button
                  onClick={() => handleDelete(trade.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  Usuń
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TradesList;