import { create } from "zustand";
import apiClient from "../lib/apiClient";

// Base URL for backend boards API
const API_BASE_URL = '/api/boards';

export const useBoardStore = create((set) => ({
    boards: [],
    currentBoard: null,
    loading: false,
    error: null,

    fetchBoards: async () => {
        set({ loading: true, error: null });
        try {
            const response = await apiClient.get("/api/boards");
            set({ boards: response.data, loading: false });
        } catch (error) {
            console.error("Failed to fetch boards:", error);
            set({ error: error.response?.data?.message || "Failed to load boards", loading: false })
        }
    },

    createBoard: async (boardData) => {
        set({ loading: true, error: null });
        try {
            const response = await apiClient.post(API_BASE_URL, boardData);
            set((state) => ({ boards: [...state.boards, response.data], loading: false }));
            return { success: true };
        } catch (error) {
            console.error("Failed to create board:", error);
            set({ error: error.response?.data?.message || "Failed to create board", loading: false })
            return { success: false, error: error.response?.data?.message || "Failed to create board" };
        }
    },

    updateBoard: async (id, updates) => {
        set({ loading: true, error: null });
        try {
            const response = await apiClient.put(`${API_BASE_URL}/${id}`, updates);
            set((state) => ({
                boards: state.boards.map((b) => (b._id === id ? response.data : b)),
            }));
            return { success: true };
        } catch (error) {
            console.error("Failed to update board:", error);
            set({ error: error.response?.data?.message || "Failed to update board", loading: false });
            return { success: false, error: error.response?.data?.message || "Failed to update board" };
        }
    },

    deleteBoard: async (id) => {
        set({ loading: true, error: null });
        try {
            await apiClient.delete(`${API_BASE_URL}/${id}`);
            set((state) => ({
                boards: state.boards.filter((b) => b._id !== id)
            }));
            return { success: true };
        } catch (error) {
            console.log("Failed to delete board:", error);
            set({ error: error.response?.data?.message || "Failed to delete board", loading: false });
            return { success: false, error: error.response?.data?.message || 'Failed to delete board' };
        }
    },

}));