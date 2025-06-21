import { useIntersectionObserver } from "../../hooks/useIntersectionObserver.js";
import HomepageFeatures from "./HomepageFeatures.jsx";

const Features = () => {
  const [headerRef, headerVisible] = useIntersectionObserver();
  const [gridRef, gridVisible] = useIntersectionObserver();

  return (
    <section id="features" className="px-6 py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div
          ref={headerRef}
          className={`text-center mb-12 transition-all duration-1000 ${
            headerVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          <h3 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
            Profesjonalne Narzędzia
          </h3>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Zaawansowane funkcje do efektywnego monitorowania portfela
            inwestycyjnego.
          </p>
        </div>

        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {HomepageFeatures.map((feature, index) => (
            <div
              key={index}
              className={`group transition-all duration-700 ${
                gridVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
              style={{
                transitionDelay: gridVisible ? `${index * 100}ms` : "0ms",
              }}
            >
              <div className="h-full p-6 bg-white rounded-xl border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md transition-all duration-300 hover:transform hover:scale-105">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg text-gray-700 group-hover:from-gray-200 group-hover:to-gray-300 transition-all duration-300">
                    {feature.icon}
                  </div>
                </div>
                <h4 className="text-lg font-bold mb-3 text-gray-800 text-center group-hover:text-gray-900 transition-colors">
                  {feature.title}
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed text-center group-hover:text-gray-700 transition-colors">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
