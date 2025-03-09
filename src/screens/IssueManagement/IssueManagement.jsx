import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import styles from "./styles";

const IssueManagement = ({ navigation }) => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://192.168.0.21:3000/admin/report",
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
        console.log("Data fetched:", result);
        // Ensure result is an array
        if (Array.isArray(result)) {
          const formattedIssues = result.map((item) => ({
            id: item.report_id || Math.random().toString(), // Ensure unique key
            issue: item.problem_type || "Unknown Issue",
            description: item.description || "No description available",
            location: item.location || "Unknown location",
            status: item.status || "Open",
            imageUrl: item.imageUrl || "", // Add default if needed
            updates: item.updates || [],
            assignedLinesmen: item.assignedLinesmen || [],
          }));
          setIssues(formattedIssues);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false); // Set loading to false after data is fetched
      }
    };

    fetchData();
  }, []);

  const renderIssueItem = ({ item }) => (
    <TouchableOpacity
      style={styles.issueItem}
      onPress={() => navigation.navigate("ReportDetail", { report: item })}
    >
      <Text style={styles.issueDescription}>{item.issue}</Text>
      <Text style={styles.issueLocation}>{item.location}</Text>
      <Text style={styles.issueStatus}>{item.status}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <FlatList
          data={issues}
          renderItem={renderIssueItem}
          keyExtractor={(item) => item.id.toString()} // Ensure unique key
        />
      )}
    </View>
  );
};

export default IssueManagement;
