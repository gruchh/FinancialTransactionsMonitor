const ErrorMessage = ({ error, onClearError }) => {
  return (
    <div className="text-center py-4 text-red-600">
      Błąd: {error}
      <button
        onClick={onClearError}
        className="ml-2 text-blue-600 hover:underline"
      >
        Wyczyść błąd
      </button>
    </div>
  );
};