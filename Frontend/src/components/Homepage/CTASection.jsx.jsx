import { ArrowRight, Shield, Zap } from "lucide-react";
import { useIntersectionObserver } from "../../hooks/index.js";

const CTASection = () => {
  const [iconsRef, iconsVisible] = useIntersectionObserver();
  const [headerRef, headerVisible] = useIntersectionObserver();
  const [textRef, textVisible] = useIntersectionObserver();
  const [buttonsRef, buttonsVisible] = useIntersectionObserver();

  return (
    <section className="px-6 py-24 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600 text-white">
      <div className="max-w-4xl mx-auto text-center">
        <div
          ref={iconsRef}
          className={`flex justify-center mb-6 transition-all duration-1000 ${
            iconsVisible
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 translate-y-8 scale-75"
          }`}
        >
          <div className="flex items-center space-x-4">
            <div
              className={`transition-all duration-700 ${
                iconsVisible ? "rotate-0" : "rotate-45"
              }`}
            >
              <Shield className="w-12 h-12 text-gray-300 hover:text-white transition-colors duration-300" />
            </div>
            <div
              className={`transition-all duration-700 delay-200 ${
                iconsVisible ? "rotate-0" : "-rotate-45"
              }`}
            >
              <Zap className="w-12 h-12 text-gray-200 hover:text-white transition-colors duration-300" />
            </div>
          </div>
        </div>
        <div
          ref={headerRef}
          className={`transition-all duration-1000 delay-300 ${
            headerVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Zacznij Zarządzać Swoim Portfelem Już Dziś
          </h2>
        </div>
        <div
          ref={textRef}
          className={`transition-all duration-1000 delay-500 ${
            textVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Dołącz do tysięcy użytkowników, którzy już zarządzają swoimi
            inwestycjami z naszym zaawansowanym systemem monitoringu.
          </p>
        </div>
        <div
          ref={buttonsRef}
          className={`flex flex-col sm:flex-row gap-4 justify-center items-center transition-all duration-1000 delay-700 ${
            buttonsVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          <button
            className={`group px-8 py-4 bg-gradient-to-r from-white to-gray-100 text-gray-900 rounded-lg hover:from-gray-100 hover:to-gray-200 transition-all transform hover:scale-105 shadow-2xl flex items-center space-x-2 duration-300 ${
              buttonsVisible ? "translate-x-0" : "-translate-x-4"
            }`}
          >
            <span className="text-lg font-semibold">Rejestracja</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
          <button
            className={`px-8 py-4 border-2 border-white/50 text-white rounded-lg hover:bg-white/10 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-white/70 ${
              buttonsVisible ? "translate-x-0" : "translate-x-4"
            }`}
          >
            <span className="text-lg font-semibold">Logowanie</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
