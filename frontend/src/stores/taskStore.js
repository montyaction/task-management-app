import { create } from "zustand";
import apiClient from "../lib/apiClient";

// Base URL for your backend tasks API
const API_BASE_URL = '/api/tasks';

export const useTaskStore = create((set) => ({
    tasks: [],
    loading: false,
    error: null,

    // --- Actions ---

    // 1. Fetch tasks for the authenticated user
    fetchTasks: async () => {
        set({ loading: true, error: null });
        try {
            const response = await apiClient.get(API_BASE_URL);
            set({ tasks: response.data, loading: false });
        } catch (error) {
            console.error("Failed to fetch tasks:", error);
            set({ error: error.response?.data?.message || "Failed to load tasks", loading: false });
        }
    },

    // 2. Add a new task
    addTask: async (taskData) => {
        set({ loading: true, error: null });
        try {
            const response = await apiClient.post(API_BASE_URL, taskData);
            set((state) => ({ tasks: [...state.tasks, response.data], loading: false }));
            return { success: true };
        } catch (error) {
            console.error("Failed to add task:", error);
            set({ error: error.response?.data?.message || "Failed to add task", loading: false });
            return { success: false, error: error.response?.data?.message || "Failed to add task" };
        }
    },

    // 3. Update an existin task
    updateTask: async (id, updates) => {
        set({ loading: true, error: null });
        try {
            const response = await apiClient.put(`${API_BASE_URL}/${id}`, updates);
            set((state) => ({
                tasks: state.tasks.map((t) => (t._id === id ? response.data : t)),
                loading: false
            }));
            return { success: true };
        } catch (error) {
            console.error("Failed to update task:", error);
            set({ error: error.response?.data?.message || "Failed to update task", loading: false });
            return { success: false, error: error.response?.data?.message || 'Failed to update task' };
        }
    },

    // 4. Delete a task
    deleteTask: async (id) => {
        set({ loading: true, error: null });
        try {
            await apiClient.delete(`${API_BASE_URL}/${id}`);
            set((state) => ({
                tasks: state.tasks.filter((t) => t._id !== id),
                loading: false
            }));
            return { success: true };
        } catch (error) {
            console.error("Failed to delete task", error);
            set({ error: error.response?.data?.message || "Failed to delete task", loading: false });
            return { success: false, error: error.response?.data?.message || 'Failed to delete task' };
        }
    },

    // 5. Clear all tasks (e.g., on logout)
    clearTasks: () => set({ tasks: [], loading: false, error: null }),

    // 6. Persist reordered tasks to backend
    reorderTasksPersist: async (tasks) => {
        try {
            await apiClient.put(`${API_BASE_URL}/reorder/bulk`, { tasks });
        } catch (error) {
            console.error("Failed to persist task order", error);
        }
    },

}));
