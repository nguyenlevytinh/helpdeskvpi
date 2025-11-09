import {
  createContext,
  useContext,
  useEffect,
  useReducer,
} from 'react';
import type { FC, PropsWithChildren } from 'react';
import axios from 'axios';
import { defaultStore, initialState } from './type';
import type { AppStore, Role } from './type';
import reducer from './reducer';
import action from './action';

type Props = PropsWithChildren;

// Context khởi tạo
export const AppContext = createContext<AppStore>(defaultStore);

export const AppProvider: FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // ==== Map các hàm hành động ====
  const store: AppStore = {
    state,
    // Auth
    setUser: (user) => action.setUser(user, dispatch),
    setToken: (token) => {
      action.setToken(token, dispatch);
      if (token) localStorage.setItem('token', token);
      else localStorage.removeItem('token');
    },
    setRefreshToken: (refreshToken) => {
      action.setRefreshToken(refreshToken, dispatch);
      if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
      else localStorage.removeItem('refreshToken');
    },
    logout: () => {
      action.logout(dispatch);
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
    },

    // UI
    setLoading: (loading) => action.setLoading(loading, dispatch),
    setStatus: (status) => action.setStatus(status, dispatch),
    setPageTitle: (title) => action.setPageTitle(title, dispatch),
    setSideMenu: () => {}, // không cần, auto khi setUser
  };

  // ==== Auto-login khi có token ====
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    store.setToken(token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    const fetchUser = async () => {
      try {
        const res = await axios.get('/api/User/me');
        type UserResponse = { userId: string; email: string; role: string };
        const { userId, email, role: roleString } = res.data as UserResponse;
        store.setUser({
          id: userId,
          email,
          fullName: '', // có thể cập nhật thêm nếu API trả về
          role: roleString as Role, // Ensure roleString is cast to Role
        });
      } catch {
        store.logout();
      }
    };

    fetchUser();
  }, []);

  // ==== Auto-refresh token định kỳ ====
  useEffect(() => {
    const refreshInterval = setInterval(async () => {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) return;

      try {
        const res = await axios.post('/api/User/refresh-token');
        type RefreshTokenResponse = { token: string };
        const { token: newToken } = res.data as RefreshTokenResponse;
        store.setToken(newToken);
        axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      } catch {
        store.logout();
      }
    }, 25 * 60 * 1000); // refresh mỗi 25 phút (token 30p hết hạn)

    return () => clearInterval(refreshInterval);
  }, []);

  return (
    <AppContext.Provider value={store}>
      {children}
    </AppContext.Provider>
  );
};

// Hook tiện dùng
export const useAppContext = () => useContext(AppContext);
