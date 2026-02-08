import { useState, useEffect } from 'react';

export const useStorage = (key, initialValue) => {
  const [state, setState] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        const parsed = JSON.parse(item);
        // Ensure all required arrays exist
        return {
          products: parsed.products || [],
          orders: parsed.orders || [],
          customers: parsed.customers || [],
          reviews: parsed.reviews || [],
          coupons: parsed.coupons || [],
          ...parsed
        };
      }
      return initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch (error) {
      console.error(`Error saving to localStorage key "${key}":`, error);
    }
  }, [key, state]);

  return [state, setState];
};