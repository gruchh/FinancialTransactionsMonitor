import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  const handleRegister = () => {
    navigate("/register");
    console.log("Register clicked");
  };

  return (
    <nav className="relative z-50 px-6 py-4 bg-white/90 backdrop-blur-md border-b border-gray-300 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
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
          <div className="flex items-center space-x-4">
            <button className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors" onClick={handleLogin}>
              Zaloguj się
            </button>
            <button className="px-6 py-2 bg-gradient-to-r from-gray-700 to-gray-900 text-white rounded-lg hover:from-gray-800 hover:to-black transition-all transform hover:scale-105 shadow-lg" onClick={handleLogin}>
              Zarejestruj się
            </button>
          </div>
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
          <div className="flex flex-col space-y-4">
            <button
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors text-left"
              onClick={handleLogin}
            >
              Zaloguj się
            </button>
            <button
              className="px-6 py-2 bg-gradient-to-r from-gray-700 to-gray-900 text-white rounded-lg hover:from-gray-800 hover:to-black transition-all"
              nClick={handleRegister}
            >
              Zarejestruj się
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
