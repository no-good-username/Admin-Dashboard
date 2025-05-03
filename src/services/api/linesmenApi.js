import { apiRequest } from './config';

const linesmenApi = {
  // Get linesmen by area ID
  getLinesmen: (areaId) => apiRequest(`/admin/linemen/${areaId}`),
};

export default linesmenApi;