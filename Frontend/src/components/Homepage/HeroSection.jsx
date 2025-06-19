import { ArrowRight } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative px-6 py-24 overflow-hidden bg-gradient-to-tr from-gray-900 via-gray-600 to-gray-300 text-white">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center">
          <h2 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-gray-200 to-gray-100 bg-clip-text text-transparent drop-shadow-2xl animate-pulse">
            Monitoruj Swój Portfel
          </h2>
          <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto drop-shadow-lg animate-fade animate-once animate-ease-linear">
            Profesjonalne narzędzie do śledzenia transakcji finansowych i
            zarządzania portfelem inwestycyjnym. Bezpiecznie i przejrzyście.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="group px-8 py-4 bg-gradient-to-r from-white to-gray-100 text-gray-900 rounded-lg hover:from-gray-100 hover:to-gray-200 transition-all transform hover:scale-105 shadow-2xl flex items-center space-x-2 animate-fade-right animate-ease-in">
              <span className="text-lg font-semibold">
                Rozpocznij Monitoring
              </span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-8 py-4 border-2 border-white/70 text-white rounded-lg hover:bg-white/10 backdrop-blur-sm transition-all animate-fade-left animate-ease-in">
              <span className="text-lg font-semibold">
                Dowiedz się więcej
              </span>
            </button>
          </div>
        </div>
      </div>
      <div className="absolute top-20 left-10 w-32 h-32 bg-white/5 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 right-10 w-48 h-48 bg-white/5 rounded-full blur-xl"></div>
    </section>
  );
};

export default HeroSection;