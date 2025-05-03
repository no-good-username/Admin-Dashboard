import React from "react";
import { View, Text } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import styles from "../styles";

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

export default UpdateItem;