import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axiosInstance from "../api/axiosInstance";

export interface UserInfo {
  id: number;
  email: string;
  fullName: string;
  role: string;
  department?: string;
}

interface AuthContextType {
  user: UserInfo | null;
  accessToken: string | null;
  refreshToken: string | null;
  login: (email: string) => Promise<boolean>;
  logout: () => void;
  setUser: React.Dispatch<React.SetStateAction<UserInfo | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(
    localStorage.getItem("accessToken")
  );
  const [refreshToken, setRefreshToken] = useState<string | null>(
    localStorage.getItem("refreshToken")
  );

  // Gọi API /api/Auth/Me khi có access token
  useEffect(() => {
    if (accessToken) {
      axiosInstance
        .get("/api/Auth/Me")
        .then((res) => setUser(res.data as UserInfo))
        .catch(() => logout());
    }
  }, [accessToken]);

  interface LoginResponse {
    accessToken: string;
    refreshToken: string;
  }

  const login = async (email: string) => {
    try {
      const res = await axiosInstance.post<LoginResponse>("/api/Auth/Login", { email });
      const { accessToken, refreshToken } = res.data;

      setAccessToken(accessToken);
      setRefreshToken(refreshToken);

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      const me = await axiosInstance.get("/api/Auth/Me", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setUser(me.data as UserInfo);

      return true;
    } catch (err) {
      console.error("Login error:", err);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, refreshToken, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
