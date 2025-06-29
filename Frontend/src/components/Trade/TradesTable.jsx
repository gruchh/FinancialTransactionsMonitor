import TradeRow from './TradeRow';

const TradesTable = ({ trades, onFundClick, onEdit, onDelete, formatCurrency, formatDate, getCurrencySymbol }) => {
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
            <TradeRow
              key={trade.id}
              trade={trade}
              onFundClick={onFundClick}
              onEdit={onEdit}
              onDelete={onDelete}
              formatCurrency={formatCurrency}
              formatDate={formatDate}
              getCurrencySymbol={getCurrencySymbol}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TradesTable;
