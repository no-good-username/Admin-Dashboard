// screens/Dashboard/Dashboard.js
import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import styles from "./styles";
import { SignOutButton } from "../../components/signOutButton";
import { dashboardApi } from '../../services/api';
const Dashboard = ({ navigation }) => {
  const [data, setData] = useState({
    noStreetlight: 0,
    openIssues: 0,
    completedTasks: 0,
    unassignedTasks: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await dashboardApi.getDashboardData();
        console.log("API Response:", result);

        setData({
          noStreetlight: result.noStreetlight || 0,
          openIssues: result.OpenIssues || 15,
          completedTasks: result.countReport || 57,
          unassignedTasks: result.countReport || 7,
        });
        const formattedActivity = (result.recentReport || []).map((item) => ({
          title: item.problem_type,
          location: item.description,
          time: new Date(item.ReportcreatedAt).toLocaleString(),
        }));

        setRecentActivity(formattedActivity);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  console.log("Data:", recentActivity);

  const stats = [
    {
      label: "Open Issues",
      value: data.openIssues,
      icon: "exclamation-circle",
      color: "#FF9500",
    },
    {
      label: "Completed",
      value: data.completedTasks,
      icon: "check-circle",
      color: "#34C759",
    },
    {
      label: "Total Lights",
      value: data.noStreetlight,
      icon: "lightbulb",
      color: "#007AFF",
    },
    {
      label: "Unassigned",
      value: data.unassignedTasks,
      icon: "question-circle",
      color: "#FF3B30",
    },
  ];

  const quickAccess = [
    {
      label: "Map View",
      screen: "MapView",
      icon: "map-marked-alt",
      description: "Monitor streetlights geographically",
    },
    {
      label: "Issue Management",
      screen: "IssueManagement",
      icon: "tasks",
      description: "Track and update issue status",
    },
    {
      label: "Generate Reports",
      screen: "Reports",
      icon: "file-alt",
      description: "Create maintenance reports",
    },
    {
      label: "Analytics",
      screen: "Analytics",
      icon: "chart-bar",
      description: "View performance metrics",
    },
      {
      label: "Profile",
      screen: "Profile",
      icon: "user-circle",
      description: "Manage JE details and account",
    },
  ];

  // const recentActivity = [
  //   {
  //     title: "New Issue Reported",
  //     location: "Main St & 5th Ave",
  //     time: "10 mins ago",
  //   },
  //   {
  //     title: "Issue Resolved",
  //     location: "Park Blvd & Elm St",
  //     time: "2 hours ago",
  //   },
  //   {
  //     title: "Maintenance Scheduled",
  //     location: "Center Ave",
  //     time: "1 day ago",
  //   },
  // ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.statsContainer}>
        <Text style={styles.sectionTitle}>System Status</Text>
        <View style={styles.statsGrid}>
          {stats.map((stat) => (
            <View key={stat.label} style={styles.statCard}>
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: stat.color + "15" },
                ]}
              >
                <FontAwesome5 name={stat.icon} size={20} color={stat.color} />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>
      </View>
      

      <Text style={styles.sectionTitle}>Quick Access</Text>
      <View style={styles.quickAccessContainer}>
        {quickAccess.map((item) => (
          <TouchableOpacity
            key={item.label}
            style={styles.quickAccessItem}
            onPress={() => navigation.navigate(item.screen)}
          >
            <View style={styles.quickAccessContent}>
              <View style={styles.quickAccessIconContainer}>
                <FontAwesome5 name={item.icon} size={20} color="#000" />
              </View>
              <View style={styles.quickAccessTextContainer}>
                <Text style={styles.quickAccessTitle}>{item.label}</Text>
                <Text style={styles.quickAccessDescription}>
                  {item.description}
                </Text>
              </View>
            </View>
            <FontAwesome5 name="chevron-right" size={14} color="#999" />
          </TouchableOpacity>
        ))}
      </View>
      
      <Text style={styles.sectionTitle}>Recent Activity</Text>
      <View style={styles.recentActivityContainer}>
        {recentActivity.length > 0 ? (
          recentActivity.map((item, index) => (
            <View key={index} style={styles.activityItem}>
              <View style={styles.activityTimelineContainer}>
                <View style={styles.activityDot} />
                {index < recentActivity.length - 1 && <View style={styles.activityLine} />}
              </View>
              <View style={styles.activityCard}>
                <View style={styles.activityCardHeader}>
                  <Text style={styles.activityTitle}>{item.title}</Text>
                  <Text style={styles.activityTime}>{item.time}</Text>
                </View>
                <Text style={styles.activityLocation}>{item.location}</Text>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyActivityContainer}>
            <FontAwesome5 name="history" size={24} color="#CBD5E1" />
            <Text style={styles.emptyActivityText}>No recent activity</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default Dashboard;
