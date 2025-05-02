import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  RefreshControl,
  Image,
  ScrollView,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import styles from "./styles";

const IssueManagement = ({ navigation }) => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filterStatus, setFilterStatus] = useState("All");

  // Status mapping between DB and frontend display values
  const statusMapping = {
    // DB value → Frontend display value
    "Open": "Open",
    "InProgress": "In Progress",
    "Completed": "Resolved",
    "Closed": "Closed"
  };

  // Reverse mapping for filtering (Frontend → DB)
  const reverseStatusMapping = {
    // Frontend display value → DB value
    "All": "All",
    "Open": "Open",
    "In Progress": "InProgress",
    "Resolved": "Completed",
    "Closed": "Closed"
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://streetlightfix-backend-1.onrender.com/admin/Issue/2",
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

      const result = (await response.json()).flat(); // Flatten the array

      console.log("Data fetched:", result);

      if (Array.isArray(result)) {
        const formattedIssues = result.map((item) => {
          let formattedDate = "Unknown date";
          console.log("report date", item.ReportcreatedAt);
          if (item.ReportcreatedAt) {
            try {
              const dateObj = new Date(item.ReportcreatedAt);
              if (!isNaN(dateObj)) {
                formattedDate = dateObj.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                });
              }
            } catch (e) {
              console.log("Error parsing date:", e);
            }
          }

          // Map DB status to frontend display status
          const displayStatus = statusMapping[item.Status] || "Open";

          return {
            id: item.report_id || Math.random().toString(),
            taskId: item.id || "Unknown",
            issue: item.title || "Unknown Issue",
            description: item.description || "No description available",
            location:
              item.Latitude && item.Longitude
                ? `Lat: ${item.Latitude}, Lng: ${item.Longitude}`
                : "Unknown location",
            status: displayStatus, // Use the mapped display status
            dbStatus: item.Status, // Keep the original DB status
            priority: item.priority || "Medium",
            date: formattedDate,
            imageUrl: item.url || "",
            updates: item.Status_update || [],
            assignedLinesmen: [{ id: item.linemen_id || [] }] || [],
          };
        });
        setIssues(formattedIssues);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const getFilteredIssues = () => {
    if (filterStatus === "All") return issues;
    
    // Use the reverse mapping to filter based on DB status values
    const dbStatusToFilter = reverseStatusMapping[filterStatus];
    return issues.filter((issue) => issue.dbStatus === dbStatusToFilter);
  };

  const getStatusStyle = (status) => {
    switch (status.toLowerCase()) {
      case "open":
        return styles.statusOpen;
      case "in progress":
        return styles.statusInProgress;
      case "resolved":
        return styles.statusResolved;
      case "closed":
        return styles.statusClosed;
      default:
        return styles.statusOpen;
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority.toLowerCase()) {
      case "high":
        return { name: "exclamation-circle", color: "#FF3B30" };
      case "medium":
        return { name: "exclamation", color: "#FF9500" };
      case "low":
        return { name: "info-circle", color: "#34C759" };
      default:
        return { name: "exclamation", color: "#FF9500" };
    }
  };

  const renderIssueItem = ({ item }) => {
    const priorityIcon = getPriorityIcon(item.priority);

    return (
      <TouchableOpacity
        style={styles.issueItem}
        onPress={() => navigation.navigate("ReportDetail", { report: item })}
        activeOpacity={0.7}
      >
        <View style={styles.issueHeader}>
          <View style={styles.issueTitleContainer}>
            <FontAwesome5
              name={priorityIcon.name}
              size={16}
              color={priorityIcon.color}
              style={styles.priorityIcon}
            />
            <Text style={styles.issueTitle} numberOfLines={1}>
              {item.issue}
            </Text>
          </View>
          <View style={[styles.statusBadge, getStatusStyle(item.status)]}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>

        <View style={styles.issueDetails}>
          <View style={styles.detailRow}>
            <FontAwesome5
              name="map-marker-alt"
              size={14}
              color="#666"
              style={styles.detailIcon}
            />
            <Text style={styles.issueLocation} numberOfLines={1}>
              {item.location}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <FontAwesome5
              name="calendar-alt"
              size={14}
              color="#666"
              style={styles.detailIcon}
            />
            <Text style={styles.issueDate}>{item.date}</Text>
          </View>
        </View>

        <Text style={styles.issueDescription} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.issueFooter}>
          {item.assignedLinesmen && item.assignedLinesmen[0] && Array.isArray(item.assignedLinesmen[0].id) && item.assignedLinesmen[0].id.length > 0 ? (
            <View style={styles.assignedContainer}>
              <Text style={styles.assignedText}>
                {item.assignedLinesmen[0].id.length} linesmen assigned
              </Text>
            </View>
          ) : (
            <View style={styles.unassignedContainer}>
              <FontAwesome5
                name="exclamation-triangle"
                size={14}
                color="#FF9500"
              />
              <Text style={styles.unassignedText}>Unassigned</Text>
            </View>
          )}

          <View style={styles.viewDetailsContainer}>
            <Text style={styles.viewDetailsText}>View Details</Text>
            <FontAwesome5 name="chevron-right" size={12} color="#000" />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderFilterButton = (status) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        filterStatus === status && styles.filterButtonActive,
      ]}
      onPress={() => setFilterStatus(status)}
    >
      <Text
        style={[
          styles.filterButtonText,
          filterStatus === status && styles.filterButtonTextActive,
        ]}
      >
        {status}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Issue Management</Text>
        <Text style={styles.headerSubtitle}>
          Track and manage reported issues
        </Text>
      </View>

      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScrollContent}
        >
          {renderFilterButton("All")}
          {renderFilterButton("Open")}
          {renderFilterButton("In Progress")}
          {renderFilterButton("Resolved")}
          {renderFilterButton("Closed")}
        </ScrollView>
      </View>

      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#000000" />
          <Text style={styles.loadingText}>Loading issues...</Text>
        </View>
      ) : issues.length === 0 ? (
        <View style={styles.emptyContainer}>
          <FontAwesome5 name="clipboard-list" size={60} color="#CCCCCC" />
          <Text style={styles.emptyText}>No issues found</Text>
          <Text style={styles.emptySubtext}>
            Any reported issues will appear here
          </Text>
          <TouchableOpacity style={styles.refreshButton} onPress={fetchData}>
            <Text style={styles.refreshButtonText}>Refresh</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={getFilteredIssues()}
          renderItem={renderIssueItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#000000"]}
              tintColor="#000000"
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyFilterContainer}>
              <FontAwesome5 name="filter" size={40} color="#CCCCCC" />
              <Text style={styles.emptyFilterText}>
                No issues match the current filter
              </Text>
              <TouchableOpacity
                style={styles.clearFilterButton}
                onPress={() => setFilterStatus("All")}
              >
                <Text style={styles.clearFilterButtonText}>Show All</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}
    </View>
  );
};

export default IssueManagement;