import React from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Linking, Platform } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import styles from "../styles";
import LazyImage from "../../../components/LazyImage";

const BASE_URL = "https://inouwxpbbzhdxtebzmpd.supabase.co/storage/v1/object/public/StreetLight_Images//";

const ReportInfo = ({
  report,
  statusUpdate,
  handleStatusUpdate,
  sendUpdate,
  reportStatus,
  getStatusColor,
  getTextColor,
  onStatusPress,
}) => {
  const imageUrl = report.imageUrl ? `${BASE_URL}${report.imageUrl}` : null;
  
  // Function to open location in maps app
  const openLocationInMaps = () => {
    const { latitude, longitude } = report;
    const location = report.location || "Unknown Location";
    
    // Check if we have coordinates, if not, try to use the location name for search
    let url;
    if (latitude && longitude) {
      // Use coordinates if available
      if (Platform.OS === 'ios') {
        url = `maps:0,0?q=${latitude},${longitude}`;
      } else {
        url = `geo:0,0?q=${latitude},${longitude}`;
      }
    } else {
      // If no coordinates, try to use the location name
      const query = encodeURIComponent(location);
      if (Platform.OS === 'ios') {
        url = `maps:0,0?q=${query}`;
      } else {
        url = `geo:0,0?q=${query}`;
      }
    }

    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(url);
        } else {
          // As a fallback, open Google Maps in browser
          const browserUrl = `https://www.google.com/maps/search/?api=1&query=${
            latitude && longitude ? `${latitude},${longitude}` : encodeURIComponent(location)
          }`;
          return Linking.openURL(browserUrl);
        }
      })
      .catch((error) => console.error('Error opening maps:', error));
  };
  
  return (
    <View style={styles.reportInfoContainer}>
      {/* Status Badge - Made more prominent at top */}
      <TouchableOpacity
        onPress={onStatusPress}
        style={[
          styles.enhancedStatusBadge,
          { backgroundColor: getStatusColor(reportStatus) },
        ]}
      >
        <FontAwesome 
          name={getStatusIcon(reportStatus)} 
          size={16} 
          color={getTextColor(getStatusColor(reportStatus))} 
          style={styles.statusIcon}
        />
        <Text
          style={[
            styles.enhancedStatusText,
            { color: getTextColor(getStatusColor(reportStatus)) },
          ]}
        >
          {reportStatus}
        </Text>
      </TouchableOpacity>

      {/* Title with improved typography */}
      <Text style={styles.enhancedReportTitle}>{report.issue}</Text>
      
      {/* Reporter Information Card */}
      <View style={styles.reporterCard}>
        <View style={styles.reporterHeader}>
          <FontAwesome name="user-circle" size={20} color="#333" />
          <Text style={styles.reporterCardTitle}>Reporter Details</Text>
        </View>
        
        <View style={styles.reporterInfo}>
          <View style={styles.reporterDetail}>
            <FontAwesome name="user" size={16} color="#555" />
            <Text style={styles.reporterDetailText}>
              {report.reportedBy || "Shivam Gadekar"}
            </Text>
          </View>
          
          <View style={styles.reporterDetail}>
            <FontAwesome name="phone" size={16} color="#555" />
            <Text style={styles.reporterDetailText}>
              {report.reporterPhone || "9270085305"}
            </Text>
          </View>
        </View>
      </View>
      
      {/* Street Light Image with loading indicator */}
      {imageUrl && (
        <View style={styles.enhancedImageContainer}>
          <LazyImage 
            source={{ uri: imageUrl }} 
            style={styles.enhancedReportImage}
            resizeMode="cover"
          />
        </View>
      )}

      {/* Description with styled container */}
      <View style={styles.descriptionContainer}>
        <Text style={styles.descriptionLabel}>DESCRIPTION</Text>
        <Text style={styles.enhancedReportDescription}>
          {report.description}
        </Text>
      </View>
      
      {/* Location details with styled card */}
      <View style={styles.locationCard}>
        <View style={styles.locationHeader}>
          <FontAwesome name="map" size={18} color="#333" />
          <Text style={styles.locationTitle}>Location Details</Text>
        </View>
        
        <View style={styles.detailRow}>
          <FontAwesome name="map-marker" size={16} color="#555" />
          <Text style={styles.detailText}>{report.location}</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.viewOnMapButton}
          onPress={openLocationInMaps}
        >
          <FontAwesome name="map-o" size={16} color="#ffffff" style={styles.mapButtonIcon} />
          <Text style={styles.viewOnMapButtonText}>View on Map</Text>
        </TouchableOpacity>
        
        <View style={styles.detailRow}>
          <FontAwesome name="calendar" size={16} color="#555" />
          <Text style={styles.detailText}>
            Reported on {report.date || "Unknown date"}
          </Text>
        </View>
      </View>

      <View style={styles.enhancedDivider} />

      {/* Improved update input area */}
      <View style={styles.updateSectionContainer}>
        <Text style={styles.updateSectionTitle}>Send Status Update</Text>
        
        <TextInput
          style={styles.enhancedUpdateInput}
          placeholder="Add a status update for the reporter..."
          value={statusUpdate}
          onChangeText={handleStatusUpdate}
          multiline
          placeholderTextColor="#999"
        />
        
        <TouchableOpacity
          onPress={sendUpdate}
          disabled={!statusUpdate.trim()}
          style={[
            styles.enhancedButton, 
            !statusUpdate.trim() && styles.disabledButton
          ]}
        >
          <Text style={styles.enhancedButtonText}>Send Update</Text>
          <FontAwesome 
            name="paper-plane" 
            size={16} 
            color={!statusUpdate.trim() ? "#999" : "#fff"} 
            style={styles.buttonIcon} 
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Helper function to get the appropriate icon for each status
const getStatusIcon = (status) => {
  const statusLower = status.toLowerCase();
  if (statusLower === "open") return "exclamation-circle";
  if (statusLower === "in progress") return "clock-o";
  if (statusLower === "resolved") return "check-circle";
  if (statusLower === "closed") return "check-circle-o";
  return "circle";
};

export default ReportInfo;