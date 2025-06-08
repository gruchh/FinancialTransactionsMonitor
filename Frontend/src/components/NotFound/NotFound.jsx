import { Home, ArrowLeft, Search } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center transform hover:scale-105 transition-transform duration-300">
        <div className="mb-6">
          <div className="text-8xl font-bold text-gray-600 mb-4">
            404
          </div>
          <div className="w-24 h-1 bg-gradient-to-r from-gray-500 to-gray-700 mx-auto rounded-full"></div>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Strona nie została znaleziona
        </h1>
        
        <p className="text-gray-600 mb-8 leading-relaxed">
          Ups! Wygląda na to, że strona której szukasz nie istnieje lub została przeniesiona.
        </p>
        
        <div className="space-y-4">
          <a 
            href="/" 
            className="w-full bg-gradient-to-r from-gray-600 to-gray-800 text-white py-3 px-6 rounded-lg font-semibold flex items-center justify-center gap-2 hover:from-gray-700 hover:to-gray-900 transition-all duration-300 transform hover:scale-105 shadow-lg inline-flex"
          >
            <Home size={20} />
            Powrót do strony głównej
          </a>
          
          <button 
            onClick={() => window.history.back()} 
            className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-gray-200 transition-all duration-300 border border-gray-300"
          >
            <ArrowLeft size={20} />
            Cofnij się
          </button>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
            <Search size={16} />
            <span>Błąd 404 - Strona nie znaleziona</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;