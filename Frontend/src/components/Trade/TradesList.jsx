import { useEffect } from "react";
import { formatCurrency, formatDate, getCurrencySymbol } from "../utils/tradeFormatters";
import { useTrades } from "../../hooks/useTrades";
import EmptyState from "./EmptyState";
import LoadingSpinner from "./LoadingSpinner";
import TradesTable from "./TradesTable";

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

  const handleEdit = async (trade) => {
    try {
      const updatedData = { ...trade };
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
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage error={error} onClearError={clearError} />;
  }

  if (!trades || trades.length === 0) {
    return <EmptyState />;
  }

  return (
    <TradesTable
      trades={trades}
      onFundClick={onFundClick}
      onEdit={handleEdit}
      onDelete={handleDelete}
      formatCurrency={formatCurrency}
      formatDate={formatDate}
      getCurrencySymbol={getCurrencySymbol}
    />
  );
};

export default TradesList;