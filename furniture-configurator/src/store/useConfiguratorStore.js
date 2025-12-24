
import { create } from 'zustand';

export const useConfiguratorStore = create((set) => ({
  // Toggles for visibility
  showTable: true,
  setShowTable: (v) => set({ showTable: v }),

  showChairs: false,
  setShowChairs: (v) => set({ showChairs: v }),

  table: {
    brand: 'Tromso',
    size: 'h75 w110 d70',
    color: 'Black',
  },
  chair: {
    brand: 'Tromso',
    count: 4,
    color: 'Black',
  },

  setTable: (updates) => set((state) => ({ table: { ...state.table, ...updates } })),
  setChair: (updates) => set((state) => ({ chair: { ...state.chair, ...updates } })),

  showDimensions: false,
  setShowDimensions: (v) => set({ showDimensions: v }),

  zoomLevel: 1,
  setZoomLevel: (v) => set({ zoomLevel: v }),
}));
