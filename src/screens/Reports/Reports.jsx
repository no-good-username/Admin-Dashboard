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
  Alert,
  Linking
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import useIssueStore from '../IssueManagement/stores/issueStore'; // Import issue store
import styles from './styles';
import CustomDatePicker from '../../components/CustomDatePicker';

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
  // Get issues from issue store
  const { 
    issues, 
    loading: issuesLoading, 
    fetchIssues 
  } = useIssueStore();
  
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
  const [htmlContent, setHtmlContent] = useState('');
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  
  // Load issues data on component mount
  useEffect(() => {
    fetchIssues();
  }, []);
  
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
  const parseManually = (str) => {
  const months = {
    Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
    Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
  };

  const parts = str.split(' ');
  if (parts.length !== 3) return null;

  const month = months[parts[0]];
  const day = parseInt(parts[1].replace(',', ''));
  const year = parseInt(parts[2]);

  if (isNaN(month) || isNaN(day) || isNaN(year)) return null;
  return new Date(year, month, day);
};


  // Generate Issues Summary HTML
  const generateIssuesSummaryHTML = () => {
    // Filter issues based on date range
    const filteredIssues = issues.filter(issue => {
      // Parse the date string - use try/catch to handle potential invalid dates
      try {
        let reportDate = parseManually(issue.date);reportDate;
        if (issue.date && issue.date !== "Unknown date") {
          // If date is in format like "Jan 15, 2023"
          console.log("Parsing date:", issue.date);
          reportDate = parseManually(issue.date);
          console.log("Parsed date:", reportDate);
        } else if (issue.createdAt) {
          reportDate = parseManually(issue.date);
        } else {
          // Default to current date to make the item appear in the report
          reportDate = new Date();
        }
        
        // Check if date parsing worked and filter based on date range
        if (!isNaN(reportDate.getTime())) {
          return reportDate >= startDate && reportDate <= endDate;
        }
        return true; // Include items with unparseable dates
      } catch (error) {
        console.log("Error parsing date:", error);
        return true; // Include items with date parsing errors
      }
    });

    const openCount = filteredIssues.filter(r => r.status?.toLowerCase() === 'open').length || 0;
    const inProgressCount = filteredIssues.filter(r => r.status?.toLowerCase() === 'in progress').length || 0;
    const resolvedCount = filteredIssues.filter(r => r.status?.toLowerCase() === 'resolved').length || 0;
    const closedCount = filteredIssues.filter(r => r.status?.toLowerCase() === 'closed').length || 0;

    const getStatusClass = (status) => {
      if (!status) return 'status-unknown';
      const statusLower = status.toLowerCase();
      if (statusLower === 'open') return 'status-open';
      if (statusLower === 'in progress') return 'status-in-progress';
      if (statusLower === 'resolved') return 'status-resolved';
      if (statusLower === 'closed') return 'status-closed';
      return 'status-unknown';
    };

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; 
              padding: 20px; 
              color: #333;
              line-height: 1.5;
            }
            h1 { 
              color: #333; 
              font-size: 28px; 
              text-align: center; 
              margin-bottom: 5px;
            }
            h2 { 
              color: #444; 
              font-size: 22px; 
              margin-top: 30px; 
              margin-bottom: 15px;
              border-bottom: 2px solid #f2f2f2;
              padding-bottom: 8px;
            }
            h3 {
              color: #555;
              font-size: 18px;
              margin-bottom: 12px;
              font-weight: 600;
            }
            .header { 
              text-align: center; 
              margin-bottom: 30px; 
              border-bottom: 2px solid #eaeaea;
              padding-bottom: 20px;
            }
            .logo { 
              text-align: center; 
              margin-bottom: 10px; 
            }
            .date-range { 
              font-size: 15px; 
              color: #666; 
              text-align: center; 
              margin-bottom: 5px; 
            }
            .generated-date {
              font-size: 13px;
              color: #888;
              text-align: center;
            }
            table { 
              width: 100%; 
              border-collapse: collapse; 
              margin: 20px 0;
              font-size: 14px;
            }
            thead { 
              background-color: #f9f9f9; 
            }
            th { 
              text-align: left; 
              padding: 12px 10px; 
              border-bottom: 2px solid #ddd; 
              font-weight: 600;
            }
            td { 
              padding: 10px; 
              border-bottom: 1px solid #eee; 
              vertical-align: middle;
            }
            tr:hover {
              background-color: #f9f9f9;
            }
            .status-badge { 
              display: inline-block;
              padding: 4px 10px;
              border-radius: 12px;
              font-size: 12px;
              font-weight: 500;
              text-align: center;
            }
            .status-open { 
              background-color: #FF3B30; 
              color: white;
            }
            .status-in-progress { 
              background-color: #FF9500; 
              color: white;
            }
            .status-resolved { 
              background-color: #34C759; 
              color: white;
            }
            .status-closed { 
              background-color: #8E8E93; 
              color: white;
            }
            .status-unknown {
              background-color: #E5E5EA;
              color: #8E8E93;
            }
            .summary-box { 
              background-color: #f9f9f9; 
              border-radius: 8px; 
              padding: 20px; 
              margin-bottom: 30px;
              box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            }
            .summary-stats {
              display: flex;
              flex-wrap: wrap;
              justify-content: space-between;
              margin-top: 15px;
            }
            .stat-item {
              flex: 1 0 45%;
              margin-bottom: 15px;
              min-width: 180px;
            }
            .stat-number {
              font-size: 28px;
              font-weight: 700;
              margin-bottom: 5px;
            }
            .open-stat .stat-number {
              color: #FF3B30;
            }
            .in-progress-stat .stat-number {
              color: #FF9500;
            }
            .resolved-stat .stat-number {
              color: #34C759;
            }
            .closed-stat .stat-number {
              color: #8E8E93;
            }
            .stat-label {
              font-size: 14px;
              color: #666;
            }
            .footer {
              margin-top: 40px;
              text-align: center;
              font-size: 12px;
              color: #999;
              border-top: 1px solid #eee;
              padding-top: 20px;
            }
            .no-data {
              text-align: center;
              padding: 30px;
              color: #999;
              font-style: italic;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">
              <h1>StreetLight Management System</h1>
            </div>
            <h2>Issues Summary Report</h2>
            <div class="date-range">
              ${formatDate(startDate)} to ${formatDate(endDate)}
            </div>
            <div class="generated-date">
              Generated on ${new Date().toLocaleString()}
            </div>
          </div>

          <div class="summary-box">
            <h3>Report Overview</h3>
            <div class="summary-stats">
              <div class="stat-item">
                <div class="stat-number">${filteredIssues.length}</div>
                <div class="stat-label">Total Issues</div>
              </div>
              <div class="stat-item open-stat">
                <div class="stat-number">${openCount}</div>
                <div class="stat-label">Open Issues</div>
              </div>
              <div class="stat-item in-progress-stat">
                <div class="stat-number">${inProgressCount}</div>
                <div class="stat-label">In Progress</div>
              </div>
              <div class="stat-item resolved-stat">
                <div class="stat-number">${resolvedCount}</div>
                <div class="stat-label">Resolved Issues</div>
              </div>
              <div class="stat-item closed-stat">
                <div class="stat-number">${closedCount}</div>
                <div class="stat-label">Closed Issues</div>
              </div>
            </div>
          </div>

          <h2>Detailed Issue List</h2>
          ${filteredIssues.length > 0 ? `
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Issue</th>
                <th>Location</th>
                <th>Reported By</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${filteredIssues.map(issue => `
                <tr>
                  <td>${issue.id || issue.taskId || '-'}</td>
                  <td>${issue.issue || 'N/A'}</td>
                  <td>${issue.location || 'N/A'}</td>
                  <td>${issue.reportedBy || 'Anonymous'}</td>
                  <td>${issue.date || 'Unknown date'}</td>
                  <td>
                    <div class="status-badge ${getStatusClass(issue.status)}">
                      ${issue.status || 'Unknown'}
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          ` : `<div class="no-data">No issues found for the selected date range</div>`}

          <div class="footer">
            <p>This is an automatically generated report from StreetLight Management System</p>
            <p>© ${new Date().getFullYear()} StreetLight Management</p>
          </div>
        </body>
      </html>
    `;
  };

  // Share HTML as PDF
  const shareHtmlAsPdf = async () => {
    try {
      // Create a filename for the PDF
      const fileName = `Issues_Summary_${formatDateForAPI(startDate)}_to_${formatDateForAPI(endDate)}.pdf`;
      
      // For a real implementation, you would convert HTML to PDF here
      // Since direct HTML to PDF is complex on React Native, we're showing HTML in WebView
      
      // In a production app, use a library like react-native-html-to-pdf or a cloud service for proper PDF generation
      
      setShowPdfPreview(true);
      return true;
    } catch (error) {
      console.error('Error sharing PDF:', error);
      return false;
    }
  };

  // Generate report with fresh data
  const generateReport = async () => {
    try {
      setGenerating(true);
      
      // For issues summary in PDF format, first fetch latest issues data
      if (reportType === 'issues' && reportFormat === 'pdf') {
        // Fetch fresh data from API before generating the report
        await fetchIssues();
        
        // Now generate HTML content with the latest data
        const html = generateIssuesSummaryHTML();
        setHtmlContent(html);
        
        const success = await shareHtmlAsPdf();
        if (success) {
          setDownloadUrl('pdf-generated');
          setShowSuccessModal(true);
        } else {
          Alert.alert(
            'Report Generation Failed',
            'There was an error generating your PDF. Please try again.',
            [{ text: 'OK' }]
          );
        }
      } else {
        // Other report types - use mock functionality
        
        // Create report request payload
        const reportRequest = {
          startDate: formatDateForAPI(startDate),
          endDate: formatDateForAPI(endDate),
          reportType: reportType,
          format: reportFormat,
          areaId: "13" // Assuming area 13 is the default
        };
        
        console.log("Generating report with params:", reportRequest);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Mock success response with download URL
        const mockDownloadUrl = `https://example.com/reports/report_${Date.now()}.${reportFormat}`;
        setDownloadUrl(mockDownloadUrl);
        setShowSuccessModal(true);
      }
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
      // For PDF preview, we've already shown the preview
      if (downloadUrl === 'pdf-generated') {
        setShowPdfPreview(true);
        setShowSuccessModal(false);
        return;
      }
      
      // For other report types, open URL
      await Linking.openURL(downloadUrl);
    } catch (error) {
      console.error('Error opening download URL:', error);
      Alert.alert(
        'Download Failed',
        'Unable to download the report. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  // Share PDF from the preview
  const sharePdf = async () => {
    try {
      Alert.alert(
        "Share PDF",
        "In a production app, this would allow sharing the PDF via the device's share sheet."
      );
      // In a real implementation, you would share the PDF file here
      // using Sharing.shareAsync(pdfUri)
    } catch (error) {
      console.error('Error sharing PDF:', error);
      Alert.alert('Error', 'Unable to share the report');
    }
  };

  // Report type options
  const reportTypes = [
    { id: 'issues', label: 'Issues Summary', icon: 'tasks' },
    // { id: 'performance', label: 'Performance Metrics', icon: 'chart-line' },
    // { id: 'maintenance', label: 'Maintenance Records', icon: 'tools' },
    { id: 'assignments', label: 'Linesmen Assignments', icon: 'user-hard-hat' }
  ];

  // Report format options
  const reportFormats = [
    { id: 'pdf', label: 'PDF Document', icon: 'file-pdf' },
    // { id: 'excel', label: 'Excel Spreadsheet', icon: 'file-excel' },
    // { id: 'csv', label: 'CSV File', icon: 'file-csv' }
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
              disabled={generating || issuesLoading}
            >
              {generating || issuesLoading ? (
                <>
                  <ActivityIndicator size="small" color="#FFFFFF" style={styles.buttonIcon} />
                  <Text style={styles.buttonText}>
                    {issuesLoading ? 'Loading data...' : 'Generating...'}
                  </Text>
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
              <Text style={styles.reportInfoLabel}>Data Source:</Text>
              <Text style={styles.reportInfoValue}>
                {reportType === 'issues' ? 'Live API data' : 'System database'}
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
              Your {getReportTypeName(reportType)} report has been successfully generated and is ready to view.
            </Text>
            <TouchableOpacity 
              style={styles.downloadButton}
              onPress={() => {
                handleDownload();
                setShowSuccessModal(false);
              }}
            >
              <FontAwesome5 name="eye" size={20} color="#FFFFFF" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>{reportFormat === 'pdf' ? 'View PDF' : 'Download Now'}</Text>
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
      
      {/* PDF Preview Modal */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={showPdfPreview}
        onRequestClose={() => setShowPdfPreview(false)}
      >
        <View style={styles.pdfPreviewContainer}>
          <View style={styles.pdfPreviewHeader}>
            <Text style={styles.pdfPreviewTitle}>Issues Summary Report</Text>
            <TouchableOpacity 
              style={styles.pdfPreviewCloseButton}
              onPress={() => setShowPdfPreview(false)}
            >
              <FontAwesome5 name="times" size={24} color="#333" />
            </TouchableOpacity>
          </View>
          
          <WebView
            originWhitelist={['*']}
            source={{ html: htmlContent }}
            style={styles.pdfPreview}
          />
          
          <View style={styles.pdfPreviewFooter}>
            <TouchableOpacity 
              style={styles.pdfPreviewShareButton}
              onPress={sharePdf}
            >
              <FontAwesome5 name="share-alt" size={18} color="#FFF" style={styles.buttonIcon} />
              <Text style={styles.pdfPreviewShareButtonText}>Share Report</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default Reports;