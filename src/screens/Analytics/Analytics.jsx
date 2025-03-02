import React, { useState,useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { styles } from './styles';

const Analytics = () => {
  const [AnalyticsData,setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("https://streetlightfix-backend-1.onrender.com/admin/analytics")
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
  console.log("analtyic data is: ",AnalyticsData);

  const [selectedRange, setSelectedRange] = useState('Last 30 Days');
  const [modalVisible, setModalVisible] = useState(false);

  const dateOptions = ['Last 7 Days', 'Last 30 Days', 'Last 3 Months', 'Last Year'];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.dropdownButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.dropdownButtonText}>{selectedRange}</Text>
        </TouchableOpacity>
      </View>

      {/* Date Range Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            {dateOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  setSelectedRange(option);
                  setModalVisible(false);
                }}
                style={styles.dropdownOption}
              >
                <Text style={styles.dropdownOptionText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Summary Cards (Single Column) */}
      <View style={styles.summaryColumn}>
        <View style={styles.summaryCard}>
          <MaterialIcons name="error-outline" size={30} color="#000" style={styles.cardIcon} />
          <Text style={styles.cardTitle}>Report Trends</Text>
          <Text style={styles.cardValue}>147</Text>
          <Text style={styles.cardSubtitle}>This month</Text>
        </View>
        <View style={styles.summaryCard}>
          <MaterialIcons name="check-circle-outline" size={30} color="#000" style={styles.cardIcon} />
          <Text style={styles.cardTitle}>Task Completion</Text>
          <Text style={styles.cardValue}>85%</Text>
          <Text style={styles.cardSubtitle}>On-time resolution</Text>
        </View>
        <View style={styles.summaryCard}>
          <MaterialIcons name="access-time" size={30} color="#000" style={styles.cardIcon} />
          <Text style={styles.cardTitle}>Avg. Repair Time</Text>
          <Text style={styles.cardValue}>4.2h</Text>
          <Text style={styles.cardSubtitle}>Per issue</Text>
        </View>
        <View style={styles.summaryCard}>
          <MaterialIcons name="lightbulb-outline" size={30} color="#000" style={styles.cardIcon} />
          <Text style={styles.cardTitle}>Healthy Lights</Text>
          <Text style={styles.cardValue}>94%</Text>
          <Text style={styles.cardSubtitle}>Operational status</Text>
        </View>
      </View>

      {/* Single Column Blocks */}
      <View style={styles.singleColumnBlocks}>
        {/* Division Performance */}
        <View style={styles.block}>
          <Text style={styles.sectionTitle}>Division Performance</Text>
          <View style={styles.divisionItem}>
            <Text style={styles.divisionName}>North</Text>
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar, { width: '85%' }]} />
            </View>
            <Text style={styles.divisionPercentage}>85%</Text>
          </View>
          <View style={styles.divisionItem}>
            <Text style={styles.divisionName}>South</Text>
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar, { width: '78%' }]} />
            </View>
            <Text style={styles.divisionPercentage}>78%</Text>
          </View>
          <View style={styles.divisionItem}>
            <Text style={styles.divisionName}>East</Text>
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar, { width: '92%' }]} />
            </View>
            <Text style={styles.divisionPercentage}>92%</Text>
          </View>
          <View style={styles.divisionItem}>
            <Text style={styles.divisionName}>West</Text>
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar, { width: '81%' }]} />
            </View>
            <Text style={styles.divisionPercentage}>81%</Text>
          </View>
        </View>

        {/* Technician Efficiency */}
        <View style={styles.block}>
          <Text style={styles.sectionTitle}>Technician Efficiency</Text>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableCell, styles.tableHeaderCell]}>Technician</Text>
            <Text style={[styles.tableCell, styles.tableHeaderCell]}>Tasks</Text>
            <Text style={[styles.tableCell, styles.tableHeaderCell]}>Avg. Time</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>John D.</Text>
            <Text style={styles.tableCell}>45</Text>
            <Text style={styles.tableCell}>3.5h</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Sarah M.</Text>
            <Text style={styles.tableCell}>38</Text>
            <Text style={styles.tableCell}>4.2h</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Mike R.</Text>
            <Text style={styles.tableCell}>42</Text>
            <Text style={styles.tableCell}>3.8h</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Lisa K.</Text>
            <Text style={styles.tableCell}>39</Text>
            <Text style={styles.tableCell}>4.0h</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default Analytics;
