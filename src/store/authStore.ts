
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  isAuthenticated: boolean;
  user: {
    name?: string;
    email?: string;
    phone?: string;
    photoUrl?: string;
  } | null;
  login: (userData: { email?: string; phone?: string; name?: string; photoUrl?: string }) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      login: (userData) => set({ isAuthenticated: true, user: userData }),
      logout: () => set({ isAuthenticated: false, user: null }),
    }),
    {
      name: 'garage-zen-auth',
    }
  )
);
