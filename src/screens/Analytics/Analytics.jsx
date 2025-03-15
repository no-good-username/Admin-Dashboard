import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  Animated,
} from "react-native";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { BarChart, LineChart } from "react-native-chart-kit";
import { styles } from "./styles";

const Analytics = () => {
  const [selectedRange, setSelectedRange] = useState("Last 30 Days");
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [animatedValues] = useState({
    reportTrends: new Animated.Value(0),
    taskCompletion: new Animated.Value(0),
    repairTime: new Animated.Value(0),
    healthyLights: new Animated.Value(0),
  });

  const dateOptions = [
    "Last 7 Days",
    "Last 30 Days",
    "Last 3 Months",
    "Last Year",
  ];

  // Simulated data for charts
  const reportData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43, 50],
      },
    ],
  };

  const completionTrend = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        data: [65, 78, 72, 81, 85, 92],
        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);

      // Animate the summary cards
      Animated.stagger(150, [
        Animated.timing(animatedValues.reportTrends, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValues.taskCompletion, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValues.repairTime, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValues.healthyLights, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    }, 1000);

    return () => clearTimeout(timer);
  }, [selectedRange]);

  const renderSummaryCard = (title, value, subtitle, icon, animatedValue) => {
    return (
      <Animated.View
        style={[
          styles.summaryCard,
          {
            opacity: animatedValue,
            transform: [
              {
                translateY: animatedValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                }),
              },
            ],
          },
        ]}
      >
        <View style={styles.cardIconContainer}>
          <FontAwesome5 name={icon} size={18} color="#FFF" />
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{title}</Text>
          <Text style={styles.cardValue}>{value}</Text>
          <Text style={styles.cardSubtitle}>{subtitle}</Text>
        </View>
      </Animated.View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
        <Text style={styles.loadingText}>Loading analytics data...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Analytics Dashboard</Text>
        <Text style={styles.headerSubtitle}>
          Performance metrics and insights
        </Text>
      </View>

      {/* Filter Bar */}
      <View style={styles.filterBar}>
        <Text style={styles.filterLabel}>Time Period:</Text>
        <TouchableOpacity
          style={styles.dropdownButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.dropdownButtonText}>{selectedRange}</Text>
          <FontAwesome5 name="chevron-down" size={12} color="#555" />
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
            <Text style={styles.modalTitle}>Select Time Period</Text>
            {dateOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  setSelectedRange(option);
                  setModalVisible(false);
                  setIsLoading(true);
                }}
                style={[
                  styles.dropdownOption,
                  selectedRange === option && styles.selectedOption,
                ]}
              >
                <Text
                  style={[
                    styles.dropdownOptionText,
                    selectedRange === option && styles.selectedOptionText,
                  ]}
                >
                  {option}
                </Text>
                {selectedRange === option && (
                  <FontAwesome5 name="check" size={14} color="#000" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Key Metrics */}
      <View style={styles.metricsHeader}>
        <Text style={styles.sectionTitle}>Key Metrics</Text>
        <Text style={styles.sectionSubtitle}>
          Overview of system performance
        </Text>
      </View>

      <View style={styles.summaryRow}>
        {renderSummaryCard(
          "Reports",
          "147",
          "This month",
          "exclamation-circle",
          animatedValues.reportTrends
        )}
        {renderSummaryCard(
          "Completion",
          "85%",
          "On-time resolution",
          "check-circle",
          animatedValues.taskCompletion
        )}
      </View>

      <View style={styles.summaryRow}>
        {renderSummaryCard(
          "Repair Time",
          "4.2h",
          "Average per issue",
          "clock",
          animatedValues.repairTime
        )}
        {renderSummaryCard(
          "Healthy",
          "94%",
          "Operational lights",
          "lightbulb",
          animatedValues.healthyLights
        )}
      </View>

      {/* Charts */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Reports by Day</Text>
        <Text style={styles.chartSubtitle}>Number of new reports received</Text>
        <BarChart
          data={reportData}
          width={Dimensions.get("window").width - 60} // Reduced width
          height={220}
          yAxisLabel=""
          chartConfig={{
            backgroundColor: "#ffffff",
            backgroundGradientFrom: "#ffffff",
            backgroundGradientTo: "#ffffff",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            barPercentage: 0.6, // Reduced bar width
            propsForLabels: {
              fontSize: 11, // Smaller label font size
            },
            propsForVerticalLabels: {
              fontSize: 11, // Smaller label font size
            },
          }}
          style={styles.chart}
          showValuesOnTopOfBars
          fromZero
          withInnerLines={false} // Remove inner grid lines for cleaner look
        />
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Task Completion Trend</Text>
        <Text style={styles.chartSubtitle}>
          Percentage of tasks completed on time
        </Text>
        <LineChart
          data={completionTrend}
          width={Dimensions.get("window").width - 60} // Reduced width
          height={220}
          yAxisLabel=""
          yAxisSuffix="%"
          chartConfig={{
            backgroundColor: "#ffffff",
            backgroundGradientFrom: "#ffffff",
            backgroundGradientTo: "#ffffff",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: "4", // Smaller dots
              strokeWidth: "2",
              stroke: "#000",
            },
            propsForLabels: {
              fontSize: 11, // Smaller label font size
            },
          }}
          bezier
          style={styles.chart}
          withInnerLines={false} // Remove inner grid lines for cleaner look
        />
      </View>

      {/* Division Performance */}
      <View style={styles.block}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Division Performance</Text>
          <Text style={styles.sectionSubtitle}>
            Maintenance efficiency by area
          </Text>
        </View>

        {["North", "South", "East", "West"].map((division, index) => {
          const percentages = [85, 78, 92, 81];
          return (
            <View key={division} style={styles.divisionItem}>
              <View style={styles.divisionNameContainer}>
                <View
                  style={[
                    styles.divisionDot,
                    {
                      backgroundColor: getColorForPercentage(
                        percentages[index]
                      ),
                    },
                  ]}
                />
                <Text style={styles.divisionName}>{division}</Text>
              </View>
              <View style={styles.progressBarContainer}>
                <View
                  style={[
                    styles.progressBar,
                    {
                      width: `${percentages[index]}%`,
                      backgroundColor: getColorForPercentage(
                        percentages[index]
                      ),
                    },
                  ]}
                />
              </View>
              <Text style={styles.divisionPercentage}>
                {percentages[index]}%
              </Text>
            </View>
          );
        })}
      </View>

      {/* Technician Efficiency */}
      <View style={styles.block}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Technician Efficiency</Text>
          <Text style={styles.sectionSubtitle}>
            Individual performance metrics
          </Text>
        </View>

        <View style={styles.technicianTable}>
          <View style={styles.tableHeader}>
            <Text
              style={[
                styles.tableCell,
                styles.tableHeaderCell,
                styles.nameCell,
              ]}
            >
              Technician
            </Text>
            <Text
              style={[
                styles.tableCell,
                styles.tableHeaderCell,
                styles.dataCell,
              ]}
            >
              Tasks
            </Text>
            <Text
              style={[
                styles.tableCell,
                styles.tableHeaderCell,
                styles.dataCell,
              ]}
            >
              Avg. Time
            </Text>
            <Text
              style={[
                styles.tableCell,
                styles.tableHeaderCell,
                styles.dataCell,
              ]}
            >
              Rating
            </Text>
          </View>

          {[
            { name: "John D.", tasks: 45, time: "3.5h", rating: 4.8 },
            { name: "Sarah M.", tasks: 38, time: "4.2h", rating: 4.6 },
            { name: "Mike R.", tasks: 42, time: "3.8h", rating: 4.9 },
            { name: "Lisa K.", tasks: 39, time: "4.0h", rating: 4.7 },
          ].map((tech, index) => (
            <View key={index} style={styles.tableRow}>
              <View style={[styles.tableCell, styles.nameCell]}>
                <FontAwesome5
                  name="user-alt"
                  size={14}
                  color="#555"
                  style={styles.techIcon}
                />
                <Text style={styles.techName}>{tech.name}</Text>
              </View>
              <Text
                style={[styles.tableCell, styles.dataCell, styles.tasksValue]}
              >
                {tech.tasks}
              </Text>
              <Text style={[styles.tableCell, styles.dataCell]}>
                {tech.time}
              </Text>
              <View
                style={[
                  styles.tableCell,
                  styles.dataCell,
                  styles.ratingContainer,
                ]}
              >
                <Text style={styles.ratingValue}>{tech.rating}</Text>
                <FontAwesome5 name="star" size={10} color="#FFD700" />
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

// Helper function to determine color based on percentage
const getColorForPercentage = (percentage) => {
  if (percentage >= 90) return "#34C759"; // Green for excellent
  if (percentage >= 75) return "#007AFF"; // Blue for good
  if (percentage >= 60) return "#FF9500"; // Orange for average
  return "#FF3B30"; // Red for poor
};

export default Analytics;
