import { create } from 'zustand';
import type { User, LiveAlert, VerificationResult } from '@/types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  login: (user, token) => set({ user, token, isAuthenticated: true }),
  logout: () => set({ user: null, token: null, isAuthenticated: false }),
}));

interface VerificationState {
  currentResult: VerificationResult | null;
  isVerifying: boolean;
  setResult: (result: VerificationResult | null) => void;
  setVerifying: (v: boolean) => void;
  reset: () => void;
}

export const useVerificationStore = create<VerificationState>((set) => ({
  currentResult: null,
  isVerifying: false,
  setResult: (result) => set({ currentResult: result }),
  setVerifying: (v) => set({ isVerifying: v }),
  reset: () => set({ currentResult: null, isVerifying: false }),
}));

interface LiveFeedState {
  alerts: LiveAlert[];
  addAlert: (alert: LiveAlert) => void;
  clearAlerts: () => void;
}

export const useLiveFeedStore = create<LiveFeedState>((set) => ({
  alerts: [],
  addAlert: (alert) => set((state) => ({ alerts: [alert, ...state.alerts].slice(0, 50) })),
  clearAlerts: () => set({ alerts: [] }),
}));

interface UIState {
  sidebarOpen: boolean;
  demoMode: boolean;
  toggleSidebar: () => void;
  setDemoMode: (v: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: false,
  demoMode: true,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setDemoMode: (v) => set({ demoMode: v }),
}));
