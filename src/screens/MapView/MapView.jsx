import React, { useState } from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
// Rename the imported component to avoid conflicts
import RNMapView, { Marker, Callout } from 'react-native-maps';
import { MaterialIcons } from '@expo/vector-icons';

const StreetlightMapView = () => {
  // Dummy data for streetlights
  const [streetlights, setStreetlights] = useState([
    { id: 1, latitude: 37.78825, longitude: -122.4324, isWorking: true, address: "123 Main St" },
    { id: 2, latitude: 37.78925, longitude: -122.4344, isWorking: false, address: "456 Oak Ave" },
    { id: 3, latitude: 37.78725, longitude: -122.4314, isWorking: true, address: "789 Pine Rd" },
    { id: 4, latitude: 37.78625, longitude: -122.4334, isWorking: false, address: "101 Cedar Blvd" },
    { id: 5, latitude: 37.78525, longitude: -122.4304, isWorking: true, address: "202 Elm St" },
  ]);

  // Initial region to display on map
  const initialRegion = {
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Streetlight Monitoring</Text>
        <View style={styles.legendContainer}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: 'red' }]} />
            <Text style={styles.legendText}>Working</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: 'black' }]} />
            <Text style={styles.legendText}>Not Working</Text>
          </View>
        </View>
      </View>
      
      <RNMapView
        style={styles.map}
        initialRegion={initialRegion}
        provider="google"
      >
        {streetlights.map((light) => (
          <Marker
            key={light.id}
            coordinate={{
              latitude: light.latitude,
              longitude: light.longitude,
            }}
            pinColor={light.isWorking ? 'red' : 'black'}
          >
            <Callout>
              <View style={styles.calloutContainer}>
                <Text style={styles.calloutTitle}>
                  {light.isWorking ? 'Working Streetlight' : 'Broken Streetlight'}
                </Text>
                <Text style={styles.calloutText}>ID: {light.id}</Text>
                <Text style={styles.calloutText}>Address: {light.address}</Text>
                <Text style={styles.calloutText}>
                  Status: {light.isWorking ? 'Operational' : 'Needs Repair'}
                </Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </RNMapView>
      
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {streetlights.filter(light => light.isWorking).length}
          </Text>
          <Text style={styles.statLabel}>Working</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {streetlights.filter(light => !light.isWorking).length}
          </Text>
          <Text style={styles.statLabel}>Not Working</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{streetlights.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerContainer: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    elevation: 2,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  legendContainer: {
    flexDirection: 'row',
    marginTop: 4,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    fontSize: 14,
    color: '#666',
  },
  map: {
    flex: 1,
    width: Dimensions.get('window').width,
  },
  calloutContainer: {
    width: 200,
    padding: 8,
  },
  calloutTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  calloutText: {
    fontSize: 14,
    color: '#555',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    justifyContent: 'space-around',
    elevation: 2,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
});

export default StreetlightMapView;