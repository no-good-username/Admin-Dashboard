import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import styles from "../styles";

const ReportInfo = ({
  report,
  statusUpdate,
  handleStatusUpdate,
  sendUpdate,
  reportStatus,
  getStatusColor,
  getTextColor,
  onStatusPress
}) => {
  return (
    <>
      <View style={styles.reportCard}>
        <View style={styles.reportHeader}>
          <Text style={styles.title}>{report.issue}</Text>
          <TouchableOpacity
            style={[styles.statusBadge, { backgroundColor: getStatusColor(reportStatus) }]}
            onPress={onStatusPress}
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
  );
};

export default ReportInfo;