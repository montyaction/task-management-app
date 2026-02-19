import { create } from "zustand";
import apiClient from "../lib/apiClient";
import { useUIStore } from "./uiStore";

// Helper function to get initial data from localStorage (Lazy Initialization)
const getInitialAuthState = () => {
  try {
    const storedToken = localStorage.getItem("token") || null;
    const userJSON = localStorage.getItem("user");
    const storedUser = userJSON ? JSON.parse(userJSON) : null;

    if (storedToken && storedUser) {
      apiClient.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
      return { storedToken, storedUser };
    }
  } catch {
    localStorage.clear();
  }
  return { storedToken: null, storedUser: null };
};

const persistSession = (token, user) => {
  if (token && user) {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    return;
  }

  localStorage.removeItem("token");
  localStorage.removeItem("user");
  delete apiClient.defaults.headers.common["Authorization"];
};

const initialAuth = getInitialAuthState();

export const useAuthStore = create((set, get) => ({
  token: initialAuth.storedToken,
  user: initialAuth.storedUser,
  isLoading: false,

  register: async (credentials) => {
    set({ isLoading: true });
    try {
      const { data } = await apiClient.post("/api/auth/register", credentials);
      const { token, user } = data;

      persistSession(token, user);
      set({ token, user, isLoading: false });
      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      return { success: false, error: error.response?.data?.message || "Registration failed" };
    }
  },

  login: async (credentials) => {
    set({ isLoading: true });
    try {
      const { data } = await apiClient.post("/api/auth/login", credentials);
      const { token, user } = data;

      persistSession(token, user);
      set({ token, user, isLoading: false });
      return { success: true };
    } catch (error) {
      persistSession(null, null);
      set({ token: null, user: null, isLoading: false });
      return { success: false, error: error.response?.data?.message || "Login failed" };
    }
  },

  fetchProfile: async () => {
    if (!get().token) return { success: false, error: "Not authenticated" };

    set({ isLoading: true });
    try {
      const { data } = await apiClient.get("/api/auth/profile");
      const nextUser = data?.user ?? null;
      if (!nextUser) {
        set({ isLoading: false });
        return { success: false, error: "Invalid profile response" };
      }
      const currentToken = get().token;

      persistSession(currentToken, nextUser);
      set({ user: nextUser, isLoading: false });
      return { success: true, user: nextUser };
    } catch (error) {
      set({ isLoading: false });
      return { success: false, error: error.response?.data?.message || "Failed to fetch profile" };
    }
  },

  updateProfile: async (payload) => {
    if (!get().token) return { success: false, error: "Not authenticated" };

    set({ isLoading: true });
    try {
      const { data } = await apiClient.put("/api/auth/profile", payload);
      const nextUser = data?.user ?? null;
      if (!nextUser) {
        set({ isLoading: false });
        return { success: false, error: "Invalid profile response" };
      }
      const currentToken = get().token;

      persistSession(currentToken, nextUser);
      set({ user: nextUser, isLoading: false });
      return { success: true, user: nextUser };
    } catch (error) {
      set({ isLoading: false });
      return { success: false, error: error.response?.data?.message || "Failed to update profile" };
    }
  },

  logout: () => {
    persistSession(null, null);
    set({ token: null, user: null });
    useUIStore.getState().resetUI();
  }
}));
