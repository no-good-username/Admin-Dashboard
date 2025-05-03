import { create } from 'zustand';

const useUIStore = create((set, get) => ({
  // Style helper functions
  getStatusStyle: (status) => {
    switch (status.toLowerCase()) {
      case "open":
        return { backgroundColor: "#FF9500", borderColor: "#FF9500" };
      case "in progress":
        return { backgroundColor: "#007AFF", borderColor: "#007AFF" };
      case "resolved":
        return { backgroundColor: "#34C759", borderColor: "#34C759" };
      case "closed":
        return { backgroundColor: "#FF3B30", borderColor: "#FF3B30" };
      default:
        return { backgroundColor: "#FF9500", borderColor: "#FF9500" };
    }
  },

  getPriorityIcon: (priority) => {
    switch (priority.toLowerCase()) {
      case "high":
        return { name: "exclamation-circle", color: "#FF3B30" };
      case "medium":
        return { name: "exclamation", color: "#FF9500" };
      case "low":
        return { name: "info-circle", color: "#34C759" };
      default:
        return { name: "exclamation", color: "#FF9500" };
    }
  }
}));

export default useUIStore;