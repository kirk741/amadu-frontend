import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [role, setRole] = useState(localStorage.getItem('role'));
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light-theme');

  useEffect(() => {
    document.documentElement.className = theme;

    const meta = document.getElementById('color-scheme-meta');
    if (meta) {
      meta.content = theme === 'dark-theme' ? 'dark' : 'light';
    }
  }, [theme]);

  const updateAuth = (newRole, newTheme) => {
    setRole(newRole);
    setTheme(newTheme);
  };

  const changeTheme = (newTheme) => {
    localStorage.setItem('theme', newTheme);
    setTheme(newTheme);
  };

  const logout = () => {
    localStorage.clear();
    setRole(null);
    setTheme('light-theme');
  };

  return (
    <AuthContext.Provider value={{ role, theme, updateAuth, logout, changeTheme }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => useContext(AuthContext);
