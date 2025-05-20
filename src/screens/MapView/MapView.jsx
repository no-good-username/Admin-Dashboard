import React, { useState, useEffect, useCallback } from "react";
import { StyleSheet, View, Text, Dimensions, TouchableOpacity, ActivityIndicator, Share, Alert, TextInput, Modal, ScrollView } from "react-native";
import MapView, { Polygon, Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { FontAwesome } from "@expo/vector-icons";
import * as Clipboard from 'expo-clipboard';
import { Platform } from "react-native";
// Uncomment when ready to fetch real data
// import { supabase } from "../../config/supabaseClient";

const JECoverageMapView = () => {
  // Coverage areas for the JE
  const [coverageArea, setCoverageArea] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [exportModalVisible, setExportModalVisible] = useState(false);
  const [importModalVisible, setImportModalVisible] = useState(false);
  const [importText, setImportText] = useState('');
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);

  const initialRegion = {
    latitude: 15.42406,
    longitude: 73.9795,
    latitudeDelta: 0.05,
    longitudeDelta: 0.02,
  };

  // Demo polygon - simulating JE coverage area
  const demoPolygon = {
    id: 'je-area',
    name: 'Goa Engineering College',
    coordinates: [
      { latitude: 15.4285271, longitude: 73.9785061 },
  { latitude: 15.4260656, longitude: 73.9768968 },
  { latitude: 15.4207496, longitude: 73.9772615 },
  { latitude: 15.4189293, longitude: 73.9781199 },
  { latitude: 15.4193016, longitude: 73.9835057 },
  { latitude: 15.4259208, longitude: 73.9847932 },
  { latitude: 15.4301198, longitude: 73.9827762 },
  { latitude: 15.4285271, longitude: 73.9785061 }
    ],
    fillColor: 'rgba(0, 122, 255, 0.2)',
    strokeColor: '#007AFF',
  };

  // Function to fetch real coverage area from Supabase when ready
  const fetchCoverageArea = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch demo data for now
      // In future, uncomment this to fetch real data
      /*
      // Replace with your actual Supabase query
      const { data, error } = await supabase
        .from('je_coverage_areas')
        .select('id, name, coordinates, color')
        .eq('je_id', currentJEId) // Replace with actual JE ID from context/props
        .single();
      
      if (error) throw error;
      
      if (data) {
        // Format data for rendering
        const formattedArea = {
          id: data.id,
          name: data.name,
          coordinates: JSON.parse(data.coordinates), // Assuming coordinates are stored as GeoJSON
          fillColor: `${data.color}33`, // Adding transparency
          strokeColor: data.color,
        };
        
        setCoverageArea(formattedArea);
      }
      */
      
      // For now, use demo data
      setTimeout(() => {
        setCoverageArea(demoPolygon);
        setLoading(false);
      }, 500);
      
    } catch (err) {
      console.error("Error fetching coverage area:", err);
      setError("Failed to load your service area");
      setLoading(false);
    }
  }, []);

  // Load coverage area on component mount
  useEffect(() => {
    fetchCoverageArea();
  }, [fetchCoverageArea]);

  // Calculate center coordinates for polygon label
  const calculatePolygonCenter = (coordinates) => {
    if (!coordinates || coordinates.length === 0) return { latitude: 0, longitude: 0 };
    
    const latSum = coordinates.reduce((sum, coord) => sum + coord.latitude, 0);
    const lngSum = coordinates.reduce((sum, coord) => sum + coord.longitude, 0);
    
    return {
      latitude: latSum / coordinates.length,
      longitude: lngSum / coordinates.length
    };
  };

  // Convert polygon coordinates to KML format for Google Maps
  const convertToKML = (coordinates, name) => {
    let kml = `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>${name || 'Service Area'}</name>
    <Style id="serviceAreaStyle">
      <LineStyle>
        <color>ffff7700</color>
        <width>3</width>
      </LineStyle>
      <PolyStyle>
        <color>4d0077ff</color>
      </PolyStyle>
    </Style>
    <Placemark>
      <name>${name || 'Service Area'}</name>
      <styleUrl>#serviceAreaStyle</styleUrl>
      <Polygon>
        <outerBoundaryIs>
          <LinearRing>
            <coordinates>`;

    // Add coordinates (KML uses lon,lat,alt format)
    for (const coord of coordinates) {
      kml += `\n              ${coord.longitude},${coord.latitude},0`;
    }
    
    // Close the polygon by repeating the first coordinate
    if (coordinates.length > 0) {
      kml += `\n              ${coordinates[0].longitude},${coordinates[0].latitude},0`;
    }

    kml += `
            </coordinates>
          </LinearRing>
        </outerBoundaryIs>
      </Polygon>
    </Placemark>
  </Document>
</kml>`;

    return kml;
  };

  // Convert polygon to GeoJSON format
  const convertToGeoJSON = (coordinates, name, id) => {
    const geoJSON = {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [[]]
      },
      properties: {
        name: name || "Service Area",
        id: id || "area-1"
      }
    };

    // Add coordinates (GeoJSON uses [lon, lat] format)
    for (const coord of coordinates) {
      geoJSON.geometry.coordinates[0].push([coord.longitude, coord.latitude]);
    }

    // Close the polygon by repeating the first coordinate
    if (coordinates.length > 0) {
      const first = coordinates[0];
      geoJSON.geometry.coordinates[0].push([first.longitude, first.latitude]);
    }

    return JSON.stringify(geoJSON, null, 2);
  };

  // Convert to Google My Maps URL (direct link to create a map with these coordinates)
  const getGoogleMyMapsUrl = (coordinates, name) => {
    let csvContent = "latitude,longitude,name\n";
    coordinates.forEach((coord, index) => {
      csvContent += `${coord.latitude},${coord.longitude},Point ${index + 1}\n`;
    });
    
    const encodedCsv = encodeURIComponent(csvContent);
    return `https://www.google.com/maps/d/edit?csvContent=${encodedCsv}&title=${encodeURIComponent(name || 'Service Area')}`;
  };

  // Export service area to different formats
  const handleExport = async () => {
    if (!coverageArea || !coverageArea.coordinates || coverageArea.coordinates.length === 0) {
      Alert.alert("Error", "No coverage area data to export");
      return;
    }

    setExporting(true);
    try {
      setExportModalVisible(true);
    } catch (error) {
      console.error("Export error:", error);
      Alert.alert("Export Failed", "Failed to export coverage area data");
    } finally {
      setExporting(false);
    }
  };

  // Copy to clipboard
  const copyToClipboard = async (text, format) => {
    try {
      await Clipboard.setStringAsync(text);
      Alert.alert("Copied", `${format} data copied to clipboard`);
    } catch (error) {
      console.error("Clipboard error:", error);
      Alert.alert("Error", "Failed to copy to clipboard");
    }
  };

  // Share content
  const handleShare = async (content, format) => {
    try {
      await Share.share({
        message: content,
        title: `${coverageArea?.name || 'Service Area'} ${format}`,
      });
    } catch (error) {
      Alert.alert("Error", "Failed to share the data");
    }
  };

  // Parse imported coordinates from various formats
  const parseImportedCoordinates = (text) => {
    try {
      // Try as JSON first
      try {
        const parsedJson = JSON.parse(text);
        
        // Check if it's GeoJSON
        if (parsedJson.type === "Feature" && 
            parsedJson.geometry && 
            parsedJson.geometry.type === "Polygon") {
          
          const coordinates = parsedJson.geometry.coordinates[0];
          return coordinates.map(coord => ({
            latitude: coord[1],
            longitude: coord[0]
          })).slice(0, -1); // Remove last point (closing point)
        }
        
        // Check if it's a simple array of coords
        if (Array.isArray(parsedJson) && 
            parsedJson.length > 0 && 
            parsedJson[0].latitude && 
            parsedJson[0].longitude) {
          return parsedJson;
        }
      } catch (e) {
        // Not valid JSON, continue to other formats
      }
      
      // Try as CSV format
      if (text.includes(',') && !text.includes('<')) {
        const rows = text.trim().split('\n');
        const result = [];
        
        const hasHeader = rows[0].toLowerCase().includes('lat') || 
                         rows[0].toLowerCase().includes('lon');
        const startIdx = hasHeader ? 1 : 0;
        
        for (let i = startIdx; i < rows.length; i++) {
          const parts = rows[i].split(',');
          if (parts.length >= 2) {
            const lat = parseFloat(parts[0].trim());
            const lng = parseFloat(parts[1].trim());
            if (!isNaN(lat) && !isNaN(lng)) {
              result.push({ latitude: lat, longitude: lng });
            }
          }
        }
        
        if (result.length > 0) return result;
      }
      
      // Try as KML format
      if (text.includes('<kml') && text.includes('<coordinates>')) {
        const coordsMatch = text.match(/<coordinates>([\s\S]*?)<\/coordinates>/);
        if (coordsMatch && coordsMatch[1]) {
          const coordsText = coordsMatch[1].trim();
          const coordPairs = coordsText.split(/\s+/);
          
          const result = [];
          for (const pair of coordPairs) {
            const [lng, lat] = pair.split(',');
            const latitude = parseFloat(lat);
            const longitude = parseFloat(lng);
            if (!isNaN(latitude) && !isNaN(longitude)) {
              result.push({ latitude, longitude });
            }
          }
          
          // Remove last point if it's the same as first (closing point)
          if (result.length > 1 && 
              result[0].latitude === result[result.length - 1].latitude && 
              result[0].longitude === result[result.length - 1].longitude) {
            result.pop();
          }
          
          if (result.length > 0) return result;
        }
      }
      
      throw new Error("Couldn't recognize the format of the coordinates");
    } catch (error) {
      throw new Error(`Import failed: ${error.message}`);
    }
  };

  // Handle import of coordinates
  const handleImport = async () => {
    if (!importText.trim()) {
      Alert.alert("Error", "Please enter coordinate data to import");
      return;
    }

    setImporting(true);
    try {
      const newCoordinates = parseImportedCoordinates(importText);
      
      if (!newCoordinates || newCoordinates.length < 3) {
        throw new Error("At least 3 points are needed to form a valid polygon");
      }
      
      // Update the coverage area with new coordinates
      setCoverageArea(current => ({
        ...current,
        coordinates: newCoordinates
      }));
      
      setImportModalVisible(false);
      setImportText('');
      
      Alert.alert(
        "Import Successful", 
        `Successfully imported ${newCoordinates.length} coordinates`
      );
      
      // In a real app, you would save this to your database
      // saveToDatabase(newCoordinates);
      
    } catch (error) {
      Alert.alert("Import Error", error.message);
    } finally {
      setImporting(false);
    }
  };

  // Save updated polygon to database (placeholder function)
  const saveToDatabase = async (coordinates) => {
    // Placeholder for saving to your database
    Alert.alert("Save to Database", 
      "This would save the updated polygon to your database. " +
      "Implement the actual API call in this function.");
    
    /* In a real implementation:
    try {
      const { data, error } = await supabase
        .from('je_coverage_areas')
        .update({
          coordinates: JSON.stringify(coordinates)
        })
        .eq('id', coverageArea.id);
      
      if (error) throw error;
      
      return true;
    } catch (err) {
      console.error("Error saving area:", err);
      return false;
    }
    */
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Your Coverage Area</Text>
        <View style={styles.headerButtonsContainer}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => setImportModalVisible(true)}
          >
            <FontAwesome name="download" size={16} color="#007AFF" />
            <Text style={styles.headerButtonText}>Import</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.headerButton}
            onPress={handleExport}
            disabled={!coverageArea || exporting}
          >
            <FontAwesome name="upload" size={16} color="#007AFF" />
            <Text style={styles.headerButtonText}>Export</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#007AFF" />
          <Text style={styles.loadingText}>Loading your service area...</Text>
        </View>
      )}
      
      {error && (
        <View style={styles.errorContainer}>
          <FontAwesome name="exclamation-circle" size={18} color="#FF3B30" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
      
      <MapView
        style={styles.map}
        initialRegion={initialRegion}
        provider={PROVIDER_GOOGLE}
      >
        {/* JE Coverage Area Polygon */}
        {coverageArea && (
          <>
            <Polygon
              coordinates={coverageArea.coordinates}
              fillColor={coverageArea.fillColor}
              strokeColor={coverageArea.strokeColor}
              strokeWidth={3}
            />
            <Marker
              coordinate={calculatePolygonCenter(coverageArea.coordinates)}
              anchor={{ x: 0.5, y: 0.5 }}
              opacity={0.9}
              tracksViewChanges={false}
            >
              <View style={styles.polygonLabelContainer}>
                <Text style={styles.polygonLabelText}>{coverageArea.name}</Text>
              </View>
            </Marker>
          </>
        )}
      </MapView>
      
      {/* Service Area Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>Service Area Information</Text>
        
        {coverageArea ? (
          <>
            <Text style={styles.infoText}>
              <Text style={styles.infoLabel}>Name: </Text>
              {coverageArea.name}
            </Text>
            
            <Text style={styles.infoText}>
              <Text style={styles.infoLabel}>Coverage Points: </Text>
              {coverageArea.coordinates.length} vertices
            </Text>
            
            <View style={styles.infoRow}>
              <View style={[styles.colorIndicator, {backgroundColor: coverageArea.strokeColor}]} />
              <Text style={styles.infoText}>Your assigned jurisdiction</Text>
            </View>
            
            <Text style={styles.infoNote}>
              This map shows your assigned area of responsibility for streetlight maintenance.
              You can export this area to modify it in Google Maps, or import a new polygon.
            </Text>
          </>
        ) : !loading ? (
          <Text style={styles.infoText}>No service area data available</Text>
        ) : (
          <Text style={styles.infoText}>Loading...</Text>
        )}
      </View>

      {/* Export Modal */}
      <Modal
        visible={exportModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setExportModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Export Coverage Area</Text>
              <TouchableOpacity onPress={() => setExportModalVisible(false)}>
                <FontAwesome name="times" size={24} color="#000" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalScrollContent}>
              <Text style={styles.modalSubtitle}>
                Choose a format to export your coverage area:
              </Text>

              {/* KML Format Option */}
              <View style={styles.exportOption}>
                <View style={styles.exportOptionHeader}>
                  <Text style={styles.exportOptionTitle}>KML Format</Text>
                  <Text style={styles.exportOptionSubtitle}>
                    Best for Google Earth and MyMaps
                  </Text>
                </View>
                
                <View style={styles.exportActions}>
                  <TouchableOpacity
                    style={styles.exportActionButton}
                    onPress={() => copyToClipboard(
                      convertToKML(coverageArea.coordinates, coverageArea.name),
                      "KML"
                    )}
                  >
                    <FontAwesome name="copy" size={16} color="#007AFF" />
                    <Text style={styles.exportActionText}>Copy</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={styles.exportActionButton}
                    onPress={() => handleShare(
                      convertToKML(coverageArea.coordinates, coverageArea.name),
                      "KML"
                    )}
                  >
                    <FontAwesome name="share-alt" size={16} color="#007AFF" />
                    <Text style={styles.exportActionText}>Share</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* GeoJSON Format Option */}
              <View style={styles.exportOption}>
                <View style={styles.exportOptionHeader}>
                  <Text style={styles.exportOptionTitle}>GeoJSON Format</Text>
                  <Text style={styles.exportOptionSubtitle}>
                    Standard format for geographic data
                  </Text>
                </View>
                
                <View style={styles.exportActions}>
                  <TouchableOpacity
                    style={styles.exportActionButton}
                    onPress={() => copyToClipboard(
                      convertToGeoJSON(coverageArea.coordinates, coverageArea.name, coverageArea.id),
                      "GeoJSON"
                    )}
                  >
                    <FontAwesome name="copy" size={16} color="#007AFF" />
                    <Text style={styles.exportActionText}>Copy</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={styles.exportActionButton}
                    onPress={() => handleShare(
                      convertToGeoJSON(coverageArea.coordinates, coverageArea.name, coverageArea.id),
                      "GeoJSON"
                    )}
                  >
                    <FontAwesome name="share-alt" size={16} color="#007AFF" />
                    <Text style={styles.exportActionText}>Share</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Raw Coordinates Format Option */}
              <View style={styles.exportOption}>
                <View style={styles.exportOptionHeader}>
                  <Text style={styles.exportOptionTitle}>Raw Coordinates</Text>
                  <Text style={styles.exportOptionSubtitle}>
                    Simple JSON array for maximum compatibility
                  </Text>
                </View>
                
                <View style={styles.exportActions}>
                  <TouchableOpacity
                    style={styles.exportActionButton}
                    onPress={() => copyToClipboard(
                      JSON.stringify(coverageArea.coordinates, null, 2),
                      "Raw Coordinates"
                    )}
                  >
                    <FontAwesome name="copy" size={16} color="#007AFF" />
                    <Text style={styles.exportActionText}>Copy</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={styles.exportActionButton}
                    onPress={() => handleShare(
                      JSON.stringify(coverageArea.coordinates, null, 2),
                      "Raw Coordinates"
                    )}
                  >
                    <FontAwesome name="share-alt" size={16} color="#007AFF" />
                    <Text style={styles.exportActionText}>Share</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <Text style={styles.exportInstructions}>
                1. Export your coverage area in your preferred format{'\n'}
                2. Open the data in Google Maps, Google Earth, or any GIS tool{'\n'}
                3. Modify the polygon as needed{'\n'}
                4. Export the modified polygon{'\n'}
                5. Import it back into this app
              </Text>
            </ScrollView>
            
            <TouchableOpacity
              style={styles.closeModalButton}
              onPress={() => setExportModalVisible(false)}
            >
              <Text style={styles.closeModalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Import Modal */}
      <Modal
        visible={importModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setImportModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Import Coverage Area</Text>
              <TouchableOpacity onPress={() => setImportModalVisible(false)}>
                <FontAwesome name="times" size={24} color="#000" />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.modalSubtitle}>
              Paste your polygon coordinates below:
            </Text>
            
            <TextInput
              style={styles.importTextInput}
              multiline
              numberOfLines={8}
              placeholder="Paste KML, GeoJSON, or raw coordinates here..."
              value={importText}
              onChangeText={setImportText}
            />
            
            <Text style={styles.importInstructions}>
              Supported formats:{'\n'}
              • KML (from Google Earth or MyMaps){'\n'}
              • GeoJSON{'\n'}
              • Raw coordinates JSON array{'\n'}
              • CSV format with lat,lng columns
            </Text>
            
            <View style={styles.importButtonsContainer}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setImportModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.importButton,
                  (!importText.trim() || importing) && styles.disabledButton
                ]}
                disabled={!importText.trim() || importing}
                onPress={handleImport}
              >
                {importing ? (
                  <ActivityIndicator size="small" color="#FFF" />
                ) : (
                  <>
                    <FontAwesome name="check" size={16} color="#FFF" style={styles.importButtonIcon} />
                    <Text style={styles.importButtonText}>Import</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  headerButtonsContainer: {
    flexDirection: 'row',
  },
  headerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginLeft: 8,
  },
  headerButtonText: {
    fontSize: 14,
    color: '#007AFF',
    marginLeft: 6,
    fontWeight: '500',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    backgroundColor: '#F2F2F7',
  },
  loadingText: {
    fontSize: 14,
    color: '#007AFF',
    marginLeft: 8,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    backgroundColor: '#FFEEEE',
  },
  errorText: {
    fontSize: 14,
    color: '#FF3B30',
    marginLeft: 8,
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height * 0.5, // 50% of screen height
  },
  polygonLabelContainer: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#007AFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  polygonLabelText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
  infoContainer: {
    margin: 16,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  infoText: {
    fontSize: 15,
    color: '#333',
    marginBottom: 8,
  },
  infoLabel: {
    fontWeight: '600',
    color: '#555',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  colorIndicator: {
    width: 18,
    height: 18,
    borderRadius: 4,
    marginRight: 10,
  },
  infoNote: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#777',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  modalScrollContent: {
    maxHeight: 400,
  },
  // Export option styles
  exportOption: {
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  exportOptionHeader: {
    marginBottom: 12,
  },
  exportOptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  exportOptionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  exportActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  exportActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  exportActionText: {
    color: '#007AFF',
    fontWeight: '500',
    marginLeft: 8,
  },
  exportInstructions: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    padding: 12,
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    marginBottom: 16,
  },
  closeModalButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  closeModalButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  // Import styles
  importTextInput: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 12,
    height: 200,
    textAlignVertical: 'top',
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  importInstructions: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    padding: 12,
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    marginVertical: 16,
  },
  importButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 0.48,
    backgroundColor: '#F2F2F7',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '600',
  },
  importButton: {
    flex: 0.48,
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  importButtonIcon: {
    marginRight: 8,
  },
  importButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.5,
  },
});

export default JECoverageMapView;