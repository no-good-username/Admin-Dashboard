// screens/Dashboard/Dashboard.js
import React from "react";
import { View, Image, Text, TouchableOpacity } from "react-native";
import styles from "./styles";
import { useState, useEffect } from "react";

const Dashboard = ({ navigation }) => {
  const [data, setData] = useState({ noStreetlight: 0 });
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://streetlightfix-backend-1.onrender.com/admin/home",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        setData(result);
        console.log(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  const stats = [
    { label: "Open Issues", value: "15" },
    { label: "Completed Tasks", value: "57" },
    { label: "Total Lights", value: data.noStreetlight },
    { label: "Unassigned Tasks", value: "7" },
  ];

  const quickAccess = [
    { label: "Map View", screen: "MapView" },
    { label: "Issue Management", screen: "IssueManagement" },
    { label: "Generate Report", screen: "Reports" },
    { label: "Analytics", screen: "Analytics" },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.statsGrid}>
        {stats.map((stat) => (
          <View key={stat.label} style={styles.statCard}>
            <Text style={styles.statLabel}>{stat.label}</Text>
            <Text style={styles.statValue}>{stat.value}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Quick Access</Text>
      <View style={styles.quickAccess}>
        {quickAccess.map((item) => (
          <TouchableOpacity
            key={item.label}
            style={styles.quickAccessItem}
            onPress={() => navigation.navigate(item.screen)}
          >
            <Text style={styles.quickAccessText}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default Dashboard;
