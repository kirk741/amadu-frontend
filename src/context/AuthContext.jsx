import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [role, setRole] = useState(localStorage.getItem('role'));
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light-theme');

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const updateAuth = (newRole, newTheme) => {
    setRole(newRole);
    setTheme(newTheme);
  };

  const logout = () => {
    localStorage.clear();
    setRole(null);
    setTheme('light-theme');
  };

  return (
    <AuthContext.Provider value={{ role, theme, updateAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => useContext(AuthContext);