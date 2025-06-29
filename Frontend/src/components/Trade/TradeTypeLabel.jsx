const TradeTypeLabel = ({ type }) => {
  return (
    <span
      className={`px-2 py-1 text-xs rounded-full ${
        type === "BUY"
          ? "bg-green-100 text-green-800"
          : "bg-red-100 text-red-800"
      }`}
    >
      {type || "N/A"}
    </span>
  );
};
export default TradeTypeLabel;