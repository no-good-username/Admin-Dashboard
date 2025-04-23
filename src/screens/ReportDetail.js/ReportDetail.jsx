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
  Alert,
  ActivityIndicator
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
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
  return (
    <View style={styles.updateItem}>
      <Text style={styles.updateText}>{item.text}</Text>
      <Text style={styles.updateTimestamp}>
        {new Date(item.timestamp).toLocaleString()}
      </Text>
    </View>
  );
});

const ReportDetail = React.memo(({ route, navigation }) => {
  const { report } = route.params;
  const [statusUpdate, setStatusUpdate] = useState("");
  const [updates, setUpdates] = useState(report.updates || []);
  const [selectedLinesmen, setSelectedLinesmen] = useState(
    report.assignedLinesmen || []
  );
  const [reportStatus, setReportStatus] = useState(report.status || "Open");
  const [modalVisible, setModalVisible] = useState(false);
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [assigningTask, setAssigningTask] = useState(false);

  // Memoize linesmen data to prevent recreation on every render
  const linesmen = useMemo(() => [
    { label: "John Doe", value: "1" },
    { label: "Jane Smith", value: "2" },
    { label: "Mike Johnson", value: "3" },
    { label: "Emily Brown", value: "4" },
  ], []);

  // Status options for the report
  const statusOptions = useMemo(() => [
    { label: "Open", value: "open", color: "#FF9500" },
    { label: "In Progress", value: "in progress", color: "#007AFF" },
    { label: "Resolved", value: "resolved", color: "#34C759" },
    { label: "Cannot Fix", value: "cannot fix", color: "#FF3B30" },
  ], []);

  // Assign task to selected linesmen and update status to "In Progress"
  const assignTask = useCallback(() => {
    if (selectedLinesmen.length === 0) {
      Alert.alert("Error", "Please select at least one linesman before assigning a task.");
      return;
    }

    setAssigningTask(true);

    // In a real app, you would make an API call here
    // This is a simulated API call
    setTimeout(() => {
      // Update the report status to "In Progress"
      setReportStatus("In Progress");
      
      // Add an update about the task assignment
      const assigneeNames = selectedLinesmen.map(l => l.label).join(", ");
      const updateText = `Task assigned to ${assigneeNames}. Report status updated to In Progress.`;
      
      const newUpdate = {
        id: Date.now().toString(),
        text: updateText,
        timestamp: new Date().toISOString(),
      };
      
      setUpdates(prevUpdates => [newUpdate, ...prevUpdates]);
      setAssigningTask(false);
      
      // Optionally, close the linesmen selection modal if open
      setModalVisible(false);

      // Notification
      Alert.alert(
        "Task Assigned",
        `Task has been assigned to the selected linesmen and status updated to In Progress.`,
        [{ text: "OK" }]
      );
    }, 800);
  }, [selectedLinesmen]);

  // Update the report status
  const updateReportStatus = useCallback((status) => {
    setUpdatingStatus(true);
    
    // In a real app, you would make an API call here
    // This is a simulated API call
    setTimeout(() => {
      setReportStatus(status);
      setStatusModalVisible(false);
      setUpdatingStatus(false);
      
      // Add an update about the status change
      const updateText = `Report status updated to: ${status}`;
      
      const newUpdate = {
        id: Date.now().toString() + "-status",
        text: updateText,
        timestamp: new Date().toISOString(),
      };
      
      setUpdates(prevUpdates => [newUpdate, ...prevUpdates]);
      
      // Notify the user if the issue is resolved or cannot be fixed
      if (status.toLowerCase() === "resolved" || status.toLowerCase() === "cannot fix") {
        Alert.alert(
          "Report Closed",
          `This report has been marked as ${status}. A notification has been sent to the user.`,
          [{ text: "OK" }]
        );
      }
    }, 500);
  }, []);

  // Memoized function to send updates
  const sendUpdate = useCallback(() => {
    if (statusUpdate.trim()) {
      const newUpdate = {
        id: Date.now().toString(),
        text: statusUpdate,
        timestamp: new Date().toISOString(),
      };
      
      // Optimistic update
      setUpdates(prevUpdates => [newUpdate, ...prevUpdates]);
      
      fetch(`https://streetlightfix-backend-1.onrender.com/admin/report/statusMessages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          report_id: parseInt(report.id), // Convert to integer
          je_id: 1, // Assuming a default JE ID or you can get it from context/state
          message: statusUpdate.trim()
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
      });
    }
  }, [statusUpdate, report.id]);

  // Handle status update input
  const handleStatusUpdate = useCallback((text) => {
    setStatusUpdate(text);
  }, []);

  // Memoized toggle linesmen function
  const toggleLinesman = useCallback((item) => {
    setSelectedLinesmen((current) =>
      current.some((l) => l.value === item.value)
        ? current.filter((l) => l.value !== item.value)
        : [...current, item]
    );
  }, []);

  // Memoize status color function
  const getStatusColor = useCallback((status) => {
    const statusOption = statusOptions.find(option => 
      option.value.toLowerCase() === (status?.toLowerCase() || "open")
    );
    return statusOption?.color || "#FF9500";
  }, [statusOptions]);

  // Get text color based on background color for better contrast
  const getTextColor = useCallback((backgroundColor) => {
    // Simple contrast check - use white text on dark backgrounds
    const darkColors = ["#007AFF", "#000000", "#FF3B30"];
    return darkColors.includes(backgroundColor) ? "#FFFFFF" : "#000000";
  }, []);

  // Memoize sections to prevent recreating on every render
  const sections = useMemo(() => [
    {
      title: "ReportInfo",
      data: [{ id: "reportInfo" }],
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
      data: updates.length > 0 ? updates : [{ id: "empty", isEmpty: true }],
      renderItem: ({ item }) => <UpdateItem item={item} />,
    },
    {
      title: "Assign Linesmen",
      data: [{ id: "linesmen" }],
      renderItem: () => (
        <>
          <TouchableOpacity
            style={styles.selectLinesmenButton}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.selectLinesmenButtonText}>Select Linesmen</Text>
            <FontAwesome name="user-plus" size={18} color="#000000" />
          </TouchableOpacity>

          {selectedLinesmen.length > 0 ? (
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
              
              {/* Assign Task Button */}
              <TouchableOpacity
                style={[styles.assignTaskButton, assigningTask && styles.disabledButton]}
                onPress={assignTask}
                disabled={assigningTask}
              >
                {assigningTask ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <>
                    <Text style={styles.assignTaskButtonText}>Assign Task</Text>
                    <FontAwesome name="tasks" size={16} color="white" style={styles.assignTaskIcon} />
                  </>
                )}
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.noLinesmenContainer}>
              <Text style={styles.noLinesmenText}>No linesmen assigned yet</Text>
            </View>
          )}
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
            keyExtractor={(item) => item.value}
            removeClippedSubviews={true}
            initialNumToRender={10}
          />

          <View style={styles.modalButtonsContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          
            <TouchableOpacity
              style={styles.doneButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.doneButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  ), [modalVisible, linesmen, selectedLinesmen, toggleLinesman]);

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
            {statusOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.statusOption, 
                  { borderColor: option.color },
                  reportStatus.toLowerCase() === option.value && { 
                    backgroundColor: option.color,
                    borderWidth: 0,
                  }
                ]}
                onPress={() => updateReportStatus(option.label)}
              >
                <Text 
                  style={[
                    styles.statusOptionText, 
                    { color: reportStatus.toLowerCase() === option.value ? 
                      getTextColor(option.color) : option.color 
                    }
                  ]}
                >
                  {option.label}
                </Text>
                {reportStatus.toLowerCase() === option.value && (
                  <FontAwesome 
                    name="check" 
                    size={16} 
                    color={getTextColor(option.color)} 
                    style={styles.statusCheckIcon}
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>

          {(reportStatus.toLowerCase() === "resolved" || reportStatus.toLowerCase() === "cannot fix") && (
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
  ), [statusModalVisible, reportStatus, statusOptions, updateReportStatus, updatingStatus, getTextColor]);

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
    </View>
  );
});

export default ReportDetail;