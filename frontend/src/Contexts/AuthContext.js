import { createContext } from "react";

export const AuthContext = createContext({
  user: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  isAuthenticated: false,
  hasNewActivity: false,
  setHasNewActivity: () => {},
  fetchUser: async () => {},
});
