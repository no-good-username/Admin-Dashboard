import React, { useState } from "react";
import { 
  View, 
  Text, 
  Modal, 
  TouchableOpacity, 
  TextInput,
  ActivityIndicator,
  Image,
  Platform,
  ScrollView
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useAlert } from "../../../context/AlertContext";
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { uploadImage } from "../services/supabaseStorage";
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
  const [image, setImage] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  const handleCancel = () => {
    onClose();
    setResolutionProof("");
    setImage(null);
  };
  
  const handleSubmit = async () => {
    if (!resolutionProof.trim()) {
      showAlert({
        type: 'warning',
        title: "Resolution Proof Required",
        message: "Please provide details about how this issue was resolved.",
        buttons: [{ text: "OK" }]
      });
      return;
    }
    
    try {
      setUploadingImage(true);
      let imageUrl = null;
      
      // Upload image if one is selected
      if (image) {
        imageUrl = await uploadImage(image);
      }
      
      // Pass both text and image URL to parent component
      onSubmit(selectedStatus, resolutionProof, imageUrl);
      
    } catch (error) {
      console.error('Error during submission:', error);
      showAlert({
        type: 'error',
        title: "Submission Error",
        message: "There was a problem uploading your image. Please try again.",
        buttons: [{ text: "OK" }]
      });
    } finally {
      setUploadingImage(false);
    }
  };
  
  const pickImage = async () => {
    try {
      // Request permission
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        showAlert({
          type: 'warning',
          title: "Permission Required",
          message: "We need access to your photos to upload an image.",
          buttons: [{ text: "OK" }]
        });
        return;
      }
      
      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });
      
      if (!result.canceled && result.assets && result.assets[0]) {
        // Compress the image
        const compressed = await compressImage(result.assets[0].uri);
        setImage(compressed);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      showAlert({
        type: 'error',
        title: "Image Selection Failed",
        message: "There was a problem selecting your image. Please try again.",
        buttons: [{ text: "OK" }]
      });
    }
  };
  
  const takePhoto = async () => {
    try {
      // Request permission
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      
      if (status !== 'granted') {
        showAlert({
          type: 'warning',
          title: "Permission Required",
          message: "We need access to your camera to take a photo.",
          buttons: [{ text: "OK" }]
        });
        return;
      }
      
      // Launch camera
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });
      
      if (!result.canceled && result.assets && result.assets[0]) {
        // Compress the image
        const compressed = await compressImage(result.assets[0].uri);
        setImage(compressed);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      showAlert({
        type: 'error',
        title: "Camera Error",
        message: "There was a problem taking your photo. Please try again.",
        buttons: [{ text: "OK" }]
      });
    }
  };
  
  const compressImage = async (uri) => {
    try {
      // Resize and compress the image
      const manipResult = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 800 } }], // Resize to max width of 800px
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
      );
      return manipResult;
    } catch (error) {
      console.error('Error compressing image:', error);
      // Return original image if compression fails
      return { uri };
    }
  };
  
  const removeImage = () => {
    setImage(null);
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
          <ScrollView contentContainerStyle={styles.scrollContent}>
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

            {/* Image Preview */}
            {image && (
              <View style={styles.imagePreviewContainer}>
                <Image source={{ uri: image.uri }} style={styles.imagePreview} />
                <TouchableOpacity 
                  style={styles.removeImageButton} 
                  onPress={removeImage}
                >
                  <FontAwesome name="times-circle" size={24} color="#FF3B30" />
                </TouchableOpacity>
              </View>
            )}

            {/* Image Upload Options */}
            {!image ? (
              <View style={styles.imageUploadOptions}>
                <TouchableOpacity 
                  style={styles.imageOptionButton} 
                  onPress={pickImage}
                >
                  <FontAwesome name="photo" size={24} color="#007AFF" />
                  <Text style={styles.imageOptionText}>Choose Photo</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.imageOptionButton} 
                  onPress={takePhoto}
                >
                  <FontAwesome name="camera" size={24} color="#007AFF" />
                  <Text style={styles.imageOptionText}>Take Photo</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity 
                style={styles.changeImageButton} 
                onPress={pickImage}
              >
                <FontAwesome name="exchange" size={16} color="#007AFF" />
                <Text style={styles.changeImageText}>Change Photo</Text>
              </TouchableOpacity>
            )}

            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCancel}
                disabled={isLoading || uploadingImage}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.resolveButton, 
                  (!resolutionProof.trim() || isLoading || uploadingImage) && styles.disabledButton
                ]}
                onPress={handleSubmit}
                disabled={!resolutionProof.trim() || isLoading || uploadingImage}
              >
                {isLoading || uploadingImage ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text style={styles.resolveButtonText}>Submit & Resolve</Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default ResolutionProofForm;