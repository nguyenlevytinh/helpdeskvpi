import axios from "axios";
const BASE_URL = import.meta.env.PUBLIC_API_URL;
const axiosInstance = axios.create({
  baseURL: BASE_URL, 
  headers: { "Content-Type": "application/json" },
});

// interceptor tự động refresh token
axiosInstance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("refreshToken");

      if (refreshToken) {
        try {
          interface RefreshResponse {
            accessToken: string;
          }

          const res = await axios.post<RefreshResponse>(`${BASE_URL}/api/Auth/Refresh`, {
            refreshToken,
          });
          const newAccessToken = res.data.accessToken;

          localStorage.setItem("accessToken", newAccessToken);
          axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

          return axiosInstance(originalRequest);
        } catch (err) {
          console.error("Token refresh failed:", err);
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
        }
      }
    }
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
