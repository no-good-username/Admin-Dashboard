import { apiRequest } from './config';

const authApi = {
  // Fetch areas data for signup
  fetchAreas: () => apiRequest('/admin/fetchArea'),
  
  // Sign up a new user
  signUp: (userData) => apiRequest('/admin/signup', 'POST', userData),
  
  // Login
  login: (credentials) => apiRequest('/admin/login', 'POST', credentials),
};

export default authApi;