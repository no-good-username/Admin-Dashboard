import React from "react";
import { 
  View, 
  Text, 
  Modal, 
  TouchableOpacity, 
  TextInput,
  ActivityIndicator
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useAlert } from "../../../context/AlertContext";
import styles from "../styles";

const ResolutionProofForm = ({
  isVisible,
  onClose,
  resolutionProof,
  setResolutionProof,
  onSubmit,
  selectedStatus,
  isLoading
}) => {
  const { showAlert } = useAlert();
  
  const handleCancel = () => {
    onClose();
    setResolutionProof("");
  };
  
  const handleSubmit = () => {
    if (resolutionProof.trim()) {
      onSubmit(selectedStatus, resolutionProof);
    } else {
      showAlert({
        type: 'warning',
        title: "Resolution Proof Required",
        message: "Please provide details about how this issue was resolved.",
        buttons: [{ text: "OK" }]
      });
    }
  };
  
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={handleCancel}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.resolutionModalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Resolution Proof Required</Text>
            <TouchableOpacity onPress={handleCancel}>
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
              onPress={handleCancel}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.resolveButton, 
                !resolutionProof.trim() && styles.disabledButton
              ]}
              onPress={handleSubmit}
              disabled={!resolutionProof.trim() || isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text style={styles.resolveButtonText}>Submit & Resolve</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ResolutionProofForm;