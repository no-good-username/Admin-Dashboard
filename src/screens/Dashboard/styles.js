import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    width: '48%',
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginBottom: 16,
  },
  statLabel: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333',
  },
  quickAccess: {
    gap: 12,
  },
  quickAccessItem: {
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quickAccessText: {
    fontSize: 16,
    color: '#333',
  },
  // Updated styles for Notification Icon
  imageContainer: {
    position: 'absolute',
    top: 100,
    right: 16,
  },
  image: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
});

export default styles;
