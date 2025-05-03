import { useState, useCallback } from "react";
import { useAlert } from "../../../context/AlertContext";

export default function useStatusUpdate(report, statusOptions, onUpdateCompleted) {
  const [reportStatus, setReportStatus] = useState(
    statusOptions.find(option => 
      option.value.toLowerCase() === (report.dbStatus?.toLowerCase() || "open")
    )?.label || "Open"
  );
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [showResolutionModal, setShowResolutionModal] = useState(false);
  const [resolutionProof, setResolutionProof] = useState("");
  const [selectedStatusToUpdate, setSelectedStatusToUpdate] = useState(null);
  
  const { showAlert } = useAlert();

  // Get status value from label
  const getStatusValue = useCallback((statusLabel) => {
    const option = statusOptions.find(opt => opt.label === statusLabel);
    return option ? option.value : "Open";
  }, [statusOptions]);

  // Status color functions
  const getStatusColor = useCallback((statusLabel) => {
    const statusOption = statusOptions.find(option =>
      option.label.toLowerCase() === (statusLabel?.toLowerCase() || "open")
    );
    return statusOption?.color || "#FF9500";
  }, [statusOptions]);

  // Text color based on background
  const getTextColor = useCallback((backgroundColor) => {
    const darkColors = ["#007AFF", "#000000", "#FF3B30"];
    return darkColors.includes(backgroundColor) ? "#FFFFFF" : "#000000";
  }, []);

  // Perform the actual status update API call
  const performStatusUpdate = useCallback((statusLabel, proof = null) => {
    setUpdatingStatus(true);
    
    const statusValue = getStatusValue(statusLabel);
    const requestPayload = {
      taskid: report.taskId,
      status: statusValue
    };

    if (proof) {
      requestPayload.resolutionProof = proof;
    }

    fetch('https://streetlightfix-backend-1.onrender.com/admin/task/update', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestPayload)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to update status. Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log("Status updated successfully:", data);
        
        // Update UI state
        setReportStatus(statusLabel);
        setStatusModalVisible(false);
        setShowResolutionModal(false);

        // Generate update text
        let updateText = `Report status updated to: ${statusLabel}`;
        if (proof) {
          updateText += ` with proof: ${proof.substring(0, 50)}${proof.length > 50 ? '...' : ''}`;
        }

        // Clear resolution proof
        setResolutionProof("");
        setSelectedStatusToUpdate(null);

        // Call completion callback with the new status and update text
        onUpdateCompleted(statusLabel, updateText);

        // Notify user for resolved or closed status
        if (statusLabel.toLowerCase() === "resolved" || statusLabel.toLowerCase() === "closed") {
          showAlert({
            type: 'success',
            title: `Report ${statusLabel}`,
            message: `This report has been marked as ${statusLabel}. A notification has been sent to the user.`,
            buttons: [{ text: "OK" }]
          });
        }
      })
      .catch(error => {
        console.error("Error updating status:", error);
        showAlert({
          type: 'error',
          title: "Status Update Failed",
          message: "There was an error updating the report status. Please try again.",
          buttons: [{ text: "OK" }]
        });
      })
      .finally(() => {
        setUpdatingStatus(false);
      });
  }, [getStatusValue, report.taskId, showAlert, onUpdateCompleted]);

  // Handle status update request with flow validation
  const updateReportStatus = useCallback((statusLabel) => {
    if (statusLabel.toLowerCase() === "resolved") {
      setSelectedStatusToUpdate(statusLabel);
      setShowResolutionModal(true);
      return;
    }
    
    if (statusLabel.toLowerCase() === "closed" && 
        reportStatus.toLowerCase() !== "resolved") {
      showAlert({
        type: 'error',
        title: "Status Flow Error",
        message: "A report can only be closed after it has been resolved.",
        buttons: [{ text: "OK" }]
      });
      return;
    }

    performStatusUpdate(statusLabel);
  }, [reportStatus, performStatusUpdate, showAlert]);

  // Handle status option press
  const onStatusOptionPress = useCallback((option, selectedLinesmen) => {
    const isOpenOption = option.value === "Open";
    const shouldDisableOpen = isOpenOption && selectedLinesmen.length > 0;
    const isClosedOption = option.label.toLowerCase() === "closed";
    const canBeClosed = reportStatus.toLowerCase() === "resolved";
    
    if (shouldDisableOpen) {
      return;
    }
    
    if (isClosedOption && !canBeClosed) {
      showAlert({
        type: 'error',
        title: "Status Flow Error",
        message: "A report can only be closed after it has been resolved.",
        buttons: [{ text: "OK" }]
      });
      return;
    }
    
    updateReportStatus(option.label);
  }, [updateReportStatus, reportStatus, showAlert]);

  return {
    reportStatus,
    setReportStatus,
    statusModalVisible,
    setStatusModalVisible,
    updatingStatus,
    showResolutionModal,
    setShowResolutionModal,
    resolutionProof,
    setResolutionProof,
    selectedStatusToUpdate,
    setSelectedStatusToUpdate,
    getStatusColor,
    getTextColor,
    performStatusUpdate,
    updateReportStatus,
    onStatusOptionPress
  };
}