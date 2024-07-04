// lib/useLocalStorage.js
import { useState, useEffect } from 'react';

export const useLocalStorage = (key: any, initialValue: any, prefix = '') => {
  const prefixedKey = prefix ? `${prefix}_${key}` : key;

  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(prefixedKey);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(prefixedKey, JSON.stringify(storedValue));
    } catch (error) {
      console.error(error);
    }
  }, [prefixedKey, storedValue]);

  const exportData = () => {
    const data:any = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(prefix)) {
        data[key] = JSON.parse(localStorage.getItem(key) ?? '{}');
      }
    }
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${prefix}_export.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = (jsonData:any) => {
    try {
      const data = JSON.parse(jsonData);
      Object.keys(data).forEach(key => {
        if (key.startsWith(prefix)) {
          localStorage.setItem(key, JSON.stringify(data[key]));
        }
      });
      setStoredValue(data[prefixedKey]);
      return true;
    } catch (error) {
      console.error('Errore durante l\'importazione dei dati:', error);
      return false;
    }
  };

  return [storedValue, setStoredValue, exportData, importData];
};