const StatusMessage = ({ status }) => {
  if (!status) return null;

  return (
    <div
      className={`p-3 rounded-lg text-sm ${
        status.type === "success"
          ? "bg-green-100 text-green-700 border border-green-200"
          : "bg-red-100 text-red-700 border border-red-200"
      }`}
    >
      {status.message}
    </div>
  );
};

export default StatusMessage;