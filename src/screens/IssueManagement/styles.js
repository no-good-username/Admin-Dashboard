// screens/IssueManagement/styles.js
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#000',
  },
  issueItem: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
  },
  issueDescription: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  issueLocation: {
    fontSize: 14,
    color: '#6c757d',
    marginTop: 4,
  },
  issueStatus: {
    fontSize: 14,
    color: '#28a745',
    marginTop: 4,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#000',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    color: '#000',
  },
  button: {
    backgroundColor: '#007bff',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginBottom: 10,
    minWidth: 200,
  },
  closeButton: {
    backgroundColor: '#6c757d',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default styles;