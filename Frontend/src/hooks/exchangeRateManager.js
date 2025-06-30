import { useState, useEffect } from 'react';

export const ExchangeRateManager = ({ 
  onRatesUpdate, 
  initialRates = { eurPln: null, usdPln: null, lastUpdated: null } 
}) => {
  const [exchangeRates, setExchangeRates] = useState(initialRates);
  const [ratesLoading, setRatesLoading] = useState(false);

  const fetchExchangeRates = async () => {
    try {
      setRatesLoading(true);
      const response = await fetch('https://cdn.kurs-walut.info/api/latest.json');
      const data = await response.json();
      
      if (data.rates) {
        const eurPln = data.rates.PLN / data.rates.EUR;
        const usdPln = data.rates.PLN / data.rates.USD;
        
        const newRates = {
          eurPln: eurPln.toFixed(4),
          usdPln: usdPln.toFixed(4),
          lastUpdated: new Date(data.lastupdate).toLocaleString()
        };
        
        setExchangeRates(newRates);
        
        if (onRatesUpdate) {
          onRatesUpdate(newRates);
        }
        
      }
    } catch (error) {
      console.error('Error fetching exchange rates:', error);
    } finally {
      setRatesLoading(false);
    }
  };

  useEffect(() => {
    fetchExchangeRates();
  }, []);

  return {
    exchangeRates,
    ratesLoading,
    fetchExchangeRates,
    refreshRates: fetchExchangeRates
  };
};