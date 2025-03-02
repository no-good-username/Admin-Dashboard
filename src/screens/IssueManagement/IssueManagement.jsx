// screens/IssueManagement/IssueManagement.js
import React, { useState,useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import styles from "./styles";

const IssueManagement = ({ navigation }) => {
  const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      async function fetchData() {
        try {
          const response = await fetch("https://streetlightfix-backend-1.onrender.com/admin/issue", {
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
    
  
    console.log("Issues ",data);

  const [issues, setIssues] = useState([
    {
      id: "1",
      issue: "Broken streetlight",
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
