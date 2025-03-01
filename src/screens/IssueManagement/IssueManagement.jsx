// screens/IssueManagement/IssueManagement.js
import React, { useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import styles from "./styles";

const IssueManagement = ({ navigation }) => {
  const [issues, setIssues] = useState([
    {
      id: "1",
      issue: "Broken streetlight",
      description: "The streetlight at 123 Main St is completely out.",
      location: "123 Main St",
      status: "Open",
      imageUrl: "https://example.com/broken-streetlight.jpg",
      updates: [],
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
