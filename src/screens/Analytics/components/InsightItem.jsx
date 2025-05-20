import React from 'react';
import { View, Text } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { styles } from '../styles';

const InsightItem = ({ icon, color, text }) => {
  return (
    <View style={styles.insightItem}>
      <FontAwesome5 name={icon} size={14} color={color} style={styles.insightIcon} />
      <Text style={styles.insightText}>{text}</Text>
    </View>
  );
};

export default InsightItem;