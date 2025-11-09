import api from "./api";

// Hàm đăng nhập
export const login = async (email: string, setUserId: (id: string) => void, setUserRoles: (roles: string[]) => void, setLoading: (loading: boolean) => void) => {
  try {
    setLoading(true);
    interface LoginResponse {
      token: string;
    }

    const response = await api.post<LoginResponse>("/api/User/login", email);

    // Lưu token vào localStorage
    localStorage.setItem("token", response.data.token);

    // Giải mã token để lấy thông tin user
    const tokenPayload = JSON.parse(atob(response.data.token.split(".")[1]));
    setUserId(tokenPayload.nameid); // Claim NameIdentifier
    setUserRoles([tokenPayload.role]); // Claim Role
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  } finally {
    setLoading(false);
  }
};

// Hàm lấy thông tin user hiện tại
export const getCurrentUser = async (setUsers: (users: any[]) => void) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found");
    }

    const response = await api.get("/api/User/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Cập nhật thông tin user
    setUsers([response]);
  } catch (error) {
    console.error("Failed to fetch current user:", error);
    throw error;
  }
};

// Hàm cấp token mới
export const refreshToken = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found");
    }

    interface RefreshTokenResponse {
      token: string;
    }

    const response = await api.post<RefreshTokenResponse>("/api/User/refresh-token", null, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Lưu token mới vào localStorage
    localStorage.setItem("token", response.data.token);
  } catch (error) {
    console.error("Failed to refresh token:", error);
    throw error;
  }
};