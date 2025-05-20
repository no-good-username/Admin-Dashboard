import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  contentContainer: {
    paddingBottom: 30,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
  },
  loadingText: {
    fontSize: 16,
    color: "#555555",
    marginTop: 12,
  },

  // Header styles
  headerContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#666666",
  },
  
  // Global filter styles
  globalFilterContainer: {
    backgroundColor: "#F0F8FF",
    padding: 16,
    margin: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#D4E6FF",
  },
  globalFilterLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 10,
  },
  globalDatePickers: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  globalDateButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D4E6FF",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginRight: 5,
    marginBottom: 5,
  },
  globalDateText: {
    fontSize: 14,
    color: "#333",
  },
  dateRangeDivider: {
    marginHorizontal: 6,
    fontSize: 14,
    color: "#666",
  },
  datePickerIcon: {
    marginRight: 6,
  },
  applyButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginLeft: 10,
  },
  applyButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
  },

  // Section styles
  metricsHeader: {
    paddingHorizontal: 20,
    marginBottom: 16,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 2,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 4,
  },

  // Summary cards
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  summaryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    width: "48%",
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 14,
    color: "#666666",
  },
  cardValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333333",
    marginVertical: 2,
  },
  cardSubtitle: {
    fontSize: 12,
    color: "#999999",
  },

  // Charts
  chartSection: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitleContainer: {
    marginBottom: 12,
  },
  sectionDatePicker: {
    flexDirection: "row",
    alignItems: "center",
  },
  datePickerButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  datePickerText: {
    fontSize: 13,
    color: "#333",
  },
  chartContainer: {
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 10,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  chartInsights: {
    backgroundColor: "#F9F9F9",
    borderRadius: 8,
    padding: 12,
  },
  insightItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  insightIcon: {
    marginRight: 8,
  },
  insightText: {
    fontSize: 13,
    color: "#555555",
    flex: 1,
  },

  // Technician table
  techTable: {
    marginBottom: 16,
  },
  techTableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
    paddingBottom: 8,
    marginBottom: 8,
  },
  techTableCell: {
    flex: 1,
    paddingVertical: 6,
    fontSize: 14,
  },
  techTableHeaderCell: {
    fontWeight: "500",
    color: "#666666",
  },
  techNameCell: {
    flex: 1.5,
    flexDirection: "row",
    alignItems: "center",
  },
  techTableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
  },
  techIcon: {
    marginRight: 10,
  },
  techName: {
    fontSize: 14,
    color: "#333333",
  },
  techCompletedValue: {
    fontWeight: "500",
    color: "#007AFF",
  },
  // Add these new styles to your existing styles object

globalFilterContainer: {
  backgroundColor: "#F0F8FF",
  padding: 16,
  margin: 16,
  borderRadius: 10,
  borderWidth: 1,
  borderColor: "#D4E6FF",
},
globalFilterLabel: {
  fontSize: 16,
  fontWeight: "500",
  color: "#333",
  marginBottom: 10,
},
globalDatePickers: {
  flexDirection: "row",
  alignItems: "center",
  flexWrap: "wrap",
  marginBottom: 10,
},
quickDateOptions: {
  flexDirection: "row",
  marginTop: 8,
  justifyContent: "space-between",
},
quickDateButton: {
  backgroundColor: "#E6F0FF",
  paddingVertical: 6,
  paddingHorizontal: 12,
  borderRadius: 6,
  borderWidth: 1,
  borderColor: "#D4E6FF",
},
quickDateText: {
  fontSize: 13,
  color: "#007AFF",
}
});