import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import InsightItem from './InsightItem';
import { styles } from '../styles';

const IssueTypeChart = ({ issueTypeData }) => {
  return (
    <View style={styles.chartSection}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleContainer}>
          <Text style={styles.sectionTitle}>Issue Type Distribution</Text>
          <Text style={styles.sectionSubtitle}>Breakdown of reported problems</Text>
        </View>
      </View>
      
      <View style={styles.chartContainer}>
        <PieChart
          data={issueTypeData}
          width={Dimensions.get("window").width - 40}
          height={200}
          chartConfig={{
            backgroundColor: "#ffffff",
            backgroundGradientFrom: "#ffffff",
            backgroundGradientTo: "#ffffff",
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          accessor={"population"}
          backgroundColor={"transparent"}
          paddingLeft={"0"}
          center={[10, 0]}
          absolute
        />
      </View>
      
      <View style={styles.chartInsights}>
        <InsightItem 
          icon="lightbulb" 
          color="#FF9500" 
          text="Non-functional lights remain the most common issue (42%)" 
        />
        <InsightItem 
          icon="arrow-up" 
          color="#5856D6" 
          text="23% increase in damage reports since last period" 
        />
      </View>
    </View>
  );
};

export default IssueTypeChart;