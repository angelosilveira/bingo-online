import { create } from "zustand";

interface AppState {
  // Exemplo de estado global
  count: number;
  increment: () => void;
  decrement: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
}));

// Você pode adicionar outras stores aqui ou em arquivos separados dentro da pasta store
