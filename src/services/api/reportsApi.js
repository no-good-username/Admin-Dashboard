import { apiRequest } from './config';

const reportsApi = {
  // Get all issues/reports
  getIssues: () => apiRequest('/admin/Issue/1'),
  
  // Get a specific report by ID
  getReportById: (reportId) => apiRequest(`/admin/task/${reportId}`),
  
  // Update task status
  updateTaskStatus: (taskId, status, resolutionProof = null) => {
    const payload = { taskid: taskId, status };
    if (resolutionProof) payload.resolutionProof = resolutionProof;
    return apiRequest('/admin/task/update', 'PATCH', payload);
  },
  
  // Send status update for a task
  sendStatusUpdate: (taskId, status) => 
    apiRequest('/admin/updateStatus', 'PATCH', { taskid: taskId, status }),
  
  // Assign linesmen to a task
  assignLinesmen: (taskId, linemanIds) => 
    apiRequest('/admin/assignTask', 'PATCH', { taskid: taskId, linemanid: linemanIds }),
};

export default reportsApi;