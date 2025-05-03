import React from "react";
import { 
  View, 
  Text, 
  Modal, 
  TouchableOpacity, 
  FlatList, 
  ActivityIndicator 
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import styles from "../styles";

const LinesmenSelector = ({
  isVisible,
  onClose,
  linesmen,
  selectedLinesmen,
  toggleLinesman,
  isLoading,
  error,
  onRetry,
  onDone,
  onCancel
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Linesmen</Text>
            <TouchableOpacity onPress={onClose}>
              <FontAwesome name="times" size={24} color="#000000" />
            </TouchableOpacity>
          </View>

          <Text style={styles.modalSubtitle}>Select linesmen to assign:</Text>

          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#000000" />
              <Text style={styles.loadingText}>Loading linesmen data...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <FontAwesome name="exclamation-triangle" size={24} color="#FF3B30" />
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity
                style={styles.retryButton}
                onPress={onRetry}
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
              onPress={onCancel}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.doneButton, isLoading && styles.disabledButton]}
              onPress={onDone}
              disabled={isLoading}
            >
              <Text style={styles.doneButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default LinesmenSelector;