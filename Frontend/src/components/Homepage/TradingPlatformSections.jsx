import BinanceLogo from "./Logos/BinanceLogo";
import BybitLogo from "./Logos/BybitLogo";
import TradingView from "./Logos/TradingView";
import XtbLogo from "./Logos/XtbLogo";

const TradingPlatformsSection = () => {
  return (
    <section className="px-6 py-8 bg-slate-900">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-wrap items-center justify-center gap-12 md:gap-16">
          <a href="https://www.binance.com" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 opacity-80 hover:opacity-100 transition-opacity cursor-pointer">
            <BinanceLogo />
          </a>
          <a href="https://www.bybit.com" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 opacity-80 hover:opacity-100 transition-opacity cursor-pointer">
            <BybitLogo />
          </a>
          <a href="https://www.tradingview.com" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 opacity-80 hover:opacity-100 transition-opacity cursor-pointer">
            <TradingView />
          </a>
          <a href="http://xtb.pl" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 opacity-80 hover:opacity-100 transition-opacity cursor-pointer">
            <XtbLogo />
          </a>
        </div>
      </div>
    </section>
  );
};

export default TradingPlatformsSection;