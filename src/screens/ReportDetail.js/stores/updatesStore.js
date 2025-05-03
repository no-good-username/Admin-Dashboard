import { create } from 'zustand';

const useUpdatesStore = create((set, get) => ({
  // State
  updates: [],
  statusUpdate: "",
  
  // Actions
  setStatusUpdate: (update) => set({ statusUpdate: update }),
  setUpdates: (updates) => set({ updates }),
  
  // Initialize updates from report data
  initializeUpdates: (reportUpdates) => {
    if (Array.isArray(reportUpdates)) {
      const formattedUpdates = reportUpdates.map((update, index) => {
        if (typeof update === 'string') {
          return {
            id: `update-${index}-${Date.now()}`,
            text: update,
            timestamp: new Date().toISOString()
          };
        }
        return {
          ...update,
          id: update.id || `existing-update-${index}-${Date.now()}`
        };
      });
      set({ updates: formattedUpdates });
    } else {
      set({ updates: [] });
    }
  },
  
  // Add a new update to the list
  addUpdate: (text) => {
    const newUpdate = {
      id: `update-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      text,
      timestamp: new Date().toISOString(),
    };
    
    set(state => ({ updates: [newUpdate, ...state.updates] }));
  },
  
  // Clear status update
  clearStatusUpdate: () => set({ statusUpdate: "" }),
  
  // Reset store to initial state
  resetStore: () => set({
    updates: [],
    statusUpdate: ""
  })
}));

export default useUpdatesStore;