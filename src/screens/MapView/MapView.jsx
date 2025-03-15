import React, { useState } from "react";
import { StyleSheet, View, Text, Dimensions } from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";
import { MaterialIcons } from "@expo/vector-icons";

const StreetlightMapView = () => {
  const [streetlights, setStreetlights] = useState([
    {
      id: 1,
      latitude: 37.78825,
      longitude: -122.4324,
      isWorking: true,
      address: "123 Main St",
    },
    {
      id: 2,
      latitude: 37.78925,
      longitude: -122.4344,
      isWorking: false,
      address: "456 Oak Ave",
    },
    {
      id: 3,
      latitude: 37.78725,
      longitude: -122.4314,
      isWorking: true,
      address: "789 Pine Rd",
    },
    {
      id: 4,
      latitude: 37.78625,
      longitude: -122.4334,
      isWorking: false,
      address: "101 Cedar Blvd",
    },
    {
      id: 5,
      latitude: 37.78525,
      longitude: -122.4304,
      isWorking: true,
      address: "202 Elm St",
    },
  ]);

  const initialRegion = {
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.05,
    longitudeDelta: 0.02,
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Streetlight Monitoring</Text>
      <MapView
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
          >
            <MaterialIcons
              name={
                light.isWorking ? "emergency_share_icon" : "lightbulb-outline"
              }
              size={40}
              color={light.isWorking ? "yellow" : "gray"}
            />
            <Callout>
              <View style={styles.calloutContainer}>
                <Text style={styles.calloutTitle}>
                  {light.isWorking ? "Working Light" : "Broken Light"}
                </Text>
                <Text style={styles.calloutText}>Address: {light.address}</Text>
                <Text style={styles.calloutText}>
                  Status: {light.isWorking ? "Operational" : "Needs Repair"}
                </Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height / 2,
    margin: 10, // Half the screen height
  },
  calloutContainer: {
    width: 180,
    padding: 10,
  },
  calloutTitle: {
    fontWeight: "bold",
    fontSize: 16,
  },
  calloutText: {
    fontSize: 14,
    color: "#333",
  },
});

export default StreetlightMapView;
