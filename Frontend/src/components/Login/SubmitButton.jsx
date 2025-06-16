const SubmitButton = ({
  isSubmitting,
  children,
  loadingText = "Ładowanie...",
  className = "",
  ...props
}) => {
  return (
    <button
      type="submit"
      disabled={isSubmitting}
      className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 ${
        isSubmitting
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-gray-700 hover:bg-gray-800 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
      } ${className}`}
      {...props}
    >
      {isSubmitting ? loadingText : children}
    </button>
  );
};

export default SubmitButton;