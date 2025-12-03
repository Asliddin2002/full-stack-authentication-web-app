import { createContext, useEffect, useState, type ReactNode } from "react";

type info = {
  age: number;
  fullName: string;
  educationDegree: string;
};

export interface User {
  id: string;
  email: string;
  info: info;
  isVerified: boolean;
}

type AuthContext = {
  isAuthenticated: boolean;
  handleSetToken: (token: string | undefined) => void;
  user: User | null;
};

const decode = (jwt: string) => {
  const payload = jwt.split(".")[1];
  const base64payload = payload.replace("-", "+").replace("_", "/");

  return JSON.parse(decodeURIComponent(atob(base64payload)));
};

export const AuthContext = createContext<AuthContext | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState(() => localStorage.getItem("accessToken"));
  const [user, setUser] = useState<User | null>(null);

  const handleSetToken = (token: string | undefined) => {
    if (token) {
      setToken(token);
    } else {
      localStorage.clear();
      setToken("");
    }
  };

  useEffect(() => {
    if (token) {
      try {
        const decoded = decode(token);
        setUser(decoded);
      } catch (error: unknown) {
        alert("Something Went wrong!");
      }
    }
  }, [token]);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated: !!token, handleSetToken, user }}
    >
      {children}
    </AuthContext.Provider>
  );
};
