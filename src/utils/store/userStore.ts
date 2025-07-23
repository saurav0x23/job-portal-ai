import { createStore } from "zustand";

interface UserState {
  user: {
    id: string;
    name: string;
    email: string;
  } | null;
  setUser: (user: { id: string; name: string; email: string }) => void;
  clearUser: () => void;
}

export const useUserStore = createStore<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));
