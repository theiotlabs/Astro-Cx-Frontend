import { create } from 'zustand';

interface ThemeState {
  theme: 'dark';
}

const useThemeStore = create<ThemeState>(() => ({
  theme: 'dark', // Enforced dark theme
}));

export default useThemeStore;

