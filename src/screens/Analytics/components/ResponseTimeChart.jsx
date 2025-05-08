import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import InsightItem from './InsightItem';
import { styles } from '../styles';

const ResponseTimeChart = ({ responseTimeData }) => {
  return (
    <View style={styles.chartSection}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleContainer}>
          <Text style={styles.sectionTitle}>Response Time Trends</Text>
          <Text style={styles.sectionSubtitle}>Average hours to first response</Text>
        </View>
      </View>
      
      <View style={styles.chartContainer}>
        <LineChart
          data={responseTimeData}
          width={Dimensions.get("window").width - 40}
          height={220}
          yAxisSuffix="h"
          chartConfig={{
            backgroundColor: "#ffffff",
            backgroundGradientFrom: "#ffffff",
            backgroundGradientTo: "#ffffff",
            decimalPlaces: 1,
            color: (opacity = 1) => `rgba(90, 90, 240, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: { borderRadius: 16 },
            propsForDots: {
              r: "4",
              strokeWidth: "2",
              stroke: "#5856D6",
            },
            propsForLabels: { fontSize: 11 },
          }}
          bezier
          style={styles.chart}
          withInnerLines={false}
        />
      </View>
      
      <View style={styles.chartInsights}>
        <InsightItem 
          icon="arrow-down" 
          color="#34C759" 
          text="10% faster response time compared to last month" 
        />
        <InsightItem 
          icon="clock" 
          color="#FF9500" 
          text="Slowest response time: Weekends (6.8h average)" 
        />
      </View>
    </View>
  );
};

export default ResponseTimeChart;