const CheckboxField = ({
  name,
  checked,
  onChange,
  label,
  className = "",
  ...props
}) => {
  return (
    <label className={`flex items-center ${className}`}>
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300 rounded"
        {...props}
      />
      <span className="ml-2 text-sm text-gray-700">
        {label}
      </span>
    </label>
  );
};

export default CheckboxField;