import { create } from 'zustand';
import { useAlert } from "../../../context/AlertContext";

const useLinesmenStore = create((set, get) => ({
  // State
  linesmen: [],
  selectedLinesmen: [],
  originalAssignedLinesmen: [],
  loadingLinesmen: false,
  linesmenError: null,
  modalVisible: false,
  assigningTask: false,

  // Actions
  setLinesmen: (linesmen) => set({ linesmen }),
  setSelectedLinesmen: (selectedLinesmen) => set({ selectedLinesmen }),
  setOriginalAssignedLinesmen: (linesmen) => set({ originalAssignedLinesmen: linesmen }),
  setLoadingLinesmen: (loading) => set({ loadingLinesmen: loading }),
  setLinesmenError: (error) => set({ linesmenError: error }),
  setModalVisible: (visible) => set({ modalVisible: visible }),
  setAssigningTask: (assigning) => set({ assigningTask: assigning }),

  // Initialize linesmen data
  initializeLinesmen: (report) => {
    get().fetchLinesmen(report.areaId || 13, report.assignedLinesmen);
  },

  // Check if linesmen selection has changed
  hasLinesmenSelectionChanged: () => {
    const { originalAssignedLinesmen, selectedLinesmen } = get();
    
    if (originalAssignedLinesmen.length !== selectedLinesmen.length) return true;
    
    const originalIds = originalAssignedLinesmen.map(l => l.value).sort();
    const selectedIds = selectedLinesmen.map(l => l.value).sort();
    
    for (let i = 0; i < originalIds.length; i++) {
      if (originalIds[i] !== selectedIds[i]) return true;
    }
    
    return false;
  },

  // Toggle linesmen selection
  toggleLinesman: (item) => {
    const { selectedLinesmen } = get();
    if (selectedLinesmen.some(l => l.value === item.value)) {
      set({ selectedLinesmen: selectedLinesmen.filter(l => l.value !== item.value) });
    } else {
      set({ selectedLinesmen: [...selectedLinesmen, item] });
    }
  },

  // Clear all selections
  clearSelections: () => set({ selectedLinesmen: [] }),

  // Fetch linesmen data from API
  fetchLinesmen: async (areaId = 13, assignedLinesmen = []) => {
    set({ loadingLinesmen: true, linesmenError: null });
    
    try {
      const response = await fetch(`https://streetlightfix-backend-1.onrender.com/admin/linemen/${areaId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Transform data
      const formattedLinesmen = data.map(lineman => ({
        label: lineman.Lineman_Name,
        value: lineman.linemen_id.toString(),
        areaId: lineman.area_id,
        subdivisionId: lineman.subdivision_id
      }));
      
      set({ linesmen: formattedLinesmen });
      
      // Preselect linesmen if we have assigned linesmen data
      if (assignedLinesmen && Array.isArray(assignedLinesmen) && assignedLinesmen[0]?.id) {
        const assignedIds = assignedLinesmen[0].id;
        
        // Find matching linesmen
        const preselectedLinesmen = formattedLinesmen.filter(linesman =>
          assignedIds.includes(parseInt(linesman.value))
        );
        
        if (preselectedLinesmen.length > 0) {
          set({ 
            selectedLinesmen: preselectedLinesmen,
            originalAssignedLinesmen: preselectedLinesmen
          });
        }
      }
    } catch (error) {
      console.error("Failed to fetch linesmen:", error);
      set({ linesmenError: "Failed to load linesmen data. Please try again later." });
    } finally {
      set({ loadingLinesmen: false });
    }
  },
  
  // Reset store to initial state
  resetStore: () => set({
    linesmen: [],
    selectedLinesmen: [],
    originalAssignedLinesmen: [],
    loadingLinesmen: false,
    linesmenError: null,
    modalVisible: false,
    assigningTask: false
  })
}));

export default useLinesmenStore;