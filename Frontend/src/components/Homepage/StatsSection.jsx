import React, { useState, useEffect } from "react";

const StatsSection = () => {
  const [animatedNumbers, setAnimatedNumbers] = useState({
    users: 0,
    trades: 0,
    profit: 0,
  });

  useEffect(() => {
    const animateNumbers = () => {
      const targets = { users: 50000, trades: 2500000, profit: 15.7 };
      const duration = 2000;
      const steps = 60;
      const stepTime = duration / steps;

      let currentStep = 0;
      const interval = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;

        setAnimatedNumbers({
          users: Math.floor(targets.users * progress),
          trades: Math.floor(targets.trades * progress),
          profit: (targets.profit * progress).toFixed(1),
        });

        if (currentStep >= steps) {
          clearInterval(interval);
        }
      }, stepTime);

      return () => clearInterval(interval);
    };

    animateNumbers();
  }, []);

  return (
    <section className="px-6 py-16 bg-white/70 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-gray-700 mb-2">
              {animatedNumbers.users.toLocaleString()}+
            </div>
            <div className="text-gray-600">Zarządzanych Portfeli</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
              {animatedNumbers.trades.toLocaleString()}+
            </div>
            <div className="text-gray-600">Śledzonych Transakcji</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
              99.9%
            </div>
            <div className="text-gray-600">Bezpieczeństwo Danych</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
