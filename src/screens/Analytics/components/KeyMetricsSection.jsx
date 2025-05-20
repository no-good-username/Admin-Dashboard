import React from 'react';
import { View, Text } from 'react-native';
import SummaryCard from './SummaryCard';
import { styles } from '../styles';

const KeyMetricsSection = ({ animatedValues }) => {
  return (
    <>
      <View style={styles.metricsHeader}>
        <Text style={styles.sectionTitle}>Key Metrics</Text>
        <Text style={styles.sectionSubtitle}>
          Overview of system performance
        </Text>
      </View>

      <View style={styles.summaryRow}>
        <SummaryCard
          title="Total Issues"
          value="147"
          subtitle="Reported issues"
          icon="exclamation-circle"
          animatedValue={animatedValues.totalIssues}
        />
        <SummaryCard
          title="Resolved"
          value="118"
          subtitle="Completed issues"
          icon="check-circle"
          animatedValue={animatedValues.resolvedIssues}
        />
      </View>

      <View style={styles.summaryRow}>
        <SummaryCard
          title="Response Time"
          value="4.2h"
          subtitle="Average first response"
          icon="clock"
          animatedValue={animatedValues.responseTime}
        />
        <SummaryCard
          title="Priority Issues"
          value="24"
          subtitle="High priority cases"
          icon="exclamation-triangle"
          animatedValue={animatedValues.priorityIssues}
        />
      </View>
    </>
  );
};

export default KeyMetricsSection;