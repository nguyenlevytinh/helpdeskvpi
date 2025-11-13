import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
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

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const navigate = useNavigate();

  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserInfo | null>(null);

  // Đánh dấu đã load từ localStorage xong chưa
  const [isInitialized, setIsInitialized] = useState(false);

  // -----------------------------------------------------------------------
  // STEP 1: Load token từ localStorage ngay từ lần mount đầu tiên
  // -----------------------------------------------------------------------
  useEffect(() => {
    const at = localStorage.getItem("accessToken");
    const rt = localStorage.getItem("refreshToken");

    if (at) {
      setAccessToken(at);
      axiosInstance.defaults.headers.common["Authorization"] = "Bearer " + at;
    }
    if (rt) setRefreshToken(rt);

    setIsInitialized(true);
  }, []);

  // -----------------------------------------------------------------------
  // STEP 2: Nếu đã init mà không có accessToken → Redirect về login
  // -----------------------------------------------------------------------
  useEffect(() => {
    if (!isInitialized) return;

    if (!accessToken) {
      if (window.location.pathname !== "/login") {
        navigate("/login");
      }
    }
  }, [isInitialized, accessToken, navigate]);

  // -----------------------------------------------------------------------
  // STEP 3: Load thông tin user khi accessToken thay đổi
  // -----------------------------------------------------------------------
  useEffect(() => {
    if (!isInitialized) return;
    if (!accessToken) return;

    axiosInstance
      .get("/api/Auth/Me")
      .then((res) => setUser(res.data as any))
      .catch((err) => {
        console.warn("Lỗi gọi /Me, giữ token nhưng user=null:", err);
      });
  }, [isInitialized, accessToken]);

  // -----------------------------------------------------------------------
  // STEP 4: Login
  // -----------------------------------------------------------------------
  const login = async (email: string): Promise<boolean> => {
    try {
      const res = await axiosInstance.post("/api/Auth/Login", { email });

      const { accessToken, refreshToken } = res.data as { accessToken: string; refreshToken: string };

      // Lưu state
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);

      // Lưu localStorage
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      // Set header mặc định
      axiosInstance.defaults.headers.common["Authorization"] =
        "Bearer " + accessToken;

      // Load user info
      const meRes = await axiosInstance.get("/api/Auth/Me");
      setUser(meRes.data as any);

      return true;
    } catch (err) {
      console.error("Login error:", err);
      return false;
    }
  };

  // -----------------------------------------------------------------------
  // STEP 5: Logout
  // -----------------------------------------------------------------------
  const logout = () => {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);

    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    navigate("/login");
  };

  // -----------------------------------------------------------------------
  // STEP 6: Refresh token
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
  // STEP 7: Axios response interceptor → Auto refresh token khi 401
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

  // -----------------------------------------------------------------------

  return (
    <AuthContext.Provider
      value={{ user, accessToken, refreshToken, login, logout, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook tiện dụng
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
