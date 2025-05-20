import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import InsightItem from './InsightItem';
import { styles } from '../styles';

const IssueAnalyticsChart = ({ issueReportData }) => {
  return (
    <View style={styles.chartSection}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleContainer}>
          <Text style={styles.sectionTitle}>Issue Analytics</Text>
          <Text style={styles.sectionSubtitle}>Number of reported issues over time</Text>
        </View>
      </View>
      
      <View style={styles.chartContainer}>
        <BarChart
          data={issueReportData}
          width={Dimensions.get("window").width - 40}
          height={220}
          chartConfig={{
            backgroundColor: "#ffffff",
            backgroundGradientFrom: "#ffffff",
            backgroundGradientTo: "#ffffff",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: { borderRadius: 16 },
            barPercentage: 0.7,
            propsForLabels: { fontSize: 11 },
            propsForVerticalLabels: { fontSize: 11 },
          }}
          style={styles.chart}
          showValuesOnTopOfBars
          fromZero
          withInnerLines={false}
        />
      </View>
      
      <View style={styles.chartInsights}>
        <InsightItem 
          icon="arrow-up" 
          color="#FF3B30" 
          text="15% increase in reports compared to previous period" 
        />
        <InsightItem 
          icon="calendar-check" 
          color="#34C759" 
          text="Peak reporting days: Monday and Wednesday" 
        />
      </View>
    </View>
  );
};

export default IssueAnalyticsChart;