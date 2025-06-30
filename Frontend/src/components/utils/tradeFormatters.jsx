export const formatCurrency = (value, currency = 'PLN') => {
  if (!value) return 'N/A';
  return new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency,
  }).format(value);
};

export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('pl-PL');
};

export const getCurrencySymbol = (currencyType) => {
  switch (currencyType) {
    case 'EUR':
      return 'EUR';
    case 'USD':
      return 'USD';
    case 'PLN':
      return 'PLN';
    default:
      return 'PLN';
  }
};