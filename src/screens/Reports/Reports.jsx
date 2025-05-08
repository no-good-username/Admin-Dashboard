import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  ActivityIndicator,
  Modal,
  Platform,
  Animated,
  Share,
  Alert,
  Linking
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import styles from './styles';
import CustomDatePicker from '../../components/CustomDatePicker';

// Import API services - uncomment when ready to connect to backend
// import { reportsApi } from '../../services/api';

// Simple date formatter function
const formatDate = (date) => {
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  
  return `${month} ${day}, ${year}`;
};

// Date manipulation helpers
const subtractDays = (date, days) => {
  const result = new Date(date);
  result.setDate(date.getDate() - days);
  return result;
};

const subtractMonths = (date, months) => {
  const result = new Date(date);
  result.setMonth(date.getMonth() - months);
  return result;
};

const startOfYear = (date) => {
  const result = new Date(date);
  result.setMonth(0, 1);
  result.setHours(0, 0, 0, 0);
  return result;
};

const startOfPreviousYear = (date) => {
  const result = new Date(date);
  result.setFullYear(date.getFullYear() - 1, 0, 1);
  result.setHours(0, 0, 0, 0);
  return result;
};

const endOfPreviousYear = (date) => {
  const result = new Date(date);
  result.setFullYear(date.getFullYear() - 1, 11, 31);
  result.setHours(23, 59, 59, 999);
  return result;
};

const Reports = () => {
  // Animation value
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  
  // States
  
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState('last30');
  const [startDate, setStartDate] = useState(subtractDays(new Date(), 30));
  const [endDate, setEndDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [reportType, setReportType] = useState('issues');
  const [reportFormat, setReportFormat] = useState('pdf');
  const [generating, setGenerating] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  // Fade in animation
  useEffect(() => {
    Animated.timing(
      fadeAnim,
      {
        toValue: 1,
        duration: 800,
        useNativeDriver: true
      }
    ).start();
  }, []);

  // Predefined date ranges
  const handleDateRangeSelect = (range) => {
    setDateRange(range);
    
    const now = new Date();
    let start;
    
    switch (range) {
      case 'today':
        start = new Date(now);
        start.setHours(0, 0, 0, 0);
        break;
      case 'last7':
        start = subtractDays(now, 7);
        break;
      case 'last30':
        start = subtractDays(now, 30);
        break;
      case 'last90':
        start = subtractDays(now, 90);
        break;
      case 'thisYear':
        start = startOfYear(now);
        break;
      case 'lastYear':
        start = startOfPreviousYear(now);
        const endLastYear = endOfPreviousYear(now);
        setEndDate(endLastYear);
        break;
      case 'custom':
        // Don't change dates for custom
        break;
      default:
        start = subtractDays(now, 30);
    }
    
    if (range !== 'custom' && range !== 'lastYear') {
      setEndDate(now);
    }
    
    if (range !== 'custom') {
      setStartDate(start);
    }
  };

  // Handle date selections from custom picker
  const handleStartDateChange = (selectedDate) => {
    setStartDate(selectedDate);
    
    // If start date is after end date, update end date
    if (selectedDate > endDate) {
      setEndDate(selectedDate);
    }
    
    setDateRange('custom');
  };
  
  const handleEndDateChange = (selectedDate) => {
    setEndDate(selectedDate);
    
    // If end date is before start date, update start date
    if (selectedDate < startDate) {
      setStartDate(selectedDate);
    }
    
    setDateRange('custom');
  };

  // Format date for API request
  const formatDateForAPI = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Generate report
  const generateReport = async () => {
    try {
      setGenerating(true);
      
      // Create report request payload
      const reportRequest = {
        startDate: formatDateForAPI(startDate),
        endDate: formatDateForAPI(endDate),
        reportType: reportType,
        format: reportFormat,
        areaId: "13" // Assuming area 13 is the default
      };
      
      console.log("Generating report with params:", reportRequest);
      
      // MOCK API CALL - Replace with actual API call when backend is ready
      // const result = await reportsApi.generateReport(reportRequest);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock success response with download URL
      const mockDownloadUrl = `https://example.com/reports/report_${Date.now()}.${reportFormat}`;
      setDownloadUrl(mockDownloadUrl);
      setShowSuccessModal(true);
      
      // For real implementation, uncomment:
      // if (result && result.downloadUrl) {
      //   setDownloadUrl(result.downloadUrl);
      //   setShowSuccessModal(true);
      // } else {
      //   throw new Error('Failed to generate report');
      // }
      
    } catch (error) {
      console.error('Error generating report:', error);
      Alert.alert(
        'Report Generation Failed',
        'There was an error generating your report. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setGenerating(false);
    }
  };

  // Handle download of report
  const handleDownload = async () => {
    if (!downloadUrl) return;
    
    try {
      // For mobile, open URL in browser or handle with file download
      await Linking.openURL(downloadUrl);
      
      // Alternative: use Share API to offer sharing options
      // await Share.share({
      //   title: 'Download Report',
      //   message: `Your ${getReportTypeName(reportType)} report is ready to download`,
      //   url: downloadUrl
      // });
    } catch (error) {
      console.error('Error opening download URL:', error);
      Alert.alert(
        'Download Failed',
        'Unable to download the report. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  // Report type options
  const reportTypes = [
    { id: 'issues', label: 'Issues Summary', icon: 'tasks' },
    { id: 'performance', label: 'Performance Metrics', icon: 'chart-line' },
    { id: 'maintenance', label: 'Maintenance Records', icon: 'tools' },
    { id: 'assignments', label: 'Linesmen Assignments', icon: 'user-hard-hat' }
  ];

  // Report format options
  const reportFormats = [
    { id: 'pdf', label: 'PDF Document', icon: 'file-pdf' },
    { id: 'excel', label: 'Excel Spreadsheet', icon: 'file-excel' },
    { id: 'csv', label: 'CSV File', icon: 'file-csv' }
  ];

  // Get report type name by id
  const getReportTypeName = (id) => {
    const reportType = reportTypes.find(t => t.id === id);
    return reportType ? reportType.label : 'Unknown';
  };

  // Get report format name by id
  const getReportFormatName = (id) => {
    const reportFormat = reportFormats.find(f => f.id === id);
    return reportFormat ? reportFormat.label : 'Unknown';
  };

  return (
    <>
      <ScrollView style={styles.container}>
        {/* Header */}
        <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Reports Generator</Text>
            <Text style={styles.headerSubtitle}>Create and download custom reports</Text>
          </View>
        </Animated.View>
        
        {/* Date Range Selection */}
        <Animated.View 
          style={[
            styles.card, 
            { opacity: fadeAnim, transform: [{ translateY: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [20, 0]
            })}] }
          ]}
        >
          <View style={styles.cardHeader}>
            <FontAwesome5 name="calendar-alt" size={18} color="#007AFF" />
            <Text style={styles.cardTitle}>Select Time Period</Text>
          </View>
          
          <View style={styles.quickFilters}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <TouchableOpacity 
                style={[styles.filterPill, dateRange === 'today' && styles.filterPillActive]}
                onPress={() => handleDateRangeSelect('today')}
              >
                <Text style={[styles.filterPillText, dateRange === 'today' && styles.filterPillTextActive]}>
                  Today
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.filterPill, dateRange === 'last7' && styles.filterPillActive]}
                onPress={() => handleDateRangeSelect('last7')}
              >
                <Text style={[styles.filterPillText, dateRange === 'last7' && styles.filterPillTextActive]}>
                  Last 7 Days
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.filterPill, dateRange === 'last30' && styles.filterPillActive]}
                onPress={() => handleDateRangeSelect('last30')}
              >
                <Text style={[styles.filterPillText, dateRange === 'last30' && styles.filterPillTextActive]}>
                  Last 30 Days
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.filterPill, dateRange === 'last90' && styles.filterPillActive]}
                onPress={() => handleDateRangeSelect('last90')}
              >
                <Text style={[styles.filterPillText, dateRange === 'last90' && styles.filterPillTextActive]}>
                  Last 90 Days
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.filterPill, dateRange === 'thisYear' && styles.filterPillActive]}
                onPress={() => handleDateRangeSelect('thisYear')}
              >
                <Text style={[styles.filterPillText, dateRange === 'thisYear' && styles.filterPillTextActive]}>
                  This Year
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.filterPill, dateRange === 'lastYear' && styles.filterPillActive]}
                onPress={() => handleDateRangeSelect('lastYear')}
              >
                <Text style={[styles.filterPillText, dateRange === 'lastYear' && styles.filterPillTextActive]}>
                  Last Year
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
          
          <View style={styles.customDateRange}>
            <Text style={styles.sectionLabel}>Custom Date Range</Text>
            
            <View style={styles.datePickerRow}>
              <View style={styles.datePickerContainer}>
                <Text style={styles.datePickerLabel}>Start Date</Text>
                <TouchableOpacity 
                  style={styles.datePickerButton}
                  onPress={() => setShowStartDatePicker(true)}
                >
                  <FontAwesome5 name="calendar-alt" size={16} color="#007AFF" style={styles.datePickerIcon} />
                  <Text style={styles.datePickerText}>{formatDate(startDate)}</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.datePickerDivider}>
                <Text style={styles.datePickerDividerText}>to</Text>
              </View>
              
              <View style={styles.datePickerContainer}>
                <Text style={styles.datePickerLabel}>End Date</Text>
                <TouchableOpacity 
                  style={styles.datePickerButton}
                  onPress={() => setShowEndDatePicker(true)}
                >
                  <FontAwesome5 name="calendar-alt" size={16} color="#007AFF" style={styles.datePickerIcon} />
                  <Text style={styles.datePickerText}>{formatDate(endDate)}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Animated.View>
        
        {/* Report Type Selection */}
        <Animated.View 
          style={[
            styles.card, 
            { opacity: fadeAnim, transform: [{ translateY: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [40, 0]
            })}] }
          ]}
        >
          <View style={styles.cardHeader}>
            <FontAwesome5 name="file-alt" size={18} color="#007AFF" />
            <Text style={styles.cardTitle}>Report Type</Text>
          </View>
          
          <View style={styles.reportTypeGrid}>
            {reportTypes.map(type => (
              <TouchableOpacity
                key={type.id}
                style={[styles.reportTypeCard, reportType === type.id && styles.reportTypeCardActive]}
                onPress={() => setReportType(type.id)}
              >
                <View style={[styles.reportTypeIconContainer, reportType === type.id && styles.reportTypeIconContainerActive]}>
                  <FontAwesome5 name={type.icon} size={20} color={reportType === type.id ? "#FFFFFF" : "#007AFF"} />
                </View>
                <Text style={[styles.reportTypeLabel, reportType === type.id && styles.reportTypeLabelActive]}>
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>
        
        {/* Report Format Selection */}
        <Animated.View 
          style={[
            styles.card, 
            { opacity: fadeAnim, transform: [{ translateY: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [60, 0]
            })}] }
          ]}
        >
          <View style={styles.cardHeader}>
            <FontAwesome5 name="file-export" size={18} color="#007AFF" />
            <Text style={styles.cardTitle}>Output Format</Text>
          </View>
          
          <View style={styles.formatOptions}>
            {reportFormats.map(format => (
              <TouchableOpacity
                key={format.id}
                style={[styles.formatOption, reportFormat === format.id && styles.formatOptionActive]}
                onPress={() => setReportFormat(format.id)}
              >
                <FontAwesome5 
                  name={format.icon} 
                  size={18} 
                  color={reportFormat === format.id ? "#FFFFFF" : "#333"} 
                  style={styles.formatIcon} 
                />
                <Text style={[styles.formatText, reportFormat === format.id && styles.formatTextActive]}>
                  {format.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>
        
        {/* Generate Button */}
        <Animated.View 
          style={[
            styles.generateButtonContainer, 
            { opacity: fadeAnim, transform: [{ translateY: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [80, 0]
            })}] }
          ]}
        >
          {downloadUrl ? (
            <TouchableOpacity style={styles.downloadButton} onPress={handleDownload}>
              <FontAwesome5 name="download" size={20} color="#FFFFFF" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Download Report</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={styles.generateButton} 
              onPress={generateReport}
              disabled={generating}
            >
              {generating ? (
                <>
                  <ActivityIndicator size="small" color="#FFFFFF" style={styles.buttonIcon} />
                  <Text style={styles.buttonText}>Generating...</Text>
                </>
              ) : (
                <>
                  <FontAwesome5 name="file-medical" size={20} color="#FFFFFF" style={styles.buttonIcon} />
                  <Text style={styles.buttonText}>Generate Report</Text>
                </>
              )}
            </TouchableOpacity>
          )}
        </Animated.View>
        
        {/* Report Info */}
        <Animated.View 
          style={[
            styles.reportInfoCard, 
            { opacity: fadeAnim, transform: [{ translateY: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [100, 0]
            })}] }
          ]}
        >
          <View style={styles.reportInfoHeader}>
            <FontAwesome5 name="info-circle" size={18} color="#666" />
            <Text style={styles.reportInfoTitle}>Report Information</Text>
          </View>
          
          <View style={styles.reportInfoContent}>
            <View style={styles.reportInfoItem}>
              <Text style={styles.reportInfoLabel}>Time Period:</Text>
              <Text style={styles.reportInfoValue}>
                {formatDate(startDate)} - {formatDate(endDate)}
              </Text>
            </View>
            
            <View style={styles.reportInfoItem}>
              <Text style={styles.reportInfoLabel}>Report Type:</Text>
              <Text style={styles.reportInfoValue}>
                {getReportTypeName(reportType)}
              </Text>
            </View>
            
            <View style={styles.reportInfoItem}>
              <Text style={styles.reportInfoLabel}>Format:</Text>
              <Text style={styles.reportInfoValue}>
                {getReportFormatName(reportFormat)}
              </Text>
            </View>
            
            <View style={styles.reportInfoItem}>
              <Text style={styles.reportInfoLabel}>Coverage:</Text>
              <Text style={styles.reportInfoValue}>
                All streetlights in Area 13
              </Text>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
      
      {/* Custom Date Pickers */}
      <CustomDatePicker 
        isVisible={showStartDatePicker}
        onClose={() => setShowStartDatePicker(false)}
        onDateChange={handleStartDateChange}
        initialDate={startDate}
        maximumDate={new Date()}
      />
      
      <CustomDatePicker 
        isVisible={showEndDatePicker}
        onClose={() => setShowEndDatePicker(false)}
        onDateChange={handleEndDateChange}
        initialDate={endDate}
        maximumDate={new Date()}
        minimumDate={startDate}
      />
      
      {/* Success Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showSuccessModal}
        onRequestClose={() => setShowSuccessModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.successModal}>
            <View style={styles.successIconContainer}>
              <FontAwesome5 name="check-circle" size={50} color="#34C759" />
            </View>
            <Text style={styles.successTitle}>Report Generated!</Text>
            <Text style={styles.successMessage}>
              Your {getReportTypeName(reportType)} report has been successfully generated and is ready to download.
            </Text>
            <TouchableOpacity 
              style={styles.downloadButton}
              onPress={() => {
                handleDownload();
                setShowSuccessModal(false);
              }}
            >
              <FontAwesome5 name="download" size={20} color="#FFFFFF" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Download Now</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.closeModalButton}
              onPress={() => setShowSuccessModal(false)}
            >
              <Text style={styles.closeModalText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default Reports;