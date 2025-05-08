import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  Modal, 
  TouchableOpacity, 
  ScrollView,
  StyleSheet,
  Dimensions,
  Animated,
  TouchableWithoutFeedback
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const CustomDatePicker = ({ 
  isVisible, 
  onClose, 
  onDateChange, 
  initialDate = new Date(),
  maximumDate = new Date(2100, 11, 31), 
  minimumDate = new Date(1900, 0, 1) 
}) => {
  // Animation value
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(300)).current;
  
  // Year, month and day arrays
  const [years, setYears] = useState([]);
  const [months] = useState([
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]);
  const [days, setDays] = useState([]);
  
  // Selected values
  const [selectedYear, setSelectedYear] = useState(initialDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(initialDate.getMonth());
  const [selectedDay, setSelectedDay] = useState(initialDate.getDate());

  // Flag to prevent infinite updates
  const [initialized, setInitialized] = useState(false);
  
  // Prepare years array once on mount
  useEffect(() => {
    const minYear = minimumDate.getFullYear();
    const maxYear = maximumDate.getFullYear();
    const yearsArray = [];
    for (let i = minYear; i <= maxYear; i++) {
      yearsArray.push(i);
    }
    setYears(yearsArray);
    
    setInitialized(true);
  }, []); // Empty dependency array to run only once
  
  // Update days based on selected year and month
  useEffect(() => {
    if (!initialized) return;
    
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    const daysArray = [];
    for (let i = 1; i <= daysInMonth; i++) {
      daysArray.push(i);
    }
    setDays(daysArray);
    
    // Adjust selectedDay if needed
    if (selectedDay > daysInMonth) {
      setSelectedDay(daysInMonth);
    }
  }, [selectedYear, selectedMonth, initialized]);
  
  // Reset selected date when initial date changes
  useEffect(() => {
    if (!isVisible) return;
    
    setSelectedYear(initialDate.getFullYear());
    setSelectedMonth(initialDate.getMonth());
    setSelectedDay(initialDate.getDate());
  }, [initialDate, isVisible]);
  
  // Handle modal animations
  useEffect(() => {
    if (isVisible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true
        })
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true
        }),
        Animated.timing(slideAnim, {
          toValue: 300,
          duration: 300,
          useNativeDriver: true
        })
      ]).start();
    }
  }, [isVisible]);
  
  // Apply date selection
  const handleApply = () => {
    const selectedDate = new Date(selectedYear, selectedMonth, selectedDay);
    onDateChange(selectedDate);
    onClose();
  };
  
  // Render each date component
  const renderDateItem = (item, isSelected, itemType) => {
    return (
      <TouchableOpacity
        key={`${itemType}-${item}`}
        style={[
          styles.dateItem,
          isSelected && styles.selectedDateItem
        ]}
        onPress={() => {
          if (itemType === 'year') {
            setSelectedYear(item);
          } else if (itemType === 'month') {
            setSelectedMonth(months.indexOf(item));
          } else if (itemType === 'day') {
            setSelectedDay(item);
          }
        }}
      >
        <Text style={[
          styles.dateItemText,
          isSelected && styles.selectedDateItemText
        ]}>
          {item}
        </Text>
      </TouchableOpacity>
    );
  };
  
  if (!isVisible) return null;
  
  return (
    <Modal
      transparent={true}
      visible={isVisible}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <TouchableWithoutFeedback onPress={onClose}>
          <Animated.View style={[styles.overlay, { opacity: fadeAnim }]} />
        </TouchableWithoutFeedback>
        
        <Animated.View 
          style={[
            styles.pickerContainer,
            { 
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Select Date</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <FontAwesome5 name="times" size={18} color="#666" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.datePickerContainer}>
            <View style={styles.scrollerContainer}>
              <Text style={styles.columnLabel}>Year</Text>
              <ScrollView 
                style={styles.dateScroller}
                contentContainerStyle={styles.scrollerContent}
                showsVerticalScrollIndicator={false}
              >
                {years.map(year => renderDateItem(year, year === selectedYear, 'year'))}
              </ScrollView>
            </View>
            
            <View style={styles.scrollerContainer}>
              <Text style={styles.columnLabel}>Month</Text>
              <ScrollView 
                style={styles.dateScroller}
                contentContainerStyle={styles.scrollerContent}
                showsVerticalScrollIndicator={false}
              >
                {months.map(month => renderDateItem(
                  month, 
                  months.indexOf(month) === selectedMonth, 
                  'month'
                ))}
              </ScrollView>
            </View>
            
            <View style={styles.scrollerContainer}>
              <Text style={styles.columnLabel}>Day</Text>
              <ScrollView 
                style={styles.dateScroller}
                contentContainerStyle={styles.scrollerContent}
                showsVerticalScrollIndicator={false}
              >
                {days.map(day => renderDateItem(day, day === selectedDay, 'day'))}
              </ScrollView>
            </View>
          </View>
          
          <View style={styles.footer}>
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={onClose}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.applyButton}
              onPress={handleApply}
            >
              <Text style={styles.applyButtonText}>Apply</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  pickerContainer: {
    width: width * 0.9,
    maxWidth: 400,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  closeButton: {
    padding: 4,
  },
  datePickerContainer: {
    flexDirection: 'row',
    paddingVertical: 16,
  },
  scrollerContainer: {
    flex: 1,
    alignItems: 'center',
  },
  columnLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666666',
    marginBottom: 8,
  },
  dateScroller: {
    height: 200,
    width: '80%',
  },
  scrollerContent: {
    paddingVertical: 80,
    alignItems: 'center',
  },
  dateItem: {
    paddingVertical: 10,
    paddingHorizontal: 8,
    marginVertical: 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    width: '100%',
  },
  selectedDateItem: {
    backgroundColor: '#E1F5FE',
  },
  dateItemText: {
    fontSize: 16,
    color: '#333333',
  },
  selectedDateItemText: {
    fontWeight: '600',
    color: '#007AFF',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#666666',
  },
  applyButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default CustomDatePicker;