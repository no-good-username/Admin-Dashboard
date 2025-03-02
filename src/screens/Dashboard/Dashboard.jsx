// screens/Dashboard/Dashboard.js
import React, { useEffect,useState } from "react";
import { View, Image, Text, TouchableOpacity } from "react-native";
import styles from "./styles";

const Dashboard = ({ navigation }) => {
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("https://streetlightfix-backend-1.onrender.com/admin/home", {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include' // Include cookies in the request if needed
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
  
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  
    fetchData();
  }, []);
  

  console.log("data ",data);
  const stats = [
    { label: "Open Issues", value: data?.OpenIssues || "N/A" },
    { label: "Completed Tasks", value: data?.countReport || "N/A" },
    { label: "Total Lights", value: data?.noStreetlight || "N/A"  },
    { label: "Unassigned Tasks", value: data?.UnassignTask || "N/A" },  
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
