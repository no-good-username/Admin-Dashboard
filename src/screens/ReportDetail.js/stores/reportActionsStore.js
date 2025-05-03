import { create } from 'zustand';
import useLinesmenStore from './linesmenStore';
import useReportStatusStore from './reportStatusStore';
import useUpdatesStore from './updatesStore';
import useReportsStore from '../../../stores/reportsStore';

const useReportActionsStore = create((set, get) => ({
  // Task assignment functions
  assignTask: async (reportId, onSuccess, onError) => {
    const linesmenStore = useLinesmenStore.getState();
    const reportStatusStore = useReportStatusStore.getState();
    const updatesStore = useUpdatesStore.getState();
    const reportsStore = useReportsStore.getState();
    
    if (linesmenStore.selectedLinesmen.length === 0) {
      if (onError) onError("Please select at least one linesman");
      return;
    }
    
    linesmenStore.setAssigningTask(true);
    
    // Extract lineman IDs
    const linemanIds = linesmenStore.selectedLinesmen.map(linesman => parseInt(linesman.value));
    
    try {
      // First, assign the task
      const assignResponse = await fetch('https://streetlightfix-backend-1.onrender.com/admin/assignTask', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskid: reportId,
          linemanid: linemanIds
        })
      });
      
      if (!assignResponse.ok) {
        throw new Error(`Failed to assign task. Status: ${assignResponse.status}`);
      }
      
      const assignData = await assignResponse.json();
      
      // Then, update the status to "InProgress"
      const statusResponse = await fetch('https://streetlightfix-backend-1.onrender.com/admin/task/update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskid: reportId,
          status: "InProgress"
        })
      });
      
      if (!statusResponse.ok) {
        throw new Error(`Failed to update status. Status: ${statusResponse.status}`);
      }
      
      const statusData = await statusResponse.json();
      
      // Update UI state
      reportStatusStore.setReportStatus("In Progress");
      linesmenStore.setOriginalAssignedLinesmen([...linesmenStore.selectedLinesmen]);
      
      // Update global store for Issues screen
      reportsStore.updateReport(reportId, {
        status: "In Progress",
        dbStatus: "InProgress",
        assignedLinesmen: [{ id: linemanIds }]
      });
      
      // Generate update text
      const assigneeNames = linesmenStore.selectedLinesmen.map(l => l.label).join(", ");
      const updateText = `Task assigned to ${assigneeNames}. Report status updated to In Progress.`;
      updatesStore.addUpdate(updateText);
      
      // Close the modal
      linesmenStore.setModalVisible(false);
      
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error in assign task flow:", error);
      if (onError) onError(error.message || "There was an error assigning this task");
    } finally {
      linesmenStore.setAssigningTask(false);
    }
  },
  
  unassignTask: async (reportId, onSuccess, onError) => {
    const linesmenStore = useLinesmenStore.getState();
    const reportStatusStore = useReportStatusStore.getState();
    const updatesStore = useUpdatesStore.getState();
    const reportsStore = useReportsStore.getState();
    
    linesmenStore.setAssigningTask(true);
    
    try {
      // First, unassign the task
      const assignResponse = await fetch('https://streetlightfix-backend-1.onrender.com/admin/assignTask', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskid: reportId,
          linemanid: [] // Empty array to unassign all
        })
      });
      
      if (!assignResponse.ok) {
        throw new Error(`Failed to unassign task. Status: ${assignResponse.status}`);
      }
      
      const assignData = await assignResponse.json();
      
      // Then, update the status to "Open"
      const statusResponse = await fetch('https://streetlightfix-backend-1.onrender.com/admin/task/update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskid: reportId,
          status: "Open" // Reset status to Open
        })
      });
      
      if (!statusResponse.ok) {
        throw new Error(`Failed to update status. Status: ${statusResponse.status}`);
      }
      
      const statusData = await statusResponse.json();
      
      // Update UI state
      reportStatusStore.setReportStatus("Open");
      linesmenStore.setSelectedLinesmen([]);
      linesmenStore.setOriginalAssignedLinesmen([]);
      
      // Update global store for Issues screen
      reportsStore.updateReport(reportId, {
        status: "Open",
        dbStatus: "Open",
        assignedLinesmen: [{ id: [] }]
      });
      
      // Generate update text
      const updateText = `All linesmen have been unassigned from this task. Status reset to Open.`;
      updatesStore.addUpdate(updateText);
      
      // Close the modal
      linesmenStore.setModalVisible(false);
      
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error in unassign task flow:", error);
      if (onError) onError(error.message || "There was an error unassigning this task");
    } finally {
      linesmenStore.setAssigningTask(false);
    }
  },
  
  updateStatus: async (reportId, statusLabel, proof = null, onSuccess, onError) => {
    const reportStatusStore = useReportStatusStore.getState();
    const updatesStore = useUpdatesStore.getState();
    const reportsStore = useReportsStore.getState();
    
    reportStatusStore.setUpdatingStatus(true);
    
    const statusValue = reportStatusStore.getStatusValue(statusLabel);
    const requestPayload = {
      taskid: reportId,
      status: statusValue
    };
    
    if (proof) {
      requestPayload.resolutionProof = proof;
    }
    
    try {
      const response = await fetch('https://streetlightfix-backend-1.onrender.com/admin/task/update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestPayload)
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update status. Status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Update UI state
      reportStatusStore.setReportStatus(statusLabel);
      reportStatusStore.setStatusModalVisible(false);
      reportStatusStore.setShowResolutionModal(false);
      
      // Update global store for Issues screen
      reportsStore.updateReport(reportId, {
        status: statusLabel,
        dbStatus: statusValue
      });
      
      // Generate update text
      let updateText = `Report status updated to: ${statusLabel}`;
      if (proof) {
        updateText += ` with proof: ${proof.substring(0, 50)}${proof.length > 50 ? '...' : ''}`;
      }
      
      // Clear resolution proof
      reportStatusStore.setResolutionProof("");
      reportStatusStore.setSelectedStatusToUpdate(null);
      
      // Add update to list
      updatesStore.addUpdate(updateText);
      
      if (onSuccess) onSuccess(statusLabel);
    } catch (error) {
      console.error("Error updating status:", error);
      if (onError) onError(error.message || "There was an error updating the status");
    } finally {
      reportStatusStore.setUpdatingStatus(false);
    }
  },
  
  sendUpdate: async (reportId, onSuccess, onError) => {
    const updatesStore = useUpdatesStore.getState();
    const statusUpdate = updatesStore.statusUpdate;
    
    if (!statusUpdate.trim()) return;
    
    const newUpdate = {
      id: `update-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      text: statusUpdate,
      timestamp: new Date().toISOString(),
    };
    
    // Optimistic update
    updatesStore.setUpdates([newUpdate, ...updatesStore.updates]);
    
    try {
      const response = await fetch(`https://streetlightfix-backend-1.onrender.com/admin/updateStatus`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskid: reportId,
          status: statusUpdate.trim()
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to send update');
      }
      
      updatesStore.setStatusUpdate("");
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Failed to save update:", error);
      // Rollback optimistic update
      updatesStore.setUpdates(updatesStore.updates.filter(update => update.id !== newUpdate.id));
      if (onError) onError(error.message || "Failed to send update");
    }
  }
}));

export default useReportActionsStore;