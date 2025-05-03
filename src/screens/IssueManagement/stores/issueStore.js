import { create } from 'zustand';
import useReportsStore from '../../../stores/reportsStore';

const useIssueStore = create((set, get) => ({
  // Existing state and mappings
  issues: [],
  loading: true,
  refreshing: false,
  filterStatus: "All",
  error: null,

  // Status mappings
  statusMapping: {
    "Open": "Open",
    "InProgress": "In Progress",
    "Completed": "Resolved",
    "Closed": "Closed"
  },

  reverseStatusMapping: {
    "All": "All",
    "Open": "Open",
    "In Progress": "InProgress",
    "Resolved": "Completed",
    "Closed": "Closed"
  },

  // Existing actions
  setIssues: (issues) => set({ issues }),
  setLoading: (loading) => set({ loading }),
  setRefreshing: (refreshing) => set({ refreshing }),
  setFilterStatus: (status) => set({ filterStatus: status }),
  setError: (error) => set({ error }),

  // Add new method to update a single issue
  updateIssue: (reportId, updates) => {
    set(state => {
      const updatedIssues = state.issues.map(issue =>
        (issue.id === reportId || issue.taskId === reportId)
          ? { ...issue, ...updates }
          : issue
      );
      
      return { issues: updatedIssues };
    });
  },

  // Fetch issues data - modified to sync with global store
  fetchIssues: async () => {
    set({ loading: true, error: null });
    
    try {
      const response = await fetch(
        "https://streetlightfix-backend-1.onrender.com/admin/Issue/2",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = (await response.json()).flat(); // Flatten the array
      const { statusMapping } = get();

      if (Array.isArray(result)) {
        const formattedIssues = result.map((item) => {
          let formattedDate = "Unknown date";
          if (item.ReportcreatedAt) {
            try {
              const dateObj = new Date(item.ReportcreatedAt);
              if (!isNaN(dateObj)) {
                formattedDate = dateObj.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                });
              }
            } catch (e) {
              console.log("Error parsing date:", e);
            }
          }

          // Map DB status to frontend display status
          const displayStatus = statusMapping[item.Status] || "Open";

          return {
            id: item.report_id || Math.random().toString(),
            taskId: item.id || "Unknown",
            issue: item.title || "Unknown Issue",
            description: item.description || "No description available",
            location:
              item.Latitude && item.Longitude
                ? `Lat: ${item.Latitude}, Lng: ${item.Longitude}`
                : "Unknown location",
            status: displayStatus, // Use the mapped display status
            dbStatus: item.Status, // Keep the original DB status
            priority: item.priority || "Medium",
            date: formattedDate,
            imageUrl: item.url || "",
            updates: item.Status_update || [],
            assignedLinesmen: [{ id: item.linemen_id || [] }] || [],
            // areaId: item.area_id ? item.area_id.toString() : "13", // Ensure it's a string and has a default
            areaId: 13,
          };
        });
        
        set({ issues: formattedIssues });
        
        // Sync with global store
        useReportsStore.getState().syncReportsFromIssues(formattedIssues);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      set({ error: error.message || "Failed to load issues" });
    } finally {
      set({ loading: false, refreshing: false });
    }
  },

  // Refresh data with global store updates
  refreshIssues: async (checkGlobalUpdates = true) => {
    set({ refreshing: true });
    
    // First check if we have updates in the global store
    if (checkGlobalUpdates) {
      const { lastUpdatedReport, needsRefresh } = useReportsStore.getState();
      
      if (needsRefresh && lastUpdatedReport) {
        // Update the local report without refetching everything
        get().updateIssue(lastUpdatedReport.id, lastUpdatedReport);
        
        // Clear the refresh flag in the global store
        useReportsStore.getState().clearNeedsRefresh();
        
        // Set refreshing to false since we didn't do a full refresh
        set({ refreshing: false });
        return;
      }
    }
    
    // If no global updates or forced refresh, fetch everything
    await get().fetchIssues();
  },

  // Existing getFilteredIssues
  getFilteredIssues: () => {
    const { issues, filterStatus, reverseStatusMapping } = get();
    
    if (filterStatus === "All") return issues;
    
    // Use the reverse mapping to filter based on DB status values
    const dbStatusToFilter = reverseStatusMapping[filterStatus];
    return issues.filter((issue) => issue.dbStatus === dbStatusToFilter);
  }
}));

export default useIssueStore;