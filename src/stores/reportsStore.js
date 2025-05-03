import { create } from 'zustand';

const useReportsStore = create((set, get) => ({
  // State
  reports: [],
  lastUpdatedReport: null,
  needsRefresh: false,

  // Actions
  setReports: (reports) => set({ reports }),
  setNeedsRefresh: (value) => set({ needsRefresh: value }),
  
  // Update a report in the global store
  updateReport: (reportId, updates) => {
    set(state => {
      // Check if we can find the report
      const reportIndex = state.reports.findIndex(report => 
        report.id === reportId || report.taskId === reportId
      );
      
      // If report not found, just save the update
      if (reportIndex === -1) {
        return { 
          lastUpdatedReport: { id: reportId, ...updates },
          needsRefresh: true
        };
      }
      
      // If report found, update it in the array
      const updatedReports = [...state.reports];
      updatedReports[reportIndex] = {
        ...updatedReports[reportIndex],
        ...updates
      };
      
      return { 
        reports: updatedReports,
        lastUpdatedReport: { id: reportId, ...updates },
        needsRefresh: true
      };
    });
  },
  
  // Load reports from the issue store to keep them in sync
  syncReportsFromIssues: (issues) => {
    set({ reports: [...issues] });
  },
  
  // Clear the update flag after refresh
  clearNeedsRefresh: () => set({ needsRefresh: false }),
  
  // Clear everything - useful when logging out
  clearStore: () => set({ 
    reports: [], 
    lastUpdatedReport: null, 
    needsRefresh: false 
  })
}));

export default useReportsStore;