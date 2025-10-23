// src/store/uiStore.js
import { create } from "zustand";

export const useUIStore = create((set) => ({
    // 🔹 Madal state
    modals: {
        taskForm: false,
    },

    // 🔹Editing state
    editingTask: null,

    // ✅ Modal actions
    openModal: (modalKey = "taskForm") =>
        set((state) => ({
            modals: { ...state.modals, [modalKey]: true },
        })),

    closeModal: (modalKey = "taskForm") =>
        set((state) => ({
            modals: { ...state.modals, [modalKey]: false },
        })),

    // ✅ Editing actions
    setEditingTask: (task) => set({ editingTask: task }),
    clearEditingTask: () => set({ editingTask: null }),

    // ✅ Global UI helpers (optional)
    resetUI: () => set({
        modals: { taskForm: false },
        editingTask: null,
    }),
}));