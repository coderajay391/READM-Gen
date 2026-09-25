'use client';

import { useCallback, useEffect, useSyncExternalStore } from 'react';

const THEME_KEY = 'markdown-studio-theme';
const themeListeners = new Set<() => void>();

function notifyThemeChange() {
  themeListeners.forEach((listener) => listener());
}

export function setThemeInStorage(isDark: boolean) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light');
    notifyThemeChange();
  }
}

export function toggleThemeInStorage(): boolean {
  if (typeof window === 'undefined') return false;
  const current = getThemeSnapshot();
  const next = !current;
  setThemeInStorage(next);
  return next;
}

function getThemeSnapshot(): boolean {
  if (typeof window === 'undefined') return false;
  const saved = localStorage.getItem(THEME_KEY);
  if (saved) return saved === 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function getServerThemeSnapshot(): boolean {
  return false;
}

export function useTheme(): [boolean, () => void] {
  const subscribe = useCallback((callback: () => void) => {
    themeListeners.add(callback);
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    mql.addEventListener('change', callback);
    window.addEventListener('storage', callback);

    return () => {
      themeListeners.delete(callback);
      mql.removeEventListener('change', callback);
      window.removeEventListener('storage', callback);
    };
  }, []);

  const isDark = useSyncExternalStore(
    subscribe,
    getThemeSnapshot,
    getServerThemeSnapshot
  );

  // Synchronize document dark class to external DOM
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = useCallback(() => {
    toggleThemeInStorage();
  }, []);

  return [isDark, toggleTheme];
}
