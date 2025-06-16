import { ArrowRight, Shield, Zap } from "lucide-react";

const CTASection = () => {
  return (
    <section className="px-6 py-24 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600 text-white">
      <div className="max-w-4xl mx-auto text-center">
        <div className="flex justify-center mb-6">
          <div className="flex items-center space-x-4">
            <Shield className="w-12 h-12 text-gray-300" />
            <Zap className="w-12 h-12 text-gray-200" />
          </div>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
          Zacznij Zarządzać Swoim Portfelem Już Dziś
        </h2>
        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Dołącz do tysięcy użytkowników, którzy już zarządzają swoimi 
          inwestycjami z naszym zaawansowanym systemem monitoringu.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button className="group px-8 py-4 bg-gradient-to-r from-white to-gray-100 text-gray-900 rounded-lg hover:from-gray-100 hover:to-gray-200 transition-all transform hover:scale-105 shadow-2xl flex items-center space-x-2">
            <span className="text-lg font-semibold">
              Rejestracja
            </span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button className="px-8 py-4 border-2 border-white/50 text-white rounded-lg hover:bg-white/10 backdrop-blur-sm transition-all">
            <span className="text-lg font-semibold">
              Logowanie
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;