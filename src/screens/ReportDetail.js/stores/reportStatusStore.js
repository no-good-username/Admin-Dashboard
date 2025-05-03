import { create } from 'zustand';
import { useAlert } from "../../../context/AlertContext";

const useReportStatusStore = create((set, get) => ({
  // Status options
  statusOptions: [
    { label: "Open", value: "Open", color: "#FF9500" },
    { label: "In Progress", value: "InProgress", color: "#007AFF" },
    { label: "Resolved", value: "Completed", color: "#34C759" },
    { label: "Closed", value: "Closed", color: "#FF3B30" },
  ],
  
  // State
  reportStatus: "Open",
  statusModalVisible: false,
  updatingStatus: false,
  showResolutionModal: false,
  resolutionProof: "",
  selectedStatusToUpdate: null,
  
  // Actions
  setReportStatus: (status) => set({ reportStatus: status }),
  setStatusModalVisible: (visible) => set({ statusModalVisible: visible }),
  setUpdatingStatus: (updating) => set({ updatingStatus: updating }),
  setShowResolutionModal: (visible) => set({ showResolutionModal: visible }),
  setResolutionProof: (proof) => set({ resolutionProof: proof }),
  setSelectedStatusToUpdate: (status) => set({ selectedStatusToUpdate: status }),
  
  // Initialize report status based on report data
  initializeStatus: (reportDbStatus) => {
    const { statusOptions } = get();
    const statusOption = statusOptions.find(option => 
      option.value.toLowerCase() === (reportDbStatus?.toLowerCase() || "open")
    );
    set({ reportStatus: statusOption?.label || "Open" });
  },
  
  // Get status value from label
  getStatusValue: (statusLabel) => {
    const { statusOptions } = get();
    const option = statusOptions.find(opt => opt.label === statusLabel);
    return option ? option.value : "Open";
  },
  
  // Get color based on status
  getStatusColor: (statusLabel) => {
    const { statusOptions } = get();
    const statusOption = statusOptions.find(option =>
      option.label.toLowerCase() === (statusLabel?.toLowerCase() || "open")
    );
    return statusOption?.color || "#FF9500";
  },
  
  // Get text color based on background color
  getTextColor: (backgroundColor) => {
    const darkColors = ["#007AFF", "#000000", "#FF3B30"];
    return darkColors.includes(backgroundColor) ? "#FFFFFF" : "#000000";
  },
  
  // Reset store to initial state
  resetStore: () => set({
    reportStatus: "Open",
    statusModalVisible: false,
    updatingStatus: false,
    showResolutionModal: false,
    resolutionProof: "",
    selectedStatusToUpdate: null
  })
}));

export default useReportStatusStore;