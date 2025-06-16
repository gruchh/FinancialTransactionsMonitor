const LoginFooter = ({ 
  signupText = "Nie masz konta?", 
  signupLinkText = "Zarejestruj się",
  signupHref = "#"
}) => {
  return (
    <div className="text-center">
      <p className="text-sm text-gray-600">
        {signupText}{" "}
        <a
          href={signupHref}
          className="text-gray-700 hover:text-gray-900 font-semibold transition-colors"
        >
          {signupLinkText}
        </a>
      </p>
    </div>
  );
};

export default LoginFooter;