// src/core/AppContext/action.ts
import {
  SET_USER,
  SET_TOKEN,
  SET_REFRESH_TOKEN,
  SET_LOADING,
  SET_STATUS,
  SET_PAGE_TITLE,
  SET_SIDE_MENU,
} from './constant.ts';
import { LOGOUT } from './reducer';
import type { IUser, Role, IFeature } from './type';

// ===== MENU CONFIG =====
const menuByRole: Record<Role, IFeature[]> = {
  admin: [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Tickets', path: '/tickets' },
    { label: 'Users', path: '/users' },
    { label: 'Settings', path: '/settings' },
  ],
  agent: [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Assigned Tickets', path: '/tickets/assigned' },
  ],
  user: [
    { label: 'My Tickets', path: '/my-tickets' },
    { label: 'Create Ticket', path: '/tickets/new' },
  ],
};

// ===== ACTION HANDLERS =====
const action = {
  // ---- AUTH ----
  setUser: (user: IUser | null, dispatch: React.Dispatch<any>) => {
    dispatch({ type: SET_USER, payload: user });

    // Nếu có user hợp lệ -> sinh side menu tự động
    if (user && user.role) {
      const sideMenu = menuByRole[user.role] || [];
      dispatch({ type: SET_SIDE_MENU, payload: sideMenu });
    } else {
      dispatch({ type: SET_SIDE_MENU, payload: [] });
    }
  },

  setToken: (token: string | null, dispatch: React.Dispatch<any>) =>
    dispatch({ type: SET_TOKEN, payload: token }),

  setRefreshToken: (refreshToken: string | null, dispatch: React.Dispatch<any>) =>
    dispatch({ type: SET_REFRESH_TOKEN, payload: refreshToken }),

  logout: (dispatch: React.Dispatch<any>) =>
    dispatch({ type: LOGOUT }),

  // ---- UI ----
  setLoading: (loading: boolean, dispatch: React.Dispatch<any>) =>
    dispatch({ type: SET_LOADING, payload: loading }),

  setStatus: (status: string, dispatch: React.Dispatch<any>) =>
    dispatch({ type: SET_STATUS, payload: status }),

  setPageTitle: (pageTitle: string, dispatch: React.Dispatch<any>) =>
    dispatch({ type: SET_PAGE_TITLE, payload: pageTitle }),

  // (Không cần setSideMenu thủ công nữa vì đã tự động khi setUser)
};

export default action;
