import React from 'react';
import { View, Text, Animated } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { styles } from '../styles';

const SummaryCard = ({ title, value, subtitle, icon, animatedValue }) => {
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

export default SummaryCard;