import React, { useEffect, useCallback } from "react";
import { View, SectionList, Text } from "react-native";
import { useAlert } from "../../context/AlertContext";
import styles from "./styles";

// Import components
import ReportInfo from "./components/ReportInfo";
import UpdatesList from "./components/UpdatesList";
import LinesmenAssignment from "./components/LinesmenAssignment";
import StatusSelector from "./components/StatusSelector";
import LinesmenSelector from "./components/LinesmenSelector";
import ResolutionProofForm from "./components/ResolutionProofForm";

// Import stores
import useLinesmenStore from "./stores/linesmenStore";
import useReportStatusStore from "./stores/reportStatusStore";
import useUpdatesStore from "./stores/updatesStore";
import useReportActionsStore from "./stores/reportActionsStore";

const ReportDetail = React.memo(({ route, navigation }) => {
  const { report } = route.params;
  const { showAlert } = useAlert();
  
  // Get state and actions from stores
  const {
    linesmen, 
    selectedLinesmen, 
    originalAssignedLinesmen,
    loadingLinesmen,
    linesmenError,
    modalVisible,
    assigningTask,
    setModalVisible,
    toggleLinesman,
    hasLinesmenSelectionChanged,
    initializeLinesmen,
    setSelectedLinesmen,
    clearSelections,
    fetchLinesmen
  } = useLinesmenStore();
  
  const {
    statusOptions,
    reportStatus,
    statusModalVisible,
    updatingStatus,
    showResolutionModal,
    resolutionProof,
    selectedStatusToUpdate,
    setStatusModalVisible,
    setShowResolutionModal,
    setResolutionProof,
    setSelectedStatusToUpdate,
    getStatusColor,
    getTextColor,
    initializeStatus
  } = useReportStatusStore();
  
  const {
    updates,
    statusUpdate,
    setStatusUpdate,
    addUpdate,
    initializeUpdates
  } = useUpdatesStore();
  
  const { assignTask, unassignTask, updateStatus, sendUpdate } = useReportActionsStore();
  
  // Initialize data
  useEffect(() => {
    initializeLinesmen(report);
    initializeStatus(report.dbStatus);
    initializeUpdates(report.updates);
    
    // Clean up on unmount
    return () => {
      useLinesmenStore.getState().resetStore();
      useReportStatusStore.getState().resetStore();
      useUpdatesStore.getState().resetStore();
    };
  }, [report]);
  
  // Handle toggle linesman with unassign confirmation
  const handleToggleLinesman = useCallback((item) => {
    const isRemovingLast = selectedLinesmen.length === 1 && 
                          selectedLinesmen[0].value === item.value;
    
    if (isRemovingLast) {
      showAlert({
        type: 'warning',
        title: "Unassign Task",
        message: "Are you sure you want to unassign all linesmen from this task?",
        buttons: [
          { text: "Cancel", style: "cancel" },
          {
            text: "Yes, Unassign",
            style: "destructive",
            onPress: () => {
              clearSelections();
              handleUnassignTask();
            }
          }
        ]
      });
    } else {
      toggleLinesman(item);
    }
  }, [selectedLinesmen, toggleLinesman, clearSelections, showAlert]);
  
  // Wrapper for assignTask with alerts
  const handleAssignTask = useCallback(() => {
    if (selectedLinesmen.length === 0) {
      showAlert({
        type: 'warning',
        title: "Selection Required",
        message: "Please select at least one linesman before assigning a task.",
        buttons: [{ text: "OK" }]
      });
      return;
    }
    
    assignTask(report.taskId, 
      // Success callback
      () => {
        showAlert({
          type: 'success',
          title: "Task Assigned",
          message: `Task has been successfully assigned to the selected linesmen and status updated to In Progress.`,
          buttons: [{ text: "OK" }]
        });
      },
      // Error callback
      (errorMsg) => {
        showAlert({
          type: 'error',
          title: "Assignment Failed",
          message: errorMsg || "There was an error assigning this task or updating its status. Please try again.",
          buttons: [{ text: "OK" }]
        });
      }
    );
  }, [report.taskId, selectedLinesmen, assignTask, showAlert]);
  
  // Wrapper for unassignTask with alerts
  const handleUnassignTask = useCallback(() => {
    unassignTask(report.taskId, 
      // Success callback
      () => {
        showAlert({
          type: 'success',
          title: "Task Unassigned",
          message: `All linesmen have been unassigned from this task and status reset to Open.`,
          buttons: [{ text: "OK" }]
        });
      },
      // Error callback
      (errorMsg) => {
        showAlert({
          type: 'error',
          title: "Unassignment Failed",
          message: errorMsg || "There was an error unassigning this task. Please try again.",
          buttons: [{ text: "OK" }]
        });
      }
    );
  }, [report.taskId, unassignTask, showAlert]);
  
  // Wrapper for sendUpdate with alerts
  const handleSendUpdate = useCallback(() => {
    if (!statusUpdate.trim()) return;
    
    sendUpdate(report.taskId,
      // Success callback 
      () => {},
      // Error callback
      (errorMsg) => {
        showAlert({
          type: 'error',
          title: "Update Failed",
          message: errorMsg || "Failed to send the update. Please try again.",
          buttons: [{ text: "OK" }]
        });
      }
    );
  }, [report.taskId, statusUpdate, sendUpdate, showAlert]);
  
  // Handle "Done" button in linesmen modal
  const handleLinesmenDone = useCallback(() => {
    if (originalAssignedLinesmen.length > 0 && selectedLinesmen.length === 0) {
      showAlert({
        type: 'warning',
        title: "Unassign Task",
        message: "Are you sure you want to unassign all linesmen from this task?",
        buttons: [
          {
            text: "Cancel",
            style: "cancel",
            onPress: () => {
              setSelectedLinesmen(originalAssignedLinesmen);
            }
          },
          {
            text: "Yes, Unassign",
            style: "destructive",
            onPress: handleUnassignTask
          }
        ]
      });
    } else if (hasLinesmenSelectionChanged() && selectedLinesmen.length > 0) {
      showAlert({
        type: 'info',
        title: "Update Assignment",
        message: "Would you like to update the linesman assignment for this task?",
        buttons: [
          { text: "Cancel", style: "cancel" },
          {
            text: "Update Assignment",
            onPress: handleAssignTask
          }
        ]
      });
    } else {
      setModalVisible(false);
    }
  }, [
    originalAssignedLinesmen, 
    selectedLinesmen, 
    hasLinesmenSelectionChanged, 
    setSelectedLinesmen, 
    setModalVisible, 
    handleUnassignTask, 
    handleAssignTask, 
    showAlert
  ]);
  
  // Handle status option press
  const handleStatusOptionPress = useCallback((option) => {
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
    
    if (option.label.toLowerCase() === "resolved") {
      setSelectedStatusToUpdate(option.label);
      setShowResolutionModal(true);
      return;
    }
    
    handleUpdateStatus(option.label);
  }, [
    reportStatus, 
    selectedLinesmen, 
    setSelectedStatusToUpdate, 
    setShowResolutionModal, 
    showAlert
  ]);
  
  // Wrapper for updateStatus with alerts
  const handleUpdateStatus = useCallback((statusLabel, proof = null) => {
    updateStatus(
      report.taskId,
      statusLabel,
      proof,
      // Success callback
      (newStatus) => {
        if (newStatus.toLowerCase() === "resolved" || newStatus.toLowerCase() === "closed") {
          showAlert({
            type: 'success',
            title: `Report ${newStatus}`,
            message: `This report has been marked as ${newStatus}. A notification has been sent to the user.`,
            buttons: [{ text: "OK" }]
          });
        }
      },
      // Error callback
      (errorMsg) => {
        showAlert({
          type: 'error',
          title: "Status Update Failed",
          message: errorMsg || "There was an error updating the report status. Please try again.",
          buttons: [{ text: "OK" }]
        });
      }
    );
  }, [report.taskId, updateStatus, showAlert]);
  
  // Handle resolution proof submit
  const handleResolutionSubmit = useCallback((status, proof) => {
    if (!proof.trim()) {
      showAlert({
        type: 'warning',
        title: "Resolution Proof Required",
        message: "Please provide details about how this issue was resolved.",
        buttons: [{ text: "OK" }]
      });
      return;
    }
    
    handleUpdateStatus(status, proof);
  }, [handleUpdateStatus, showAlert]);
  
  // Prepare sections for SectionList
  const sections = [
    {
      title: "ReportInfo",
      data: [{ id: "reportInfo-section" }],
      renderItem: () => (
        <ReportInfo
          report={report}
          statusUpdate={statusUpdate}
          handleStatusUpdate={setStatusUpdate}
          sendUpdate={handleSendUpdate}
          reportStatus={reportStatus}
          getStatusColor={getStatusColor}
          getTextColor={getTextColor}
          onStatusPress={() => setStatusModalVisible(true)}
        />
      ),
    },
    {
      title: "Updates",
      data: [{ id: "updates-section" }],
      renderItem: () => <UpdatesList updates={updates} />,
    },
    {
      title: "Assign Linesmen",
      data: [{ id: "linesmen-section" }],
      renderItem: () => (
        <LinesmenAssignment
          selectedLinesmen={selectedLinesmen}
          toggleLinesman={handleToggleLinesman}
          onShowModal={() => setModalVisible(true)}
          assignTask={handleAssignTask}
          isLoading={assigningTask}
        />
      ),
    },
  ];

  return (
    <View style={styles.container}>
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderSectionHeader={({ section }) => {
          if (section.title === "ReportInfo") {
            return null;
          }
          return <Text style={styles.sectionTitle}>{section.title}</Text>;
        }}
        stickySectionHeadersEnabled={false}
        contentContainerStyle={styles.contentContainer}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={5}
        initialNumToRender={5}
      />
      
      {/* Modals */}
      <LinesmenSelector
        isVisible={modalVisible}
        onClose={() => setModalVisible(false)}
        linesmen={linesmen}
        selectedLinesmen={selectedLinesmen}
        toggleLinesman={handleToggleLinesman}
        isLoading={loadingLinesmen}
        error={linesmenError}
        onRetry={() => fetchLinesmen(report.areaId || 13)}
        onDone={handleLinesmenDone}
        onCancel={() => setModalVisible(false)}
      />
      
      <StatusSelector
        isVisible={statusModalVisible}
        onClose={() => setStatusModalVisible(false)}
        statusOptions={statusOptions}
        currentStatus={reportStatus}
        onStatusPress={handleStatusOptionPress}
        onUpdateStatus={handleUpdateStatus}
        selectedLinesmen={selectedLinesmen}
        isLoading={updatingStatus}
        getTextColor={getTextColor}
      />
      
      <ResolutionProofForm
        isVisible={showResolutionModal}
        onClose={() => {
          setShowResolutionModal(false);
          setSelectedStatusToUpdate(null);
        }}
        resolutionProof={resolutionProof}
        setResolutionProof={setResolutionProof}
        onSubmit={handleResolutionSubmit}
        selectedStatus={selectedStatusToUpdate}
        isLoading={updatingStatus}
      />
    </View>
  );
});

export default ReportDetail;