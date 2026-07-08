import { useState, useEffect } from "react";

export function getStoredJSON(key, fallback) {
  const stored = localStorage.getItem(key);
  if (!stored) return fallback;
  try {
    return JSON.parse(stored);
  } catch {
    return fallback;
  }
}

export function setStoredJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => getStoredJSON(key, initialValue));

  useEffect(() => {
    setStoredJSON(key, value);
  }, [key, value]);

  return [value, setValue];
}
