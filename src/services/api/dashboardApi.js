import { apiRequest } from './config';

const dashboardApi = {
  // Get dashboard statistics and recent activity
  getDashboardData: () => apiRequest('/admin/home/2'),
};

export default dashboardApi;