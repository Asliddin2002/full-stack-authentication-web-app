import { createContext, useState, type ReactNode } from "react";

type AuthContext = {
  isAuthenticated: boolean;
  handleSetToken: (token: string | undefined) => void;
};

export const AuthContext = createContext<AuthContext | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState(() => localStorage.getItem("accessToken"));

  const handleSetToken = (token: string | undefined) => {
    if (token) {
      setToken(token);
    } else {
      localStorage.clear();
      setToken("");
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!token, handleSetToken }}>
      {children}
    </AuthContext.Provider>
  );
};
