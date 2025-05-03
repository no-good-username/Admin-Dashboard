import React from "react";
import { 
  View, 
  Text, 
  Modal, 
  TouchableOpacity, 
  ActivityIndicator 
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import styles from "../styles";

const StatusSelector = ({
  isVisible,
  onClose,
  statusOptions,
  currentStatus,
  onStatusPress,
  onUpdateStatus,
  selectedLinesmen,
  isLoading,
  getTextColor
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.statusModalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Update Report Status</Text>
            <TouchableOpacity onPress={onClose}>
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
              const shouldDisableClosed = isClosedOption && currentStatus.toLowerCase() !== "resolved";
              
              return (
                <TouchableOpacity
                  key={`status-option-${option.value}`}
                  style={[
                    styles.statusOption,
                    { borderColor: (shouldDisableOpen || shouldDisableClosed) ? "#ccc" : option.color },
                    currentStatus.toLowerCase() === option.label.toLowerCase() && {
                      backgroundColor: option.color,
                      borderWidth: 0,
                    },
                    (shouldDisableOpen || shouldDisableClosed) && styles.disabledStatusOption
                  ]}
                  onPress={() => onStatusPress(option)}
                  disabled={shouldDisableOpen || shouldDisableClosed}
                >
                  <Text
                    style={[
                      styles.statusOptionText,
                      {
                        color: currentStatus.toLowerCase() === option.label.toLowerCase() ?
                          getTextColor(option.color) : ((shouldDisableOpen || shouldDisableClosed) ? "#ccc" : option.color)
                      }
                    ]}
                  >
                    {option.label}
                  </Text>
                  {currentStatus.toLowerCase() === option.label.toLowerCase() && (
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

          {(currentStatus.toLowerCase() === "resolved" || currentStatus.toLowerCase() === "closed") && (
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
              onPress={onClose}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.updateStatusButton}
              onPress={() => onUpdateStatus(currentStatus)}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text style={styles.updateStatusButtonText}>Update Status</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default StatusSelector;