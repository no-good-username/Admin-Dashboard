// screens/ReportDetail/ReportDetail.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Modal,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import styles from "./styles";

const ReportDetail = ({ route }) => {
  
  const { report } = route.params;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const id = report.id;
  console.log("id is ",id);
  useEffect(() => {
      async function fetchData() {
        try {
          const response = await fetch("https://streetlightfix-backend-1.onrender.com/admin//singlereport/"+id,)
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const result = await response.json();
          setData(result);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      }
      fetchData();
    }, []);
  const [statusUpdate, setStatusUpdate] = useState("");
  const [updates, setUpdates] = useState(report.updates || []);
  const [selectedLinesmen, setSelectedLinesmen] = useState(
    report.assignedLinesmen || []
  );
  const [modalVisible, setModalVisible] = useState(false);

  const linesmen = [
    { label: "John Doe", value: "1" },
    { label: "Jane Smith", value: "2" },
    { label: "Mike Johnson", value: "3" },
    { label: "Emily Brown", value: "4" },
  ];

  const sendUpdate = () => {
    if (statusUpdate.trim()) {
      const newUpdate = {
        id: Date.now().toString(),
        text: statusUpdate,
        timestamp: new Date().toISOString(),
      };
      setUpdates([newUpdate, ...updates]);
      setStatusUpdate("");
    }
  };

  const toggleLinesman = (item) => {
    setSelectedLinesmen((current) =>
      current.some((l) => l.value === item.value)
        ? current.filter((l) => l.value !== item.value)
        : [...current, item]
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <Text style={styles.title}>{report.issue}</Text>
      <Text style={styles.description}>{report.description}</Text>

      {/* Placeholder for image */}
      <View
        style={{
          width: "100%",
          height: 200,
          backgroundColor: "#E0E0E0",
          borderRadius: 10,
          marginBottom: 20,
        }}
      />

      <View style={styles.updateContainer}>
        <TextInput
          style={styles.input}
          value={statusUpdate}
          onChangeText={setStatusUpdate}
          placeholder="Send an update to the user..."
          multiline
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendUpdate}>
          <FontAwesome name="send" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Updates</Text>
      <FlatList
        data={updates}
        renderItem={({ item }) => (
          <View style={styles.updateItem}>
            <Text style={styles.updateText}>{item.text}</Text>
            <Text style={styles.updateTimestamp}>
              {new Date(item.timestamp).toLocaleString()}
            </Text>
          </View>
        )}
        keyExtractor={(item) => item.id}
        style={styles.updatesList}
        nestedScrollEnabled
        ListEmptyComponent={
          <Text style={styles.emptyListText}>
            No updates sent to the user yet.
          </Text>
        }
      />

      <Text style={styles.sectionTitle}>Assign Linesmen</Text>
      <TouchableOpacity
        style={styles.selectLinesmenButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.selectLinesmenButtonText}>Select Linesmen</Text>
        <FontAwesome name="user-plus" size={20} color="#000000" />
      </TouchableOpacity>

      {/* Render selected linesmen as pill-shaped items */}
      <View style={styles.selectedLinesmenContainer}>
        {selectedLinesmen.map((item) => (
          <View key={item.value} style={styles.selectedLinesman}>
            <Text style={styles.selectedLinesmanText}>{item.label}</Text>
            <TouchableOpacity onPress={() => toggleLinesman(item)}>
              <FontAwesome name="times" size={18} color="#000000" />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Linesmen Selection Modal */}
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
              data={linesmen}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.linesmanItem}
                  onPress={() => toggleLinesman(item)}
                >
                  <Text style={styles.linesmanItemText}>{item.label}</Text>
                  {selectedLinesmen.some((l) => l.value === item.value) ? (
                    <FontAwesome
                      name="check-circle"
                      size={24}
                      color="#000000"
                    />
                  ) : (
                    <View style={styles.uncheckedCircle} />
                  )}
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.value}
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
    </ScrollView>
  );
};

export default ReportDetail;
