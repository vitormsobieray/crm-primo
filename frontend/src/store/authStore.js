import { create } from "zustand";

const userJson = localStorage.getItem("crm_user");
const token = localStorage.getItem("crm_token");

export const useAuthStore = create((set) => ({
  token: token || "",
  user: userJson ? JSON.parse(userJson) : null,
  isAuthenticated: Boolean(token),
  setAuth: ({ token: newToken, user }) => {
    localStorage.setItem("crm_token", newToken);
    localStorage.setItem("crm_user", JSON.stringify(user));
    set({ token: newToken, user, isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem("crm_token");
    localStorage.removeItem("crm_user");
    set({ token: "", user: null, isAuthenticated: false });
  },
}));
