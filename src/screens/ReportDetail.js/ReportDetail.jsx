import React, { useCallback } from "react";
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

// Import hooks
import useLinesmen from "./hooks/useLinesmen";
import useStatusUpdate from "./hooks/useStatusUpdate";
import useUpdates from "./hooks/useUpdates";

const ReportDetail = React.memo(({ route, navigation }) => {
  const { report } = route.params;
  const { showAlert } = useAlert();
  
  // Status options for the report
  const statusOptions = [
    { label: "Open", value: "Open", color: "#FF9500" },
    { label: "In Progress", value: "InProgress", color: "#007AFF" },
    { label: "Resolved", value: "Completed", color: "#34C759" },
    { label: "Closed", value: "Closed", color: "#FF3B30" },
  ];

  // Status update handling
  const statusUpdateHandler = useCallback((newStatus, updateText) => {
    updatesHook.addUpdate(updateText);
  }, []);

  // Initialize hooks
  const linesmenHook = useLinesmen(report);
  const statusHook = useStatusUpdate(report, statusOptions, statusUpdateHandler);
  const updatesHook = useUpdates(report);
  
  // Function to unassign linesmen from the task
  const unassignTask = useCallback(() => {
    linesmenHook.setAssigningTask(true);
    
    fetch('https://streetlightfix-backend-1.onrender.com/admin/assignTask', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        taskid: report.taskId,
        linemanid: [] // Empty array to unassign all
      })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to unassign task. Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      // After successfully unassigning, update the status to "Open"
      return fetch('https://streetlightfix-backend-1.onrender.com/admin/task/update', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          taskid: report.taskId,
          status: "Open" // Reset status to Open
        })
      });
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to update status. Status: ${response.status}`);
      }
      return response.json();
    })
    .then(statusData => {
      // Update UI state
      statusHook.setReportStatus("Open");
  
      // Add an update about the unassignment
      const updateText = `All linesmen have been unassigned from this task. Status reset to Open.`;
      updatesHook.addUpdate(updateText);
  
      showAlert({
        type: 'success',
        title: "Task Unassigned",
        message: `All linesmen have been unassigned from this task and status reset to Open.`,
        buttons: [{ text: "OK" }]
      });
    })
    .catch(error => {
      console.error("Error in unassign task flow:", error);
      showAlert({
        type: 'error',
        title: "Unassignment Failed",
        message: "There was an error unassigning this task. Please try again.",
        buttons: [{ text: "OK" }]
      });
    })
    .finally(() => {
      linesmenHook.setAssigningTask(false);
      linesmenHook.setModalVisible(false); // Close the modal after operation is complete
    });
  }, [report.taskId, showAlert, statusHook, updatesHook, linesmenHook]);
  
  // Updated toggleLinesman with unassign functionality
  const handleToggleLinesman = useCallback((item) => {
    const isRemovingLast = linesmenHook.selectedLinesmen.length === 1 && 
                          linesmenHook.selectedLinesmen[0].value === item.value;
    
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
              linesmenHook.setSelectedLinesmen([]);
              unassignTask();
            }
          }
        ]
      });
    } else {
      linesmenHook.toggleLinesman(item);
    }
  }, [linesmenHook, unassignTask, showAlert]);
  
  // Assign task to selected linesmen
  const assignTask = useCallback(() => {
    if (linesmenHook.selectedLinesmen.length === 0) {
      showAlert({
        type: 'warning',
        title: "Selection Required",
        message: "Please select at least one linesman before assigning a task.",
        buttons: [{ text: "OK" }]
      });
      return;
    }
  
    linesmenHook.setAssigningTask(true);
  
    // Extract lineman IDs from selected linesmen objects
    const linemanIds = linesmenHook.selectedLinesmen.map(linesman => parseInt(linesman.value));
    
    fetch('https://streetlightfix-backend-1.onrender.com/admin/assignTask', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        taskid: report.taskId,
        linemanid: linemanIds
      })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to assign task. Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      // After successfully assigning linesmen, update the status to "InProgress"
      return fetch('https://streetlightfix-backend-1.onrender.com/admin/task/update', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          taskid: report.taskId,
          status: "InProgress"
        })
      });
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to update status. Status: ${response.status}`);
      }
      return response.json();
    })
    .then(statusData => {
      // Update UI state
      statusHook.setReportStatus("In Progress");
      
      // Update original linesmen state to match the new selection
      linesmenHook.setOriginalAssignedLinesmen([...linesmenHook.selectedLinesmen]);
  
      // Add an update about the task assignment and status change
      const assigneeNames = linesmenHook.selectedLinesmen.map(l => l.label).join(", ");
      const updateText = `Task assigned to ${assigneeNames}. Report status updated to In Progress.`;
      updatesHook.addUpdate(updateText);
  
      showAlert({
        type: 'success',
        title: "Task Assigned",
        message: `Task has been successfully assigned to the selected linesmen and status updated to In Progress.`,
        buttons: [{ text: "OK" }]
      });
      
      // Close the linesmen selection modal if open
      linesmenHook.setModalVisible(false);
    })
    .catch(error => {
      console.error("Error in assign task flow:", error);
      showAlert({
        type: 'error',
        title: "Assignment Failed",
        message: "There was an error assigning this task or updating its status. Please try again.",
        buttons: [{ text: "OK" }]
      });
    })
    .finally(() => {
      linesmenHook.setAssigningTask(false);
    });
  }, [linesmenHook, report.taskId, showAlert, statusHook, updatesHook]);

  // Handle "Done" button in linesmen modal
  const handleLinesmenDone = useCallback(() => {
    if (linesmenHook.originalAssignedLinesmen.length > 0 && linesmenHook.selectedLinesmen.length === 0) {
      showAlert({
        type: 'warning',
        title: "Unassign Task",
        message: "Are you sure you want to unassign all linesmen from this task?",
        buttons: [
          {
            text: "Cancel",
            style: "cancel",
            onPress: () => {
              linesmenHook.setSelectedLinesmen(linesmenHook.originalAssignedLinesmen);
            }
          },
          {
            text: "Yes, Unassign",
            style: "destructive",
            onPress: unassignTask
          }
        ]
      });
    } else if (linesmenHook.hasLinesmenSelectionChanged() && linesmenHook.selectedLinesmen.length > 0) {
      showAlert({
        type: 'info',
        title: "Update Assignment",
        message: "Would you like to update the linesman assignment for this task?",
        buttons: [
          { text: "Cancel", style: "cancel" },
          {
            text: "Update Assignment",
            onPress: assignTask
          }
        ]
      });
    } else {
      linesmenHook.setModalVisible(false);
    }
  }, [linesmenHook, unassignTask, assignTask, showAlert]);

  // Retry loading linesmen
  const retryFetchLinesmen = useCallback(() => {
    linesmenHook.fetchLinesmen();
  }, [linesmenHook]);
  
  // Handle status option press
  const handleStatusOptionPress = useCallback((option) => {
    statusHook.onStatusOptionPress(option, linesmenHook.selectedLinesmen);
  }, [statusHook, linesmenHook.selectedLinesmen]);

  // Prepare sections for SectionList
  const sections = [
    {
      title: "ReportInfo",
      data: [{ id: "reportInfo-section" }],
      renderItem: () => (
        <ReportInfo
          report={report}
          statusUpdate={updatesHook.statusUpdate}
          handleStatusUpdate={updatesHook.setStatusUpdate}
          sendUpdate={updatesHook.sendUpdate}
          reportStatus={statusHook.reportStatus}
          getStatusColor={statusHook.getStatusColor}
          getTextColor={statusHook.getTextColor}
          onStatusPress={() => statusHook.setStatusModalVisible(true)}
        />
      ),
    },
    {
      title: "Updates",
      data: [{ id: "updates-section" }],
      renderItem: () => <UpdatesList updates={updatesHook.updates} />,
    },
    {
      title: "Assign Linesmen",
      data: [{ id: "linesmen-section" }],
      renderItem: () => (
        <LinesmenAssignment
          selectedLinesmen={linesmenHook.selectedLinesmen}
          toggleLinesman={handleToggleLinesman}
          onShowModal={() => linesmenHook.setModalVisible(true)}
          assignTask={assignTask}
          isLoading={linesmenHook.assigningTask}
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
        isVisible={linesmenHook.modalVisible}
        onClose={() => linesmenHook.setModalVisible(false)}
        linesmen={linesmenHook.linesmen}
        selectedLinesmen={linesmenHook.selectedLinesmen}
        toggleLinesman={handleToggleLinesman}
        isLoading={linesmenHook.loadingLinesmen}
        error={linesmenHook.linesmenError}
        onRetry={retryFetchLinesmen}
        onDone={handleLinesmenDone}
        onCancel={() => linesmenHook.setModalVisible(false)}
      />
      
      <StatusSelector
        isVisible={statusHook.statusModalVisible}
        onClose={() => statusHook.setStatusModalVisible(false)}
        statusOptions={statusOptions}
        currentStatus={statusHook.reportStatus}
        onStatusPress={handleStatusOptionPress}
        onUpdateStatus={statusHook.updateReportStatus}
        selectedLinesmen={linesmenHook.selectedLinesmen}
        isLoading={statusHook.updatingStatus}
        getTextColor={statusHook.getTextColor}
      />
      
      <ResolutionProofForm
        isVisible={statusHook.showResolutionModal}
        onClose={() => {
          statusHook.setShowResolutionModal(false);
          statusHook.setSelectedStatusToUpdate(null);
        }}
        resolutionProof={statusHook.resolutionProof}
        setResolutionProof={statusHook.setResolutionProof}
        onSubmit={statusHook.performStatusUpdate}
        selectedStatus={statusHook.selectedStatusToUpdate}
        isLoading={statusHook.updatingStatus}
      />
    </View>
  );
});

export default ReportDetail;