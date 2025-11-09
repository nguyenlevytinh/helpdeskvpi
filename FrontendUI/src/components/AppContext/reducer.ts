// src/core/AppContext/reducer.ts
import {
  SET_USER,
  SET_TOKEN,
  SET_REFRESH_TOKEN,
  SET_LOADING,
  SET_STATUS,
  SET_PAGE_TITLE,
  SET_SIDE_MENU,
} from './constant.ts';
import type { AppState } from './type';

export const LOGOUT = 'LOGOUT';

export default function reducer(state: AppState, action: any): AppState {
  switch (action.type) {
    // ==== AUTH ====
    case SET_USER:
      return { ...state, user: action.payload };

    case SET_TOKEN:
      return { ...state, token: action.payload };

    case SET_REFRESH_TOKEN:
      return { ...state, refreshToken: action.payload };

    case LOGOUT:
      return {
        ...state,
        user: null,
        token: null,
        refreshToken: null,
        sideMenu: [],
      };

    // ==== UI ====
    case SET_LOADING:
      return { ...state, loading: action.payload };

    case SET_STATUS:
      return { ...state, status: action.payload };

    case SET_PAGE_TITLE:
      return { ...state, pageTitle: action.payload };

    case SET_SIDE_MENU:
      return { ...state, sideMenu: action.payload };

    default:
      return state;
  }
}
