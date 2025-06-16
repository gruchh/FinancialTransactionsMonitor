const ForgotPasswordLink = ({ 
  text = "Zapomniałeś hasła?",
  href = "#"
}) => {
  return (
    <a
      href={href}
      className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
    >
      {text}
    </a>
  );
};

export default ForgotPasswordLink;