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
    } catch (error) {
        // Agar parsing main error aaye to local storage clear kar dein
        localStorage.clear();
    }
    return { storedToken: null, storedUser: null };
};

export const useAuthStore = create((set) => ({
    // 1. Initial State (Lazy Initialization yahan ho rahi hai)
    token: getInitialAuthState().storedToken,
    user: getInitialAuthState().storedUser,
    isLoading: false,

    // 2. Actions (Functions)
    register: async (credentials) => {
        set({ isLoading: true });
        try {
            // Register API endpoint ko call karein
            const { data } = await apiClient.post("/api/auth/register", credentials);
            const { token, user } = data;

            // LocalStorage aur API headers set karein (auto-login)
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));
            apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;

            // State update karein
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

            // LocalStorage aur API headers set karna
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));
            apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;

            // State update karna
            set({ token, user, isLoading: false });
            return { success: true };
        } catch (error) {
            // Failure par sab kuch clear kar dena
            localStorage.clear();
            delete apiClient.defaults.headers.common["Authorization"];
            set({ token: null, user: null, isLoading: false });
            return { success: false, error: error.response?.data?.message || "Login failed" };
        }
    },

    logout: () => {
        // LocalStorage aur API headers clear karna
        localStorage.clear();
        delete apiClient.defaults.headers.common["Authorization"];

        // State clear karna
        set({ token: null, user: null });
        useUIStore.getState().resetUI();    // auto-reset UI
      },
}));