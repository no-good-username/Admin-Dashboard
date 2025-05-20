import React from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';

// Components
import GlobalDateFilter from './components/GlobalFilter';
import KeyMetricsSection from './components/KeyMetricsSection';
import IssueAnalyticsChart from './components/IssueAnalyticsChart';
import ResponseTimeChart from './components/ResponseTimeChart';
import IssueTypeChart from './components/IssueTypeChart';
import TechnicianTable from './components/TechnicianTable';
import SimpleDatePickerManager from './components/SimpleDatePickerManager';

// Custom hooks and styles
import useAnalyticsData from './hooks/useAnalyticsData';
import { styles } from './styles';

const Analytics = () => {
  const {
    // Date states
    globalStartDate,
    setGlobalStartDate,
    globalEndDate,
    setGlobalEndDate,
    showGlobalStartPicker,
    setShowGlobalStartPicker,
    showGlobalEndPicker, 
    setShowGlobalEndPicker,
    
    // Loading state
    isLoading,
    
    // Animation values
    animatedValues,
    
    // Actions
    updateGlobalDateRange,
    
    // Data for charts
    issueReportData,
    responseTimeData,
    issueTypeData,
    technicianData
  } = useAnalyticsData();

  // Loading screen
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
        <Text style={styles.loadingText}>Loading analytics data...</Text>
      </View>
    );
  }

  // Main content
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

      {/* Global Date Range Filter */}
      <GlobalDateFilter 
        globalStartDate={globalStartDate}
        globalEndDate={globalEndDate}
        setShowGlobalStartPicker={setShowGlobalStartPicker}
        setShowGlobalEndPicker={setShowGlobalEndPicker}
        updateGlobalDateRange={updateGlobalDateRange}
      />

      {/* Key Metrics */}
      <KeyMetricsSection animatedValues={animatedValues} />

      {/* Charts */}
      <IssueAnalyticsChart issueReportData={issueReportData} />
      <ResponseTimeChart responseTimeData={responseTimeData} />
      <IssueTypeChart issueTypeData={issueTypeData} />
      <TechnicianTable technicianData={technicianData} />
      
      {/* Date Pickers - just global ones now */}
      <SimpleDatePickerManager
        globalStartDate={globalStartDate}
        globalEndDate={globalEndDate}
        showGlobalStartPicker={showGlobalStartPicker}
        showGlobalEndPicker={showGlobalEndPicker}
        setShowGlobalStartPicker={setShowGlobalStartPicker}
        setShowGlobalEndPicker={setShowGlobalEndPicker}
        updateGlobalDateRange={updateGlobalDateRange}
      />
    </ScrollView>
  );
};

export default Analytics;