// screens/IssueManagement/IssueManagement.js
import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import styles from "./styles";

const IssueManagement = ({ navigation }) => {
  const [data, setData] = useState({ noStreetlight: 0 });
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://streetlightfix-backend-1.onrender.com/admin/report",
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
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  const [issues, setIssues] = useState([
    {
      id: data.report_id,
      issue: data.problem_type,
      description: "The streetlight at 123 Main St is completely out.",
      location: "123 Main St",
      status: "Open",
      imageUrl: "https://example.com/broken-streetlight.jpg",
      updates: [``],
      assignedLinesmen: [],
    },
    // ... add more sample issues
  ]);

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
      <Text style={styles.title}>Issue Management</Text>
      <FlatList
        data={issues}
        renderItem={renderIssueItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

export default IssueManagement;
