function Footer() {
  return (
<footer className="px-6 py-12 bg-white/90 backdrop-blur-sm border-t border-gray-300">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <svg width="32" height="32" viewBox="0 0 48 48" className="text-gray-700">
                <defs>
                  <linearGradient id="currencyGradientFooter" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#374151" />
                    <stop offset="50%" stopColor="#4B5563" />
                    <stop offset="100%" stopColor="#6B7280" />
                  </linearGradient>
                </defs>
                <path d="M16 12c-6 0-10 4-10 12s4 12 10 12c3 0 5.5-1 7.5-3" 
                      stroke="url(#currencyGradientFooter)" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
                <line x1="8" y1="20" x2="20" y2="20" stroke="url(#currencyGradientFooter)" strokeWidth="2" strokeLinecap="round"/>
                <line x1="8" y1="28" x2="20" y2="28" stroke="url(#currencyGradientFooter)" strokeWidth="2" strokeLinecap="round"/>
                <path d="M32 8c-4 0-7 2-7 6 0 3 2 5 6 6l4 1c3 1 5 3 5 6 0 4-3 7-8 7-3 0-5-1-6-3" 
                      stroke="url(#currencyGradientFooter)" strokeWidth="2.3" fill="none" strokeLinecap="round"/>
                <line x1="32" y1="6" x2="32" y2="12" stroke="url(#currencyGradientFooter)" strokeWidth="2.3" strokeLinecap="round"/>
                <line x1="32" y1="36" x2="32" y2="42" stroke="url(#currencyGradientFooter)" strokeWidth="2.3" strokeLinecap="round"/>
                <path d="M24 18c2 2 4 4 6 6" stroke="url(#currencyGradientFooter)" strokeWidth="1.2" 
                      fill="none" strokeLinecap="round" opacity="0.6" strokeDasharray="2,2"/>
              </svg>
              <div>
                <h4 className="font-bold text-gray-700">FinancialTransactionsMonitor</h4>
                <p className="text-xs text-gray-500">© 2025 Wszystkie prawa zastrzeżone</p>
              </div>
            </div>
            <div className="flex space-x-6 text-gray-500">
              <a href="#" className="hover:text-gray-700 transition-colors">Polityka Prywatności</a>
              <a href="#" className="hover:text-gray-700 transition-colors">Regulamin</a>
              <a href="#" className="hover:text-gray-700 transition-colors">Kontakt</a>
            </div>
          </div>
        </div>
      </footer>
  )
}

export default Footer
