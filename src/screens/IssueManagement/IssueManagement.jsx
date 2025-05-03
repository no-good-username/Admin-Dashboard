import React, { useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  RefreshControl,
  ScrollView,
} from "react-native";
import { useFocusEffect } from '@react-navigation/native'; // Add this import
import { FontAwesome5 } from "@expo/vector-icons";
import styles from "./styles";

// Import Zustand stores
import useIssueStore from "./stores/issueStore";
import useUIStore from "./stores/uiStore";
import useReportsStore from "../../stores/reportsStore"; // Import global reports store

const IssueManagement = ({ navigation }) => {
  // Access state and actions from stores
  const {
    issues,
    loading,
    refreshing,
    filterStatus,
    error,
    fetchIssues,
    refreshIssues,
    setFilterStatus,
    getFilteredIssues,
    updateIssue
  } = useIssueStore();

  // Get global state
  const { needsRefresh, lastUpdatedReport, clearNeedsRefresh } = useReportsStore();

  // UI utility functions
  const { getStatusStyle, getPriorityIcon } = useUIStore();
  
  // Fetch data on component mount
  useEffect(() => {
    fetchIssues();
  }, []);
  
  // Check for updates when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      console.log("IssueManagement screen in focus, checking for updates");
      console.log("Global state:", { needsRefresh, lastUpdatedReport: lastUpdatedReport?.id });
      
      if (needsRefresh && lastUpdatedReport) {
        console.log("Updating local issue with new data:", lastUpdatedReport);
        
        // Update the local issue with the changed data
        updateIssue(lastUpdatedReport.id, {
          status: lastUpdatedReport.status,
          dbStatus: lastUpdatedReport.dbStatus,
          assignedLinesmen: lastUpdatedReport.assignedLinesmen
        });
        
        // Clear the refresh flag
        clearNeedsRefresh();
      }
      
      return () => {};
    }, [needsRefresh, lastUpdatedReport, updateIssue, clearNeedsRefresh])
  );

  // Render functions
  const renderIssueItem = ({ item }) => {
    const priorityIcon = getPriorityIcon(item.priority);

    return (
      <TouchableOpacity
        style={styles.issueItem}
        onPress={() => {
          console.log("Navigating to report with ID:", item.id, "and taskId:", item.taskId);
          navigation.navigate("ReportDetail", { report: item });
        }}
        activeOpacity={0.7}
      >
        {/* Rest of your rendering code remains the same */}
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

  // Rest of your component remains the same
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
          <TouchableOpacity style={styles.refreshButton} onPress={fetchIssues}>
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
              onRefresh={refreshIssues}
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