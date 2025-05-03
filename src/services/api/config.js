const API_BASE_URL = 'https://streetlightfix-backend-1.onrender.com';

// Generic request handler with error handling
export const apiRequest = async (endpoint, method = 'GET', body = null, customHeaders = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...customHeaders
  };

  const config = {
    method,
    headers
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    console.log(`API Request: ${method} ${API_BASE_URL}${endpoint}`);
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (!response.ok) {
      const errorText = await response.text().catch(() => 'No error details');
      throw new Error(`API error: ${response.status} ${response.statusText}. Details: ${errorText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`API call failed: ${endpoint}`, error);
    throw error;
  }
};

export default {
  BASE_URL: API_BASE_URL,
  apiRequest
};