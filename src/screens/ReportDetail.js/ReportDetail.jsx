// screens/ReportDetail/ReportDetail.js
import React, { useState, useRef } from "react";
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

const ReportDetail = ({ route }) => {
  const { report } = route.params;
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

  // Prepare data for SectionList
  const sections = [
    {
      title: "ReportInfo",
      data: [{ id: "reportInfo" }],
      renderItem: () => (
        <>
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
        </>
      ),
    },
    {
      title: "Updates",
      data: updates.length > 0 ? updates : [{ id: "empty", isEmpty: true }],
      renderItem: ({ item }) => {
        if (item.isEmpty) {
          return (
            <Text style={styles.emptyListText}>
              No updates sent to the user yet.
            </Text>
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
      },
    },
    {
      title: "Linesmen",
      data: [{ id: "linesmen" }],
      renderItem: () => (
        <>
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
        </>
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
      />

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
    </View>
  );
};

export default ReportDetail;