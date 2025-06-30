import { useState } from "react";
import { Menu, X, User, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, user, logout, isLoading } = useAppContext();

  const handleLogin = () => {
    navigate("/login");
    setIsMenuOpen(false);
  };

  const handleRegister = () => {
    navigate("/register");
    setIsMenuOpen(false);
  };

  const handleDashboard = () => {
    navigate("/dashboard");
    setIsMenuOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
    setIsMenuOpen(false);
  };

  const navigateHome = () => {
    navigate("/");
    setIsMenuOpen(false);
  };

  const renderAuthButtons = (isMobile = false) => {
    const baseClasses = isMobile
      ? "px-4 py-2 text-left transition-colors"
      : "px-4 py-2 transition-colors";

    const primaryButtonClasses = isMobile
      ? "px-6 py-2 bg-gradient-to-r from-gray-700 to-gray-900 text-white rounded-lg hover:from-gray-800 hover:to-black transition-all cursor-pointer"
      : "px-6 py-2 bg-gradient-to-r from-gray-700 to-gray-900 text-white rounded-lg hover:from-gray-800 hover:to-black transition-all transform hover:scale-105 shadow-lg cursor-pointer";

    if (isLoading) {
      return (
        <div
          className={
            isMobile ? "flex flex-col space-y-4" : "flex items-center space-x-4"
          }
        >
          <div className="animate-pulse bg-gray-300 rounded px-4 py-2 w-20 h-8"></div>
          <div className="animate-pulse bg-gray-300 rounded px-6 py-2 w-28 h-8"></div>
        </div>
      );
    }

    if (isAuthenticated) {
      return (
        <div
          className={
            isMobile ? "flex flex-col space-y-4" : "flex items-center space-x-4"
          }
        >
          <div
            className={
              isMobile ? "" : "flex items-center space-x-2 text-gray-600"
            }
          >
            <User className="w-4 h-4" />
            <span className="text-sm">
              Witaj, {user?.data?.username || user?.data?.name || "Użytkowniku"}
              !
            </span>
          </div>
          <button
            className={`${baseClasses} text-gray-600 hover:text-gray-800 cursor-pointer`}
            onClick={handleDashboard}
          >
            Dashboard
          </button>
          <button
            className={`${baseClasses} text-red-600 hover:text-red-800 flex items-center space-x-1 cursor-pointer`}
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4" />
            <span>Wyloguj się</span>
          </button>
        </div>
      );
    } else {
      return (
        <div
          className={
            isMobile ? "flex flex-col space-y-4" : "flex items-center space-x-4"
          }
        >
          <button
            className={`${baseClasses} text-gray-600 hover:text-gray-800 cursor-pointer`}
            onClick={handleLogin}
          >
            Zaloguj się
          </button>
          <button className={primaryButtonClasses} onClick={handleRegister}>
            Zarejestruj się
          </button>
        </div>
      );
    }
  };

  return (
    <nav className="relative z-50 px-6 py-4 bg-white/90 backdrop-blur-md border-b border-gray-300 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div
          className="flex items-center space-x-3 cursor-pointer"
          onClick={navigateHome}
        >
          <svg
            width="48"
            height="48"
            viewBox="0 0 48 48"
            className="text-gray-700"
          >
            <defs>
              <linearGradient
                id="currencyGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#374151" />
                <stop offset="50%" stopColor="#4B5563" />
                <stop offset="100%" stopColor="#6B7280" />
              </linearGradient>
            </defs>
            <path
              d="M16 12c-6 0-10 4-10 12s4 12 10 12c3 0 5.5-1 7.5-3"
              stroke="url(#currencyGradient)"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />
            <line
              x1="8"
              y1="20"
              x2="20"
              y2="20"
              stroke="url(#currencyGradient)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <line
              x1="8"
              y1="28"
              x2="20"
              y2="28"
              stroke="url(#currencyGradient)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              d="M32 8c-4 0-7 2-7 6 0 3 2 5 6 6l4 1c3 1 5 3 5 6 0 4-3 7-8 7-3 0-5-1-6-3"
              stroke="url(#currencyGradient)"
              strokeWidth="2.8"
              fill="none"
              strokeLinecap="round"
            />
            <line
              x1="32"
              y1="6"
              x2="32"
              y2="12"
              stroke="url(#currencyGradient)"
              strokeWidth="2.8"
              strokeLinecap="round"
            />
            <line
              x1="32"
              y1="36"
              x2="32"
              y2="42"
              stroke="url(#currencyGradient)"
              strokeWidth="2.8"
              strokeLinecap="round"
            />
            <path
              d="M24 18c2 2 4 4 6 6"
              stroke="url(#currencyGradient)"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
              opacity="0.6"
              strokeDasharray="2,2"
            />
          </svg>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
              FinancialTransactionsMonitor
            </h1>
            <p className="text-xs text-gray-500">Portfolio Management</p>
          </div>
        </div>

        <div className="hidden md:flex items-center space-x-8">
          {renderAuthButtons(false)}
        </div>

        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden text-gray-600"
        >
          {isMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md border-b border-gray-200 px-6 py-4 shadow-lg">
          {renderAuthButtons(true)}
        </div>
      )}
    </nav>
  );
};

export default Navigation;
