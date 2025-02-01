// screens/Dashboard/Dashboard.js
import React from "react";
import { View, Image, Text, TouchableOpacity } from "react-native";
import styles from "./styles";

const Dashboard = ({ navigation }) => {
  const stats = [
    { label: "Open Issues", value: "15" },
    { label: "Completed Tasks", value: "57" },
    { label: "Total Lights", value: "2000" },
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
