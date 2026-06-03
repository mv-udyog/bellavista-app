import { create } from "zustand";

export const useNotificationStore = create((set) => ({
  notifications: [],

  addNotification: (message) =>
    set((state) => ({
      notifications: [
        { id: Date.now(), message },
        ...state.notifications,
      ],
    })),

  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
}));