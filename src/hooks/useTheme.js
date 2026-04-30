import { useState, useEffect } from 'react';

export const useTheme = () => {
  const [theme, setTheme] = useState(
    () => localStorage.getItem('theme') || 'light-theme'
  );

  useEffect(() => {
    document.documentElement.className = theme;

    const meta = document.getElementById('color-scheme-meta');
    if (meta) {
      meta.content = theme === 'dark-theme' ? 'dark' : 'light';
    }
  }, [theme]);

  const changeTheme = (newTheme) => {
    localStorage.setItem('theme', newTheme);
    setTheme(newTheme);
  };

  return { theme, changeTheme };
};
