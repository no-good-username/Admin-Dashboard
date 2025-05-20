import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { formatDate } from '../utils/dateUtils';
import { styles } from '../styles';

const SectionHeader = ({ title, subtitle, dateRange, sectionId, updateSectionDateRange }) => {
  const handleStartDatePress = () => {
    updateSectionDateRange(sectionId, {
      ...dateRange,
      showStartPicker: true
    });
  };

  const handleEndDatePress = () => {
    updateSectionDateRange(sectionId, {
      ...dateRange,
      showEndPicker: true
    });
  };

  return (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionTitleContainer}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Text style={styles.sectionSubtitle}>{subtitle}</Text>
      </View>
      <View style={styles.sectionDatePicker}>
        <TouchableOpacity 
          style={styles.datePickerButton}
          onPress={handleStartDatePress}
        >
          <FontAwesome5 name="calendar-alt" size={14} color="#007AFF" style={styles.datePickerIcon} />
          <Text style={styles.datePickerText}>{formatDate(dateRange.start)}</Text>
        </TouchableOpacity>
        
        <Text style={styles.dateRangeDivider}>to</Text>
        
        <TouchableOpacity 
          style={styles.datePickerButton}
          onPress={handleEndDatePress}
        >
          <FontAwesome5 name="calendar-alt" size={14} color="#007AFF" style={styles.datePickerIcon} />
          <Text style={styles.datePickerText}>{formatDate(dateRange.end)}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SectionHeader;