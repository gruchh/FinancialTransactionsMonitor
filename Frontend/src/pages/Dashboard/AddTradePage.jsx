import { useNavigate } from "react-router-dom";
import { TradeForm } from "../../components/Trade/TradeForm/TradeForm";

const AddTradePage = () => {
  const navigate = useNavigate();

  const handleCancel = () => {
    navigate("/dashboard/trades");
  };

  return (
    <TradeForm 
      onCancel={handleCancel}
      trade={null}
      isLoading={false}
    />
  );
};

export default AddTradePage;