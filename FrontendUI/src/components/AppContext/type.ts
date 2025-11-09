// src/core/AppContext/type.ts
import type { JSX } from "react";
export type UUID = string;

export type Role = 'admin' | 'agent' | 'user';

export type IUser = {
  id: UUID;
  email: string;
  fullName: string;
  role: Role;
};

export type IFeature = {
  label: string;
  path: string;
  icon?: JSX.Element;
};

export type AppState = {
  // Auth
  user: IUser | null;
  token: string | null;
  refreshToken: string | null;

  // UI
  loading: boolean;
  status: string;
  pageTitle: string;
  sideMenu: IFeature[];
};

export const initialState: AppState = {
  user: null,
  token: null,
  refreshToken: null,
  loading: false,
  status: '',
  pageTitle: '',
  sideMenu: [],
};

export type AppStore = {
  state: AppState;

  // Auth
  setUser: (user: IUser | null) => void;
  setToken: (token: string | null) => void;
  setRefreshToken: (refreshToken: string | null) => void;
  logout: () => void;

  // UI
  setLoading: (loading: boolean) => void;
  setStatus: (status: string) => void;
  setPageTitle: (pageTitle: string) => void;
  setSideMenu: (sideMenu: IFeature[]) => void;
};

export const defaultStore: AppStore = {
  state: initialState,

  setUser: () => {},
  setToken: () => {},
  setRefreshToken: () => {},
  logout: () => {},

  setLoading: () => {},
  setStatus: () => {},
  setPageTitle: () => {},
  setSideMenu: () => {},
};
