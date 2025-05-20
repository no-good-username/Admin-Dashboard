import React from 'react';
import { View, Text } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import InsightItem from './InsightItem';
import { styles } from '../styles';

const TechnicianTable = ({ technicianData }) => {
  // Find top performer
  const topPerformer = technicianData.reduce((max, tech) => 
    tech.completed > max.completed ? tech : max, technicianData[0]);

  return (
    <View style={styles.chartSection}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleContainer}>
          <Text style={styles.sectionTitle}>Technician Performance</Text>
          <Text style={styles.sectionSubtitle}>Average completion metrics</Text>
        </View>
      </View>
      
      <View style={styles.techTable}>
        <View style={styles.techTableHeader}>
          <Text style={[styles.techTableCell, styles.techTableHeaderCell, styles.techNameCell]}>
            Technician
          </Text>
          <Text style={[styles.techTableCell, styles.techTableHeaderCell]}>
            Completed
          </Text>
          <Text style={[styles.techTableCell, styles.techTableHeaderCell]}>
            Avg. Time
          </Text>
        </View>
        
        {technicianData.map((tech, index) => (
          <View key={index} style={styles.techTableRow}>
            <View style={[styles.techTableCell, styles.techNameCell]}>
              <FontAwesome5
                name="user-alt"
                size={14}
                color="#555"
                style={styles.techIcon}
              />
              <Text style={styles.techName}>{tech.name}</Text>
            </View>
            <Text style={styles.techTableCell}>
              <Text style={styles.techCompletedValue}>{tech.completed}</Text>
            </Text>
            <Text style={styles.techTableCell}>
              {tech.time}
            </Text>
          </View>
        ))}
      </View>
      
      <View style={styles.chartInsights}>
        <InsightItem 
          icon="trophy" 
          color="#FFD700" 
          text={`Top performer: ${topPerformer.name} with ${topPerformer.completed} completed tasks`}
        />
        <InsightItem 
          icon="bolt" 
          color="#34C759" 
          text="Team productivity increased 8% this period" 
        />
      </View>
    </View>
  );
};

export default TechnicianTable;