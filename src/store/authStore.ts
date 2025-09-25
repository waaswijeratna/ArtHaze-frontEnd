import { create } from "zustand";

interface AuthState {
  accessToken: string | null;
  user: { id: string; name: string; email: string; age: number; pfpUrl: string } | null;
  setAuth: (accessToken: string, user: AuthState["user"]) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,
  setAuth: (accessToken, user) => set({ accessToken, user }),
  clearAuth: () => set({ accessToken: null, user: null }),
}));
