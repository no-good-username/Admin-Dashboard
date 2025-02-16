// screens/ReportDetail/ReportDetail.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { FontAwesome } from '@expo/vector-icons';
import styles from './styles';

const ReportDetail = ({ route }) => {
  const { report } = route.params;
  const [statusUpdate, setStatusUpdate] = useState('');
  const [updates, setUpdates] = useState(report.updates || []);
  const [selectedLinesmen, setSelectedLinesmen] = useState(report.assignedLinesmen || []);

  const linesmen = [
    { label: 'John Doe', value: '1' },
    { label: 'Jane Smith', value: '2' },
    { label: 'Mike Johnson', value: '3' },
    { label: 'Emily Brown', value: '4' },
  ];

  const sendUpdate = () => {
    if (statusUpdate.trim()) {
      const newUpdate = {
        id: Date.now().toString(),
        text: statusUpdate,
        timestamp: new Date().toISOString(),
      };
      setUpdates([newUpdate, ...updates]);
      setStatusUpdate('');
    }
  };

  const toggleLinesman = (item) => {
    setSelectedLinesmen((current) =>
      current.some((l) => l.value === item.value)
        ? current.filter((l) => l.value !== item.value)
        : [...current, item]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{report.issue}</Text>
      <Text style={styles.description}>{report.description}</Text>
      
      {/* Placeholder for image */}
      <View style={{
        width: '100%',
        height: 200,
        backgroundColor: '#E0E0E0',
        borderRadius: 10,
        marginBottom: 20,
      }} />

      <View style={styles.updateContainer}>
        <TextInput
          style={styles.input}
          value={statusUpdate}
          onChangeText={setStatusUpdate}
          placeholder="Send an update to the user..."
          multiline
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendUpdate}>
          <FontAwesome name="send" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Updates</Text>
      <FlatList
        data={updates}
        renderItem={({ item }) => (
          <View style={styles.updateItem}>
            <Text style={styles.updateText}>{item.text}</Text>
            <Text style={styles.updateTimestamp}>
              {new Date(item.timestamp).toLocaleString()}
            </Text>
          </View>
        )}
        keyExtractor={(item) => item.id}
        style={styles.updatesList}
        nestedScrollEnabled
        ListEmptyComponent={
          <Text style={styles.emptyListText}>
            No updates sent to the user yet.
          </Text>
        }
      />

      <Text style={styles.sectionTitle}>Assign Linesmen</Text>
      <Dropdown
        style={styles.dropdown}
        data={linesmen}
        labelField="label"
        valueField="value"
        placeholder="Select Linesmen"
        value={selectedLinesmen.map(l => l.value)}
        onChange={toggleLinesman}
        renderItem={(item) => (
          <View style={styles.dropdownItem}>
            <Text style={styles.dropdownItemText}>{item.label}</Text>
            {selectedLinesmen.some(l => l.value === item.value) ? (
              <TouchableOpacity onPress={() => toggleLinesman(item)}>
                <FontAwesome name="times" size={18} color="#FF3B30" />
              </TouchableOpacity>
            ) : (
              <FontAwesome name="plus" size={18} color="#007AFF" />
            )}
          </View>
        )}
        multiple
      />
      
      {/* Render selected linesmen as pill-shaped items below the dropdown */}
      <View style={styles.selectedLinesmenContainer}>
        {selectedLinesmen.map((item) => (
          <View key={item.value} style={styles.selectedLinesman}>
            <Text style={styles.selectedLinesmanText}>{item.label}</Text>
            <TouchableOpacity onPress={() => toggleLinesman(item)}>
              <FontAwesome name="times" size={18} color="#FF3B30" />
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
};

export default ReportDetail;
