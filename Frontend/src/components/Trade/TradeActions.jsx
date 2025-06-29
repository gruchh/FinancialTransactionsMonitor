import { useTrades } from "../../hooks/useTrades";

const TradeActions = ({ trade, onEdit }) => {
  const { deleteTrade } = useTrades();
  const handleEdit = () => onEdit(trade);
  const handleDelete = async () => {
    const result = await deleteTrade(trade.id);
    if (result.success) {
      console.log("Transakcja została usunięta");
    } else {
      console.error("Błąd usuwania:", result.message);
    }
  };

  return (
    <>
      <button
        onClick={handleEdit}
        className="text-blue-600 hover:text-blue-900 mr-2"
      >
        Edytuj
      </button>
      <button
        onClick={handleDelete}
        className="text-red-600 hover:text-red-900"
      >
        Usuń
      </button>
    </>
  );
};

export default TradeActions;