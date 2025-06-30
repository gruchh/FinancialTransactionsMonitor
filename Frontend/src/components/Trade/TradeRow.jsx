import TradeActions from "./TradeActions";
import TradeTypeLabel from "./TradeTypeLabel";

const TradeRow = ({ trade, onFundClick, onEdit, onDelete, formatCurrency, formatDate, getCurrencySymbol }) => {
  const handleFundClick = () => {
    if (onFundClick && trade.fund) {
      onFundClick(trade.fund.id || trade.fund.symbol);
    }
  };

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {formatDate(trade.tradeDate)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {trade.fundSymbol ? (
          <button
            onClick={handleFundClick}
            className="text-blue-600 hover:text-blue-800 hover:underline focus:outline-none focus:underline transition-colors duration-200"
          >
            {trade.fundSymbol || 'N/A'}
          </button>
        ) : (
          'N/A'
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <TradeTypeLabel type={trade.type} />
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {trade.quantity ? trade.quantity.toString() : 'N/A'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {trade.pricePerUnit ? 
          formatCurrency(trade.pricePerUnit, getCurrencySymbol(trade.currencyType))
          : 'N/A'
        }
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
        <TradeActions 
          trade={trade}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </td>
    </tr>
  );
};

export default TradeRow;
