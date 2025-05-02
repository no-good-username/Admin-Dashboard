// screens/ReportDetail/ReportDetail.js
import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  SectionList,
  ActivityIndicator
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useAlert } from "../../context/AlertContext"; // Import custom alert hook
import styles from "./styles";

// Memoized update item component
const UpdateItem = React.memo(({ item }) => {
  if (item.isEmpty) {
    return (
      <View style={styles.emptyUpdateContainer}>
        <FontAwesome name="info-circle" size={24} color="#999" />
        <Text style={styles.emptyListText}>
          No updates sent to the user yet
        </Text>
      </View>
    );
  }

  // Handle different update formats
  const updateText = typeof item === 'string'
    ? item
    : (item.text || item.message || item.status || "Unknown update");

  // Only try to format date if timestamp exists and is valid
  let formattedDate = "No date";
  if (item.timestamp) {
    try {
      const date = new Date(item.timestamp);
      if (!isNaN(date.getTime())) {
        formattedDate = date.toLocaleString();
      }
    } catch (e) {
      console.log("Error parsing date:", e);
    }
  }

  return (
    <View style={styles.updateItem}>
      <Text style={styles.updateText}>{updateText}</Text>
      <Text style={styles.updateTimestamp}>
        {formattedDate}
      </Text>
    </View>
  );
});

const ReportDetail = React.memo(({ route, navigation }) => {
  const { report } = route.params;
  const { showAlert } = useAlert(); // Get the showAlert function
  
  console.log("Assigned linesmen from report:", report.assignedLinesmen);
  console.log("Report status:", report.dbStatus);

  const [statusUpdate, setStatusUpdate] = useState("");
  const [updates, setUpdates] = useState(() => {
    // Process updates from the API
    if (Array.isArray(report.updates)) {
      // Log updates for debugging
      console.log("Processing updates:", report.updates);

      return report.updates.map((update, index) => {
        // If update is a string, create an object for it
        if (typeof update === 'string') {
          return {
            id: `update-${index}-${Date.now()}`,
            text: update,
            timestamp: new Date().toISOString() // Default timestamp for display
          };
        }
        // If update is already an object, ensure it has an ID
        return {
          ...update,
          id: update.id || `existing-update-${index}-${Date.now()}`
        };
      });
    }
    return [];
  });

  // States for resolution proof workflow
  const [resolutionProof, setResolutionProof] = useState("");
  const [showResolutionModal, setShowResolutionModal] = useState(false);
  const [selectedStatusToUpdate, setSelectedStatusToUpdate] = useState(null);

  // Status options for the report
  const statusOptions = useMemo(() => [
    { label: "Open", value: "Open", color: "#FF9500" },
    { label: "In Progress", value: "InProgress", color: "#007AFF" },
    { label: "Resolved", value: "Completed", color: "#34C759" },
    { label: "Closed", value: "Closed", color: "#FF3B30" },
  ], []);

  // Function to get the display label for a status value
  const getStatusLabel = useCallback((statusValue) => {
    const statusOption = statusOptions.find(option =>
      option.value.toLowerCase() === (statusValue?.toLowerCase() || "open")
    );
    return statusOption?.label || "Open"; // Default to "Open" if no match found
  }, [statusOptions]);

  // Initially empty, will be populated after API call
  const [selectedLinesmen, setSelectedLinesmen] = useState([]);
  const [linesmen, setLinesmen] = useState([]);
  const [loadingLinesmen, setLoadingLinesmen] = useState(false);
  const [linesmenError, setLinesmenError] = useState(null);

  // Track the original linesmen assignment state for comparison
  const [originalAssignedLinesmen, setOriginalAssignedLinesmen] = useState([]);

  // Use the getStatusLabel function to convert the enum value to a display label
  const [reportStatus, setReportStatus] = useState(getStatusLabel(report.dbStatus) || "Open");

  const [modalVisible, setModalVisible] = useState(false);
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [assigningTask, setAssigningTask] = useState(false);

  // Fetch linesmen data from API and preselect assigned linesmen
  useEffect(() => {
    const fetchLinesmen = async () => {
      setLoadingLinesmen(true);
      setLinesmenError(null);

      try {
        // For now using hardcoded area ID 13
        const response = await fetch('https://streetlightfix-backend-1.onrender.com/admin/linemen/13');

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Linesmen data from API:", data);

        // Transform data to match your component's expected format
        const formattedLinesmen = data.map(lineman => ({
          label: lineman.Lineman_Name,
          value: lineman.linemen_id.toString(), // Convert to string to maintain compatibility
          areaId: lineman.area_id,
          subdivisionId: lineman.subdivision_id
        }));

        setLinesmen(formattedLinesmen);

        // Check if we have assigned linesmen data in the format [{"id": [4, 5]}]
        if (report.assignedLinesmen &&
          Array.isArray(report.assignedLinesmen) &&
          report.assignedLinesmen[0]?.id) {

          const assignedIds = report.assignedLinesmen[0].id;
          console.log("Assigned linesmen IDs:", assignedIds);

          // Find the linesmen objects that match the assigned IDs
          const preselectedLinesmen = formattedLinesmen.filter(linesman =>
            assignedIds.includes(parseInt(linesman.value))
          );

          console.log("Preselecting linesmen:", preselectedLinesmen);
          if (preselectedLinesmen.length > 0) {
            setSelectedLinesmen(preselectedLinesmen);
            setOriginalAssignedLinesmen(preselectedLinesmen); // Store the original state
          }
        }
      } catch (error) {
        console.error("Failed to fetch linesmen:", error);
        setLinesmenError("Failed to load linesmen data. Please try again later.");
      } finally {
        setLoadingLinesmen(false);
      }
    };

    fetchLinesmen();
  }, [report.areaId, report.assignedLinesmen]);

  // Function to unassign linesmen from the task
  const unassignTask = useCallback(() => {
    setAssigningTask(true);
    
    // Call the assign task API with empty array
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
      console.log("Task unassigned successfully:", data);
      
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
      console.log("Status updated to Open:", statusData);
      
      // Update UI state
      setReportStatus("Open");
  
      // Add an update about the unassignment
      const updateText = `All linesmen have been unassigned from this task. Status reset to Open.`;
  
      const newUpdate = {
        id: `unassign-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        text: updateText,
        timestamp: new Date().toISOString(),
      };
  
      setUpdates(prevUpdates => [newUpdate, ...prevUpdates]);
  
      // Use custom alert for success notification
      showAlert({
        type: 'success',
        title: "Task Unassigned",
        message: `All linesmen have been unassigned from this task and status reset to Open.`,
        buttons: [{ text: "OK" }]
      });
    })
    .catch(error => {
      console.error("Error in unassign task flow:", error);
      // Use custom alert for error notification
      showAlert({
        type: 'error',
        title: "Unassignment Failed",
        message: "There was an error unassigning this task. Please try again.",
        buttons: [{ text: "OK" }]
      });
    })
    .finally(() => {
      setAssigningTask(false);
      setModalVisible(false); // Close the modal after operation is complete
    });
  }, [report.taskId, showAlert]);
  
  // Assign task to selected linesmen and update status to "In Progress"
  const assignTask = useCallback(() => {
    if (selectedLinesmen.length === 0) {
      // Use custom alert for validation error
      showAlert({
        type: 'warning',
        title: "Selection Required",
        message: "Please select at least one linesman before assigning a task.",
        buttons: [{ text: "OK" }]
      });
      return;
    }
  
    setAssigningTask(true);
  
    // Extract lineman IDs from selected linesmen objects
    const linemanIds = selectedLinesmen.map(linesman => parseInt(linesman.value));
    
    // First, make the API call to assign the task
    fetch('https://streetlightfix-backend-1.onrender.com/admin/assignTask', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        taskid: report.taskId,
        linemanid: linemanIds // Send as array even for single value
      })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to assign task. Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log("Task assigned successfully:", data);
      
      // After successfully assigning linesmen, update the status to "InProgress"
      return fetch('https://streetlightfix-backend-1.onrender.com/admin/task/update', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          taskid: report.taskId,
          status: "InProgress" // Use the enum value expected by the API
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
      console.log("Status updated to InProgress:", statusData);
      
      // Update UI state
      setReportStatus("In Progress");
      
      // Update original linesmen state to match the new selection
      setOriginalAssignedLinesmen([...selectedLinesmen]);
  
      // Add an update about the task assignment and status change
      const assigneeNames = selectedLinesmen.map(l => l.label).join(", ");
      const updateText = `Task assigned to ${assigneeNames}. Report status updated to In Progress.`;
  
      const newUpdate = {
        id: `assign-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        text: updateText,
        timestamp: new Date().toISOString(),
      };
  
      setUpdates(prevUpdates => [newUpdate, ...prevUpdates]);
  
      // Use custom alert for success notification
      showAlert({
        type: 'success',
        title: "Task Assigned",
        message: `Task has been successfully assigned to the selected linesmen and status updated to In Progress.`,
        buttons: [{ text: "OK" }]
      });
      
      // Optionally, close the linesmen selection modal if open
      setModalVisible(false);
    })
    .catch(error => {
      console.error("Error in assign task flow:", error);
      // Use custom alert for error notification
      showAlert({
        type: 'error',
        title: "Assignment Failed",
        message: "There was an error assigning this task or updating its status. Please try again.",
        buttons: [{ text: "OK" }]
      });
    })
    .finally(() => {
      setAssigningTask(false);
    });
  }, [selectedLinesmen, report.taskId, showAlert]);

  // Find the status value from the label
  const getStatusValue = useCallback((statusLabel) => {
    const option = statusOptions.find(opt => opt.label === statusLabel);
    return option ? option.value : "Open"; // Default to "Open" if no match
  }, [statusOptions]);

  // Function to perform the actual status update API call
  const performStatusUpdate = useCallback((statusLabel, proof = null) => {
    setUpdatingStatus(true);
    
    // Get the value that corresponds to this label for API calls
    const statusValue = getStatusValue(statusLabel);

    // Prepare the request payload
    const requestPayload = {
      taskid: report.taskId,
      status: statusValue // Use the enum value, not the display label
    };

    // Add resolution proof if provided
    if (proof) {
      requestPayload.resolutionProof = proof;
    }

    // Make the API call to update the status
    fetch('https://streetlightfix-backend-1.onrender.com/admin/task/update', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
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
        setShowResolutionModal(false); // Close resolution modal if open

        // Add an update about the status change
        let updateText = `Report status updated to: ${statusLabel}`;
        
        // Add proof information if available
        if (proof) {
          updateText += ` with proof: ${proof.substring(0, 50)}${proof.length > 50 ? '...' : ''}`;
        }

        const newUpdate = {
          id: `status-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          text: updateText,
          timestamp: new Date().toISOString(),
        };

        setUpdates(prevUpdates => [newUpdate, ...prevUpdates]);

        // Clear any resolution proof
        setResolutionProof("");
        setSelectedStatusToUpdate(null);

        // Notify the user if the issue is resolved or closed
        if (statusLabel.toLowerCase() === "resolved" || statusLabel.toLowerCase() === "closed") {
          // Use custom alert for status notification
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
        // Use custom alert for error notification
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
  }, [getStatusValue, report.taskId, showAlert]);

  // Modified updateReportStatus to handle the resolution flow
  const updateReportStatus = useCallback((statusLabel) => {
    // For Resolved status, first collect resolution proof
    if (statusLabel.toLowerCase() === "resolved") {
      setSelectedStatusToUpdate(statusLabel);
      setShowResolutionModal(true);
      return; // Exit early and wait for proof submission
    }
    
    // For Closed status, check if current status is Resolved
    if (statusLabel.toLowerCase() === "closed" && 
        reportStatus.toLowerCase() !== "resolved") {
      // Use custom alert for status flow error
      showAlert({
        type: 'error',
        title: "Status Flow Error",
        message: "A report can only be closed after it has been resolved.",
        buttons: [{ text: "OK" }]
      });
      return;
    }

    // Continue with regular status update for other statuses
    performStatusUpdate(statusLabel);
  }, [reportStatus, performStatusUpdate, showAlert]);

  // Memoized function to send updates
  const sendUpdate = useCallback(() => {
    if (statusUpdate.trim()) {
      const newUpdate = {
        id: `update-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        text: statusUpdate,
        timestamp: new Date().toISOString(),
      };

      // Optimistic update
      setUpdates(prevUpdates => [newUpdate, ...prevUpdates]);

      fetch(`https://streetlightfix-backend-1.onrender.com/admin/updateStatus`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          taskid: report.taskId,
          status: statusUpdate.trim()
        })
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to send update');
          }
          setStatusUpdate("");
        })
        .catch(error => {
          console.error("Failed to save update:", error);
          // Rollback on error
          setUpdates(prevUpdates => prevUpdates.filter(update => update.id !== newUpdate.id));
          
          // Show error with custom alert
          showAlert({
            type: 'error',
            title: "Update Failed",
            message: "Failed to send the update. Please try again.",
            buttons: [{ text: "OK" }]
          });
        });
    }
  }, [statusUpdate, report.taskId, showAlert]);

  // Handle status update input
  const handleStatusUpdate = useCallback((text) => {
    setStatusUpdate(text);
  }, []);

  // Memoized toggle linesmen function with unassign confirmation
  const toggleLinesman = useCallback((item) => {
    // Check if this is the last linesman and we're trying to remove it
    const isRemovingLast = selectedLinesmen.length === 1 && 
                          selectedLinesmen[0].value === item.value;
    
    if (isRemovingLast) {
      // Show confirmation dialog with custom alert
      showAlert({
        type: 'warning',
        title: "Unassign Task",
        message: "Are you sure you want to unassign all linesmen from this task?",
        buttons: [
          {
            text: "Cancel",
            style: "cancel"
          },
          {
            text: "Yes, Unassign",
            style: "destructive",
            onPress: () => {
              // First clear the UI
              setSelectedLinesmen([]);
              // Then call the unassign task API
              unassignTask();
            }
          }
        ]
      });
    } else {
      // Normal toggle behavior for non-last linesman
      setSelectedLinesmen((current) =>
        current.some((l) => l.value === item.value)
          ? current.filter((l) => l.value !== item.value)
          : [...current, item]
      );
    }
  }, [selectedLinesmen, unassignTask, showAlert]);

  // Memoize status color function - use the value to find the color
  const getStatusColor = useCallback((statusLabel) => {
    // First find the option with matching label
    const statusOption = statusOptions.find(option =>
      option.label.toLowerCase() === (statusLabel?.toLowerCase() || "open")
    );
    return statusOption?.color || "#FF9500";
  }, [statusOptions]);

  // Get text color based on background color for better contrast
  const getTextColor = useCallback((backgroundColor) => {
    // Simple contrast check - use white text on dark backgrounds
    const darkColors = ["#007AFF", "#000000", "#FF3B30"];
    return darkColors.includes(backgroundColor) ? "#FFFFFF" : "#000000";
  }, []);

  // Modified status option press handler
  const onStatusOptionPress = useCallback((option) => {
    const isOpenOption = option.value === "Open";
    const shouldDisableOpen = isOpenOption && selectedLinesmen.length > 0;
    const isClosedOption = option.label.toLowerCase() === "closed";
    const canBeClosed = reportStatus.toLowerCase() === "resolved";
    
    // Check if this option should be disabled
    if (shouldDisableOpen) {
      return; // Open option is disabled when linesmen are assigned
    }
    
    if (isClosedOption && !canBeClosed) {
      // Use custom alert for status flow error
      showAlert({
        type: 'error',
        title: "Status Flow Error",
        message: "A report can only be closed after it has been resolved.",
        buttons: [{ text: "OK" }]
      });
      return;
    }
    
    updateReportStatus(option.label);
  }, [updateReportStatus, reportStatus, selectedLinesmen, showAlert]);

  // Helper function to check if linesmen assignments have changed
  const hasLinesmenSelectionChanged = useCallback(() => {
    // If the lengths are different, the selection has definitely changed
    if (originalAssignedLinesmen.length !== selectedLinesmen.length) return true;
    
    // If lengths are same, check if the same linesmen are selected
    const originalIds = originalAssignedLinesmen.map(l => l.value).sort();
    const selectedIds = selectedLinesmen.map(l => l.value).sort();
    
    // Compare each ID
    for (let i = 0; i < originalIds.length; i++) {
      if (originalIds[i] !== selectedIds[i]) return true;
    }
    
    return false;
  }, [originalAssignedLinesmen, selectedLinesmen]);

  // Memoize sections to prevent recreating on every render
  const sections = useMemo(() => [
    {
      title: "ReportInfo",
      data: [{ id: "reportInfo-section" }],
      renderItem: () => (
        <>
          <View style={styles.reportCard}>
            <View style={styles.reportHeader}>
              <Text style={styles.title}>{report.issue}</Text>
              <TouchableOpacity
                style={[styles.statusBadge, { backgroundColor: getStatusColor(reportStatus) }]}
                onPress={() => setStatusModalVisible(true)}
              >
                <Text style={[styles.statusText, { color: getTextColor(getStatusColor(reportStatus)) }]}>
                  {reportStatus}
                </Text>
                <FontAwesome name="chevron-down" size={12} color={getTextColor(getStatusColor(reportStatus))} style={{ marginLeft: 4 }} />
              </TouchableOpacity>
            </View>

            <View style={styles.locationContainer}>
              <FontAwesome name="map-marker" size={16} color="#666" />
              <Text style={styles.locationText}>{report.location}</Text>
            </View>

            <Text style={styles.description}>{report.description}</Text>

            {/* Image placeholder with better styling */}
            <View style={styles.imageContainer}>
              <View style={styles.imagePlaceholder}>
                <FontAwesome name="image" size={40} color="#999" />
                <Text style={styles.imagePlaceholderText}>Report Image</Text>
              </View>
            </View>
          </View>

          <View style={styles.updateContainer}>
            <TextInput
              style={styles.input}
              value={statusUpdate}
              onChangeText={handleStatusUpdate}
              placeholder="Send an update to the user..."
              multiline
            />
            <TouchableOpacity
              style={[styles.sendButton, !statusUpdate.trim() && styles.sendButtonDisabled]}
              onPress={sendUpdate}
              disabled={!statusUpdate.trim()}
            >
              <FontAwesome name="send" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </>
      ),
    },
    {
      title: "Updates",
      data: updates.length > 0
        ? updates.map((update, index) => {
          // Handle string updates
          if (typeof update === 'string') {
            return {
              id: `mapped-string-update-${index}-${Date.now()}`,
              text: update
            };
          }
          // Handle object updates
          return {
            ...update,
            id: update.id || `mapped-update-${index}-${Date.now()}`
          };
        })
        : [{ id: "empty-updates-section", isEmpty: true }],
      renderItem: ({ item }) => <UpdateItem item={item} />,
    },
    {
      title: "Assign Linesmen",
      data: [{ id: "linesmen-section" }],
      renderItem: () => (
        <>
          <TouchableOpacity
            style={styles.selectLinesmenButton}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.selectLinesmenButtonText}>Select Linesmen</Text>
            <FontAwesome name="user-plus" size={18} color="#000000" />
          </TouchableOpacity>
  
          {/* Display selected linesmen if any */}
          {selectedLinesmen.length > 0 && (
            <View style={styles.selectedLinesmenContainer}>
              {selectedLinesmen.map((item) => (
                <View key={item.value} style={styles.selectedLinesman}>
                  <FontAwesome name="user" size={14} color="#000000" style={styles.userIcon} />
                  <Text style={styles.selectedLinesmanText}>{item.label}</Text>
                  <TouchableOpacity onPress={() => toggleLinesman(item)}>
                    <FontAwesome name="times-circle" size={16} color="#666" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
          
          {/* Show message when no linesmen are selected */}
          {selectedLinesmen.length === 0 && (
            <View style={styles.noLinesmenContainer}>
              <Text style={styles.noLinesmenText}>No linesmen assigned yet</Text>
            </View>
          )}
  
          {/* Assign Task Button - always visible */}
          <TouchableOpacity
            style={[
              styles.assignTaskButton, 
              assigningTask && styles.disabledButton,
              selectedLinesmen.length === 0 && styles.warningButton
            ]}
            onPress={assignTask}
            disabled={assigningTask}
          >
            {assigningTask ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <>
                <Text style={styles.assignTaskButtonText}>
                  {selectedLinesmen.length === 0 
                    ? "Select Linesmen to Assign Task" 
                    : "Assign Task"
                  }
                </Text>
                <FontAwesome 
                  name={selectedLinesmen.length === 0 ? "exclamation-circle" : "tasks"} 
                  size={16} 
                  color="white" 
                  style={styles.assignTaskIcon} 
                />
              </>
            )}
          </TouchableOpacity>
        </>
      ),
    },
  ], [report, updates, reportStatus, selectedLinesmen, statusUpdate, getStatusColor, toggleLinesman, sendUpdate, handleStatusUpdate, getTextColor, assignTask, assigningTask]);

  // Memoize modal content - Linesmen selection
  const renderLinesmenModalContent = useMemo(() => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Linesmen</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <FontAwesome name="times" size={24} color="#000000" />
            </TouchableOpacity>
          </View>

          <Text style={styles.modalSubtitle}>Select linesmen to assign:</Text>

          {loadingLinesmen ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#000000" />
              <Text style={styles.loadingText}>Loading linesmen data...</Text>
            </View>
          ) : linesmenError ? (
            <View style={styles.errorContainer}>
              <FontAwesome name="exclamation-triangle" size={24} color="#FF3B30" />
              <Text style={styles.errorText}>{linesmenError}</Text>
              <TouchableOpacity
                style={styles.retryButton}
                onPress={() => {
                  // Reusing the useEffect logic to refetch
                  setLinesmen([]);
                  setLoadingLinesmen(true);
                  setLinesmenError(null);

                  fetch('https://streetlightfix-backend-1.onrender.com/admin/linemen/13')
                    .then(response => {
                      if (!response.ok) throw new Error('Failed to fetch linesmen');
                      return response.json();
                    })
                    .then(data => {
                      const formattedLinesmen = data.map(lineman => ({
                        label: lineman.Lineman_Name,
                        value: lineman.linemen_id.toString(),
                        areaId: lineman.area_id,
                        subdivisionId: lineman.subdivision_id
                      }));
                      setLinesmen(formattedLinesmen);

                      // Re-preselect linesmen if needed
                      if (report.assignedLinesmen && report.assignedLinesmen[0]?.id) {
                        const assignedIds = report.assignedLinesmen[0].id;
                        const preselectedLinesmen = formattedLinesmen.filter(linesman =>
                          assignedIds.includes(parseInt(linesman.value))
                        );
                        if (preselectedLinesmen.length > 0) {
                          setSelectedLinesmen(preselectedLinesmen);
                        }
                      }
                    })
                    .catch(error => {
                      console.error("Retry failed:", error);
                      setLinesmenError("Failed to load linesmen data. Please try again later.");
                    })
                    .finally(() => {
                      setLoadingLinesmen(false);
                    });
                }}
              >
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : linesmen.length === 0 ? (
            <View style={styles.emptyLinesmenContainer}>
              <FontAwesome name="user-times" size={24} color="#999" />
              <Text style={styles.emptyLinesmenText}>No linesmen available for this area</Text>
            </View>
          ) : (
            <FlatList
              data={linesmen}
              renderItem={({ item }) => {
                const isSelected = selectedLinesmen.some((l) => l.value === item.value);
                return (
                  <TouchableOpacity
                    style={[styles.linesmanItem, isSelected && styles.selectedLinesmanItem]}
                    onPress={() => toggleLinesman(item)}
                  >
                    <View style={styles.linesmanInfo}>
                      <FontAwesome
                        name="user-circle"
                        size={24}
                        color={isSelected ? "#000" : "#999"}
                        style={styles.linesmanIcon}
                      />
                      <Text style={styles.linesmanItemText}>{item.label}</Text>
                    </View>
                    {isSelected ? (
                      <FontAwesome name="check-circle" size={24} color="#34C759" />
                    ) : (
                      <View style={styles.uncheckedCircle} />
                    )}
                  </TouchableOpacity>
                );
              }}
              keyExtractor={(item) => `linesman-${item.value}`}
              removeClippedSubviews={true}
              initialNumToRender={10}
            />
          )}

          <View style={styles.modalButtonsContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.doneButton, loadingLinesmen && styles.disabledButton]}
              onPress={() => {
                // Check if linesmen were previously selected and now all are deselected
                if (originalAssignedLinesmen.length > 0 && selectedLinesmen.length === 0) {
                  
                  // Show confirmation dialog with custom alert
                  showAlert({
                    type: 'warning',
                    title: "Unassign Task",
                    message: "Are you sure you want to unassign all linesmen from this task?",
                    buttons: [
                      {
                        text: "Cancel",
                        style: "cancel",
                        onPress: () => {
                          // Reset the selection to the original state
                          setSelectedLinesmen(originalAssignedLinesmen);
                        }
                      },
                      {
                        text: "Yes, Unassign",
                        style: "destructive",
                        onPress: unassignTask
                      }
                    ]
                  });
                } else {
                  // If linesmen selection changed, but not unassigned completely
                  if (hasLinesmenSelectionChanged() && selectedLinesmen.length > 0) {
                    // Use custom alert for assignment update dialog
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
                    // Just close the modal if no significant changes
                    setModalVisible(false);
                  }
                }
              }}
              disabled={loadingLinesmen}
            >
              <Text style={styles.doneButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  ), [modalVisible, linesmen, selectedLinesmen, toggleLinesman, loadingLinesmen, linesmenError, report.assignedLinesmen, originalAssignedLinesmen, unassignTask, hasLinesmenSelectionChanged, assignTask, showAlert]);

  // Memoize status modal content
  const renderStatusModalContent = useMemo(() => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={statusModalVisible}
      onRequestClose={() => setStatusModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.statusModalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Update Report Status</Text>
            <TouchableOpacity onPress={() => setStatusModalVisible(false)}>
              <FontAwesome name="times" size={24} color="#000000" />
            </TouchableOpacity>
          </View>

          <Text style={styles.statusModalDescription}>
            Select the current status of this report:
          </Text>

          <View style={styles.statusOptionsList}>
            {statusOptions.map((option) => {
              // Determine if this option should be disabled
              const isOpenOption = option.value === "Open";
              const shouldDisableOpen = isOpenOption && selectedLinesmen.length > 0;
              
              // Determine if Closed should be disabled (when not resolved)
              const isClosedOption = option.label.toLowerCase() === "closed";
              const shouldDisableClosed = isClosedOption && reportStatus.toLowerCase() !== "resolved";
              
              return (
                <TouchableOpacity
                  key={`status-option-${option.value}`}
                  style={[
                    styles.statusOption,
                    { borderColor: (shouldDisableOpen || shouldDisableClosed) ? "#ccc" : option.color },
                    reportStatus.toLowerCase() === option.label.toLowerCase() && {
                      backgroundColor: option.color,
                      borderWidth: 0,
                    },
                    (shouldDisableOpen || shouldDisableClosed) && styles.disabledStatusOption
                  ]}
                  onPress={() => onStatusOptionPress(option)}
                  disabled={shouldDisableOpen || shouldDisableClosed}
                >
                  <Text
                    style={[
                      styles.statusOptionText,
                      {
                        color: reportStatus.toLowerCase() === option.label.toLowerCase() ?
                          getTextColor(option.color) : ((shouldDisableOpen || shouldDisableClosed) ? "#ccc" : option.color)
                      }
                    ]}
                  >
                    {option.label}
                  </Text>
                  {reportStatus.toLowerCase() === option.label.toLowerCase() && (
                    <FontAwesome
                      name="check"
                      size={16}
                      color={getTextColor(option.color)}
                      style={styles.statusCheckIcon}
                    />
                  )}
                  {shouldDisableOpen && (
                    <View style={styles.disabledStatusOverlay}>
                      <FontAwesome name="ban" size={16} color="#FF3B30" style={styles.disabledStatusIcon} />
                      <Text style={styles.disabledStatusText}>
                        Not available with assigned linesmen
                      </Text>
                    </View>
                  )}
                  {shouldDisableClosed && (
                    <View style={styles.disabledStatusOverlay}>
                      <FontAwesome name="ban" size={16} color="#FF3B30" style={styles.disabledStatusIcon} />
                      <Text style={styles.disabledStatusText}>
                        Must be resolved first
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {(reportStatus.toLowerCase() === "resolved" || reportStatus.toLowerCase() === "closed") && (
            <View style={styles.warningContainer}>
              <FontAwesome name="exclamation-circle" size={16} color="#FF3B30" style={styles.warningIcon} />
              <Text style={styles.warningText}>
                This will close the report and notify the user.
              </Text>
            </View>
          )}

          <View style={styles.statusModalButtonsContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setStatusModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.updateStatusButton}
              onPress={() => updateReportStatus(reportStatus)}
              disabled={updatingStatus}
            >
              {updatingStatus ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text style={styles.updateStatusButtonText}>Update Status</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  ), [statusModalVisible, reportStatus, statusOptions, updateReportStatus, updatingStatus, getTextColor, selectedLinesmen, onStatusOptionPress]);

  // Memoize resolution proof modal content
  const renderResolutionProofModal = useMemo(() => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showResolutionModal}
      onRequestClose={() => {
        setShowResolutionModal(false);
        setSelectedStatusToUpdate(null);
      }}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.resolutionModalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Resolution Proof Required</Text>
            <TouchableOpacity onPress={() => {
              setShowResolutionModal(false);
              setSelectedStatusToUpdate(null);
            }}>
              <FontAwesome name="times" size={24} color="#000000" />
            </TouchableOpacity>
          </View>

          <Text style={styles.resolutionDescription}>
            Please provide proof of resolution before marking this issue as resolved:
          </Text>

          <TextInput
            style={styles.resolutionInput}
            value={resolutionProof}
            onChangeText={setResolutionProof}
            placeholder="Describe how this issue was resolved..."
            multiline
            numberOfLines={4}
          />

          {/* Image upload option would go here in a future version */}
          <View style={styles.imageUploadPlaceholder}>
            <FontAwesome name="camera" size={24} color="#999" />
            <Text style={styles.imageUploadText}>
              Photo upload coming soon
            </Text>
          </View>

          <View style={styles.modalButtonsContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setShowResolutionModal(false);
                setSelectedStatusToUpdate(null);
                setResolutionProof("");
              }}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.resolveButton, 
                !resolutionProof.trim() && styles.disabledButton
              ]}
              onPress={() => {
                if (resolutionProof.trim()) {
                  performStatusUpdate(selectedStatusToUpdate, resolutionProof);
                } else {
                  // Use custom alert for validation error
                  showAlert({
                    type: 'warning',
                    title: "Resolution Proof Required",
                    message: "Please provide details about how this issue was resolved.",
                    buttons: [{ text: "OK" }]
                  });
                }
              }}
              disabled={!resolutionProof.trim() || updatingStatus}
            >
              {updatingStatus ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text style={styles.resolveButtonText}>Submit & Resolve</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  ), [showResolutionModal, resolutionProof, selectedStatusToUpdate, updatingStatus, performStatusUpdate, showAlert]);

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
      {renderLinesmenModalContent}
      {renderStatusModalContent}
      {renderResolutionProofModal}
    </View>
  );
});

export default ReportDetail;