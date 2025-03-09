import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F7',
  },
  header: {
    backgroundColor: '#000000',
    paddingTop: 30,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: '#CCCCCC',
    fontSize: 14,
    marginTop: 4,
  },
  filterContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  filterScrollContent: {
    paddingHorizontal: 15,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterButtonActive: {
    backgroundColor: '#000000',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#333333',
  },
  filterButtonTextActive: {
    color: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333333',
  },
  listContent: {
    padding: 15,
  },
  issueItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2.22,
    elevation: 2,
  },
  issueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  issueTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  priorityIcon: {
    marginRight: 8,
  },
  issueTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  statusOpen: {
    backgroundColor: '#FFE8E8',
  },
  statusInProgress: {
    backgroundColor: '#FFF4E5',
  },
  statusResolved: {
    backgroundColor: '#E3F9E5',
  },
  statusClosed: {
    backgroundColor: '#E6E6E6',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  issueDetails: {
    marginBottom: 10,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailIcon: {
    marginRight: 6,
    width: 14,
  },
  issueLocation: {
    fontSize: 14,
    color: '#666666',
    flex: 1,
  },
  issueDate: {
    fontSize: 14,
    color: '#666666',
  },
  issueDescription: {
    fontSize: 14,
    color: '#333333',
    lineHeight: 20,
    marginBottom: 12,
  },
  issueFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  assignedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  assignedText: {
    marginLeft: 5,
    fontSize: 12,
    color: '#666666',
  },
  unassignedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  unassignedText: {
    marginLeft: 5,
    fontSize: 12,
    color: '#FF9500',
  },
  viewDetailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewDetailsText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#000000',
    marginRight: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#333333',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666666',
    marginTop: 10,
    textAlign: 'center',
  },
  refreshButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#000000',
    borderRadius: 8,
  },
  refreshButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  emptyFilterContainer: {
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyFilterText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginTop: 15,
  },
  clearFilterButton: {
    marginTop: 15,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#000000',
    borderRadius: 8,
  },
  clearFilterButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  fabButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
});

export default styles;