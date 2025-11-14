import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
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
  loadingUser: boolean; 
  login: (email: string) => Promise<boolean>;
  logout: () => void;
  setUser: React.Dispatch<React.SetStateAction<UserInfo | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserInfo | null>(null);

  const [loadingUser, setLoadingUser] = useState(true); 

  // -----------------------------------------------------------------------
  // STEP 1: Load token từ localStorage, rồi fetch user
  // -----------------------------------------------------------------------
  useEffect(() => {
    const at = localStorage.getItem("accessToken");
    const rt = localStorage.getItem("refreshToken");

    if (at) {
      setAccessToken(at);
      axiosInstance.defaults.headers.common["Authorization"] = "Bearer " + at;
    }
    if (rt) setRefreshToken(rt);

    // Nếu có accessToken thì gọi /Me
    const loadUser = async () => {
      if (!at) {
        setLoadingUser(false);
        return;
      }

      try {
        const res = await axiosInstance.get("/api/Auth/Me");
        setUser(res.data as any);
      } catch (err) {
        console.warn("Token expired hoặc lỗi /Me:", err);
        setUser(null);
      } finally {
        setLoadingUser(false);
      }
    };

    loadUser();
  }, []);

  // -----------------------------------------------------------------------
  // STEP 2: Login
  // -----------------------------------------------------------------------
  const login = async (email: string): Promise<boolean> => {
    try {
      const res = await axiosInstance.post<{ accessToken: string; refreshToken: string }>("/api/Auth/Login", { email });
      const { accessToken, refreshToken } = res.data;

      // Save
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      axiosInstance.defaults.headers.common["Authorization"] =
        "Bearer " + accessToken;

      // Load user
      const meRes = await axiosInstance.get("/api/Auth/Me");
      setUser(meRes.data as any);

      return true;
    } catch (err) {
      console.error("Login error:", err);
      return false;
    }
  };

  // -----------------------------------------------------------------------
  // STEP 3: Logout
  // -----------------------------------------------------------------------
  const logout = () => {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  };

  // -----------------------------------------------------------------------
  // STEP 4: Refresh token logic
  // -----------------------------------------------------------------------
  const refreshAccessToken = async () => {
    try {
      if (!refreshToken) throw new Error("Missing refresh token");

      const res = await axiosInstance.post("/api/Auth/Refresh", {
        refreshToken,
      });

      const newAccessToken = (res.data as any).accessToken;

      setAccessToken(newAccessToken);
      localStorage.setItem("accessToken", newAccessToken);

      axiosInstance.defaults.headers.common["Authorization"] =
        "Bearer " + newAccessToken;

      return newAccessToken;
    } catch (err) {
      console.error("Refresh token failed:", err);
      logout();
      return null;
    }
  };

  // -----------------------------------------------------------------------
  // STEP 5: Axios interceptor
  // -----------------------------------------------------------------------
  useEffect(() => {
    const interceptor = axiosInstance.interceptors.response.use(
      (res) => res,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          const newToken = await refreshAccessToken();
          if (newToken) {
            originalRequest.headers["Authorization"] = "Bearer " + newToken;
            return axiosInstance(originalRequest);
          }
        }

        return Promise.reject(error);
      }
    );

    return () => axiosInstance.interceptors.response.eject(interceptor);
  }, [refreshToken]);

  return (
    <AuthContext.Provider
      value={{ user, accessToken, refreshToken, loadingUser, login, logout, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
