import reportsApi from './reportsApi';
import linesmenApi from './linesmenApi';
import dashboardApi from './dashboardApi';
import authApi from './authApi';
import updateTaskWithResolution from './updateTaskWithResolution';
import { apiRequest, BASE_URL } from './config';

// Export individual APIs
export {
  reportsApi,
  linesmenApi,
  dashboardApi,
  authApi,
  updateTaskWithResolution,
  apiRequest,
  BASE_URL
};

// Default export of all APIs
export default {
  reports: reportsApi,
  linesmen: linesmenApi,
  dashboard: dashboardApi,
  auth: authApi,
  updateProof: updateTaskWithResolution,
};