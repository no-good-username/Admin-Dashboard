import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  reportCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  reportHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F2937",
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  locationText: {
    fontSize: 15,
    color: "#4B5563",
    marginLeft: 6,
  },
  description: {
    fontSize: 16,
    color: "#4B5563",
    lineHeight: 24,
    marginBottom: 16,
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 8,
  },
  imagePlaceholder: {
    width: "100%",
    height: 200,
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  imagePlaceholderText: {
    marginTop: 8,
    color: "#9CA3AF",
    fontSize: 14,
  },
  updateContainer: {
    flexDirection: "row",
    marginBottom: 20,
    alignItems: "center",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 24,
    padding: 14,
    fontSize: 16,
    backgroundColor: "#FFFFFF",
  },
  sendButton: {
    backgroundColor: "#000000",
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  sendButtonDisabled: {
    backgroundColor: "#9CA3AF",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 12,
    marginTop: 24,
  },
  emptyUpdateContainer: {
    alignItems: "center",
    padding: 24,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 16,
  },
  emptyListText: {
    textAlign: "center",
    color: "#6B7280",
    marginTop: 8,
    fontSize: 16,
  },
  updateItem: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  updateText: {
    fontSize: 16,
    color: "#1F2937",
    marginBottom: 8,
    lineHeight: 22,
  },
  updateTimestamp: {
    fontSize: 12,
    color: "#6B7280",
  },
  selectLinesmenButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    padding: 14,
    backgroundColor: "#FFFFFF",
    marginBottom: 12,
  },
  selectLinesmenButtonText: {
    fontSize: 16,
    color: "#000000",
    fontWeight: "500",
  },
  selectedLinesmenContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  selectedLinesman: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    padding: 8,
    paddingRight: 12,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  userIcon: {
    marginRight: 6,
  },
  selectedLinesmanText: {
    fontSize: 14,
    color: "#1F2937",
    marginRight: 8,
  },
  noLinesmenContainer: {
    padding: 24,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 16,
  },
  noLinesmenText: {
    color: "#6B7280",
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: width * 0.85,
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F2937",
  },
  linesmanItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  linesmanInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  linesmanIcon: {
    marginRight: 12,
  },
  linesmanItemText: {
    fontSize: 16,
    color: "#1F2937",
  },
  selectedLinesmanItem: {
    backgroundColor: "#F3F4F6",
  },
  uncheckedCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#D1D5DB",
  },
  doneButton: {
    backgroundColor: "#000000",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  doneButtonText: {
    fontSize: 16,
    color: "white",
    fontWeight: "600",
  },
  tasksHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  tasksHeaderText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  addTaskButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  addTaskButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
    marginRight: 6,
  },
  tasksContainer: {
    marginBottom: 20,
  },
  taskItem: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  taskDescription: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginRight: 12,
  },
  taskStatusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    minWidth: 70,
    alignItems: 'center',
  },
  taskStatusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  taskAssignees: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  taskAssigneesLabel: {
    fontSize: 14,
    color: '#666',
    marginRight: 6,
  },
  assigneesList: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  assigneeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 4,
  },
  assigneeName: {
    fontSize: 12,
    color: '#333',
    marginLeft: 4,
  },
  taskFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  taskTimestamp: {
    fontSize: 12,
    color: '#666',
  },
  taskActions: {
    flexDirection: 'row',
  },
  taskActionButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginLeft: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  inProgressButton: {
    backgroundColor: '#007AFF22',
  },
  completeButton: {
    backgroundColor: '#34C75922',
  },
  taskActionButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
  },
  taskCompletedText: {
    fontSize: 12,
    color: '#34C759',
  },
  noTasksContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
  },
  noTasksText: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
  
  // Task modal
  taskInputContainer: {
    marginBottom: 16,
  },
  taskInput: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  modalSubtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 12,
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  assignTaskButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 16,
    width: '100%',
  },
  assignTaskButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
    marginRight: 8,
  },
  assignTaskIcon: {
    marginLeft: 4,
  },
  cancelButton: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flex: 1,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#374151',
    fontWeight: '600',
    fontSize: 16,
  },
  disabledButton: {
    backgroundColor: '#E0E0E0',
    opacity: 0.7,
    elevation: 0,
  },
  
  // Status modal
  statusModalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    width: '90%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  statusModalDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  statusOptionsList: {
    marginBottom: 20,
  },
  statusOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1.5,
  },
  statusOptionText: {
    fontSize: 16,
    fontWeight: '500',
  },
  statusCheckIcon: {
    marginLeft: 8,
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEFEF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  warningIcon: {
    marginRight: 8,
  },
  warningText: {
    fontSize: 14,
    color: '#FF3B30',
    flex: 1,
  },
  statusModalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  updateStatusButton: {
    backgroundColor: '#000',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flex: 1,
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  updateStatusButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  disabledStatusOption: {
    opacity: 0.5,
    backgroundColor: '#f0f0f0',
  },
  disabledStatusOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  disabledStatusIcon: {
    marginRight: 4,
  },
  disabledStatusText: {
    fontSize: 11,
    color: '#FF3B30',
    textAlign: 'center',
  },
  
  // Resolution modal
  resolutionModalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  resolutionDescription: {
    fontSize: 16,
    marginBottom: 15,
    color: '#333',
  },
  resolutionInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 15,
  },
  imageUploadPlaceholder: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
  },
  imageUploadText: {
    marginTop: 8,
    color: '#666',
    fontSize: 14,
  },
  resolveButton: {
    backgroundColor: '#34C759',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 120,
  },
  resolveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  warningButton: {
    backgroundColor: '#FF9500',
    opacity: 0.8,
  },
  
  // NEW ENHANCED STYLES FOR REPORTINFO COMPONENT
  // Enhanced report info container
  reportInfoContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 8,
    marginVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },

  // Enhanced status badge
  enhancedStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 30,
    marginBottom: 16,
  },
  enhancedStatusText: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statusIcon: {
    marginRight: 6,
  },

  // Enhanced title
  enhancedReportTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    lineHeight: 32,
  },

  // Reporter card
  reporterCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  reporterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  reporterCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
  reporterInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  reporterDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    minWidth: '48%',
  },
  reporterDetailText: {
    marginLeft: 10,
    fontSize: 15,
    color: '#444',
  },

  // Enhanced image container
  enhancedImageContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    backgroundColor: '#f0f0f0',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  enhancedReportImage: {
    width: '100%',
    height: 220,
    borderRadius: 12,
  },

  // Description area
  descriptionContainer: {
    marginBottom: 20,
  },
  descriptionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#888',
    marginBottom: 8,
    letterSpacing: 0.8,
  },
  enhancedReportDescription: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },

  // Location card
  locationCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  detailText: {
    marginLeft: 12,
    fontSize: 15,
    color: '#444',
  },

  // Enhanced divider
  enhancedDivider: {
    height: 1,
    backgroundColor: '#e5e5e5',
    marginVertical: 20,
  },

  // Update section
  updateSectionContainer: {
    marginTop: 10,
  },
  updateSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  enhancedUpdateInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    color: '#333',
    minHeight: 120,
    textAlignVertical: 'top',
    backgroundColor: '#f9f9f9',
    marginBottom: 16,
  },

  // Enhanced button
  enhancedButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    flexDirection: 'row',
  },
  enhancedButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
    marginRight: 8,
  },
  buttonIcon: {
    marginLeft: 6,
  },
  viewOnMapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4285F4', // Google Maps blue color
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginVertical: 12,
    alignSelf: 'flex-start',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  viewOnMapButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
  mapButtonIcon: {
    marginRight: 8,
  },

  // Resolution form styles
  scrollContent: {
    flexGrow: 1,
  },
  imagePreviewContainer: {
    position: 'relative',
    width: '100%',
    height: 200,
    marginBottom: 15,
    borderRadius: 8,
    overflow: 'hidden',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 15,
    padding: 5,
  },
  imageUploadOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  imageOptionButton: {
    backgroundColor: '#f0f7ff',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    width: '45%',
  },
  imageOptionText: {
    marginTop: 8,
    color: '#007AFF',
    fontWeight: '500',
  },
  changeImageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    marginBottom: 15,
  },
  changeImageText: {
    color: '#007AFF',
    marginLeft: 5,
    fontWeight: '500',
  },
  disabledButton: {
    opacity: 0.5,
  },
});

export default styles;