import { useTrades } from "../../hooks/useTrades";
import { toast } from 'react-toastify';

const TradeActions = ({ trade, onEdit }) => {
  const { deleteTrade } = useTrades();
  const handleEdit = () => onEdit(trade);
  const handleDelete = async () => {
    const result = await deleteTrade(trade.id);
    if (result.success) {
      toast.success("Transaction deleted successfully");
    } else {
      toast.error("Failed to delete transaction: " + result.message);
      console.error("Deletion error:", result.message);
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