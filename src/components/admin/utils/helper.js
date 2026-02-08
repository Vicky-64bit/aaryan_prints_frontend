// Utility functions
export const uid = () => Math.floor(Math.random() * 1_000_000) + Date.now();

// Format currency
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(amount);
};

// Format date
export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Calculate total stock
export const calculateTotalStock = (stock) => {
  return Object.values(stock || {}).reduce((sum, current) => sum + (current || 0), 0);
};