import { useState, useEffect } from 'react';

const getCookie = (name: string): string | undefined => {
  if (typeof document === 'undefined') {
    return undefined;
  }
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift();
  }
  return undefined;
};

const setCookie = (name: string, value: string, days: number): void => {
  if (typeof document === 'undefined') {
    return;
  }
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  document.cookie = `${name}=${value}; expires=${date.toUTCString()}; path=/`;
};

export const useCookie = (key: string, defaultValue: string): [string, (value: string) => void] => {
  const [value, setValue] = useState<string>(() => {
    const cookie = getCookie(key);
    return cookie === undefined ? defaultValue : cookie;
  });

  useEffect(() => {
    setCookie(key, value, 7);
  }, [key, value]);

  return [value, setValue];
};
