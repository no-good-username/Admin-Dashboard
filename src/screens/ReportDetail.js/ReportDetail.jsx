// screens/ReportDetail/ReportDetail.js
import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Modal,
  SectionList,
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
  console.log(report)
  const [linemen, setLinemen] = useState([""]);
  const [statusUpdate, setStatusUpdate] = useState("");
  const [updates, setUpdates] = useState(report.updates || []);
  const [selectedLinesmen, setSelectedLinesmen] = useState(
    report.assignedLinesmen || []
  );
  const areaid = report.areaid;
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchLinemen = async () => {
      // console.log("Fetching linemen for area:", areaid); // Debugging log
  
      // if (!areaid) {
      //   console.error("Area ID is undefined. Cannot fetch linemen.");
      //   return;
      // }
  
      setIsLoading(true);
  
      try {
        // console.log("area id is:", areaid);
        const response = await fetch(
          `http://streetlightfix-backend-1.onrender.com/admin/linemen/13`
        );
  
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status} ${response.statusText}`);
        }
  
        const data = await response.json();
        console.log("Fetched linemen data:", data); // Debugging log
        

        if (!Array.isArray(data)) {
          throw new Error("Invalid data format: Expected an array.");
        }
  
        const formattedLinemen = data.map((item) => ({
          label: item.Lineman_Name, // Name of lineman
          value: String(item.linemen_id), // Convert ID to string for consistency
        }));

        setLinemen(formattedLinemen);
      } catch (error) {
        console.error("Error fetching linemen:", error);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchLinemen();
  }, []);
  //, [areaid]);
  
  
  // Memoize linesmen data to prevent recreation on every render
  const linesmen = useMemo(() => [
    { label: "John Doe", value: "1" },
    { label: "Jane Smith", value: "2" },
    { label: "Mike Johnson", value: "3" },
    { label: "Emily Brown", value: "4" },
  ], []);

  // Fetch updates when component mounts
  // useEffect(() => {
  //   const fetchUpdates = async () => {
  //     setIsLoading(true);
  //     try {
  //       // Replace with your actual API endpoint
  //       const response = await fetch(
  //         `https://streetlightfix-backend-1.onrender.com/admin/report/${report.id}/updates`
  //       );
        
  //       if (response.ok) {
  //         const data = await response.json();
  //         setUpdates(data);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching updates:", error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   fetchUpdates();
  // }, [report.id]);

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
      // setStatusUpdate("");
      console.log("this is the message:",statusUpdate);
      
      fetch(`http://192.168.0.14:3000/admin/report/statusMessages`, {
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
          console.log(response);
          
          throw new Error('Failed to send update');
        }
        setStatusUpdate("");
        // console.log(response.json());
      })
      .catch(error => {
        console.error("Failed to save update:", error);
        console.log(error);
        // Rollback on error
        setUpdates(prevUpdates => prevUpdates.filter(update => update.id !== newUpdate.id));
      });
    }
  }, [statusUpdate, report.id]);

  // Removed the debounce mechanism to make the input more responsive
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
    switch (status?.toLowerCase()) {
      case "open":
        return "#FF9500"; // Orange
      case "in progress":
        return "#007AFF"; // Blue
      case "completed":
        return "#34C759"; // Green
      default:
        return "#FF9500"; // Default to orange
    }
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
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(report.status) }]}>
                <Text style={styles.statusText}>{report.status}</Text>
              </View>
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
            </View>
          ) : (
            <View style={styles.noLinesmenContainer}>
              <Text style={styles.noLinesmenText}>No linesmen assigned yet</Text>
            </View>
          )}
        </>
      ),
    },
  ], [report, updates, selectedLinesmen, statusUpdate, getStatusColor, toggleLinesman, sendUpdate, handleStatusUpdate]);

  // Memoize modal content
  const renderModalContent = useMemo(() => (
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

          <FlatList
            data={linemen}
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

          <TouchableOpacity
            style={styles.doneButton}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.doneButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  ), [modalVisible, linesmen, selectedLinesmen, toggleLinesman]);

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
      {renderModalContent}
    </View>
  );
});

export default ReportDetail;
