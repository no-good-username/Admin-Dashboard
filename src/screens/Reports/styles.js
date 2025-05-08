import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  
  // Header styles
  header: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    marginBottom: 16,
  },
  headerContent: {
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666666',
  },
  
  // Card styles
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
    color: '#333333',
  },
  
  // Quick filters styles
  quickFilters: {
    marginBottom: 20,
  },
  filterPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F0F2F5',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#F0F2F5',
  },
  filterPillActive: {
    backgroundColor: '#E1F5FE',
    borderColor: '#007AFF',
  },
  filterPillText: {
    fontSize: 14,
    color: '#666666',
  },
  filterPillTextActive: {
    color: '#007AFF',
    fontWeight: '500',
  },
  
  // Custom date range styles
  customDateRange: {
    marginTop: 8,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
    marginBottom: 12,
  },
  datePickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  datePickerContainer: {
    flex: 1,
  },
  datePickerLabel: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  datePickerIcon: {
    marginRight: 8,
  },
  datePickerText: {
    fontSize: 16,
    color: '#333333',
  },
  datePickerDivider: {
    width: 30,
    alignItems: 'center',
  },
  datePickerDividerText: {
    fontSize: 14,
    color: '#999999',
    fontWeight: '500',
  },
  
  // Report Type styles
  reportTypeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  reportTypeCard: {
    width: '48%',
    backgroundColor: '#F9F9F9',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  reportTypeCardActive: {
    backgroundColor: '#E1F5FE',
    borderColor: '#007AFF',
  },
  reportTypeIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F0F2F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  reportTypeIconContainerActive: {
    backgroundColor: '#007AFF',
  },
  reportTypeLabel: {
    fontSize: 14,
    textAlign: 'center',
    color: '#333333',
  },
  reportTypeLabelActive: {
    fontWeight: '500',
    color: '#007AFF',
  },
  
  // Format options styles
  formatOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  formatOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9F9F9',
    borderWidth: 1,
    borderColor: '#EEEEEE',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 8, // Reduced horizontal padding
    marginHorizontal: 4,
  },
  formatOptionActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  formatIcon: {
    marginRight: 6, // Reduced margin
  },
  formatText: {
    fontSize: 13, // Reduced font size
    color: '#333333',
    flexShrink: 1, // Allow text to shrink
    textAlign: 'center', // Center text
    flexWrap: 'wrap', // Allow text to wrap
  },
  formatTextActive: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  
  // Button styles
  generateButtonContainer: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  generateButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  downloadButton: {
    backgroundColor: '#34C759',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonIcon: {
    marginRight: 8,
  },
  
  // Report Info Card styles
  reportInfoCard: {
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 40,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  reportInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  reportInfoTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 10,
    color: '#666666',
  },
  reportInfoContent: {
    
  },
  reportInfoItem: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  reportInfoLabel: {
    width: 100,
    fontSize: 14,
    color: '#666666',
  },
  reportInfoValue: {
    flex: 1,
    fontSize: 14,
    color: '#333333',
  },
  // Add these styles if they're not already present

  // Success Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  successModal: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
  },
  successIconContainer: {
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 12,
  },
  successMessage: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 24,
  },
  closeModalButton: {
    marginTop: 16,
    padding: 10,
  },
  closeModalText: {
    fontSize: 16,
    color: '#666666',
    fontWeight: '500',
  }
});