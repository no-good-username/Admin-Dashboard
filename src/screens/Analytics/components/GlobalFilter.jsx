import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { formatDate } from '../utils/dateUtils';
import { styles } from '../styles';

const GlobalDateFilter = ({ 
  globalStartDate, 
  globalEndDate,
  setShowGlobalStartPicker,
  setShowGlobalEndPicker,
  updateGlobalDateRange
}) => {
  return (
    <View style={styles.globalFilterContainer}>
      <Text style={styles.globalFilterLabel}>Date Range:</Text>
      <View style={styles.globalDatePickers}>
        <TouchableOpacity 
          style={styles.globalDateButton}
          onPress={() => setShowGlobalStartPicker(true)}
        >
          <FontAwesome5 name="calendar-alt" size={14} color="#007AFF" style={styles.datePickerIcon} />
          <Text style={styles.globalDateText}>{formatDate(globalStartDate)}</Text>
        </TouchableOpacity>
        
        <Text style={styles.dateRangeDivider}>to</Text>
        
        <TouchableOpacity 
          style={styles.globalDateButton}
          onPress={() => setShowGlobalEndPicker(true)}
        >
          <FontAwesome5 name="calendar-alt" size={14} color="#007AFF" style={styles.datePickerIcon} />
          <Text style={styles.globalDateText}>{formatDate(globalEndDate)}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.applyButton}
          onPress={() => updateGlobalDateRange()}
        >
          <Text style={styles.applyButtonText}>Apply</Text>
        </TouchableOpacity>
      </View>
      
      {/* Quick date options */}
      <View style={styles.quickDateOptions}>
        <TouchableOpacity 
          style={styles.quickDateButton} 
          onPress={() => {
            const today = new Date();
            const lastWeek = new Date(today);
            lastWeek.setDate(today.getDate() - 7);
            updateGlobalDateRange(lastWeek, today);
          }}
        >
          <Text style={styles.quickDateText}>Last 7 Days</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.quickDateButton}
          onPress={() => {
            const today = new Date();
            const lastMonth = new Date(today);
            lastMonth.setDate(today.getDate() - 30);
            updateGlobalDateRange(lastMonth, today);
          }}
        >
          <Text style={styles.quickDateText}>Last 30 Days</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.quickDateButton}
          onPress={() => {
            const today = new Date();
            const startOfYear = new Date(today.getFullYear(), 0, 1);
            updateGlobalDateRange(startOfYear, today);
          }}
        >
          <Text style={styles.quickDateText}>This Year</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default GlobalDateFilter;