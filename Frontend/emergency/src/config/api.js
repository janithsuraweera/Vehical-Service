// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  SIGNUP: `${API_BASE_URL}/api/auth/signup`,
  FORGOT_PASSWORD: `${API_BASE_URL}/api/auth/forgot-password`,
  RESET_PASSWORD: `${API_BASE_URL}/api/auth/reset-password`,
  
  // User endpoints
  CHANGE_PASSWORD: `${API_BASE_URL}/api/users/change-password`,
  USER_RESET: `${API_BASE_URL}/api/users/reset`,
  USER_COUNT: `${API_BASE_URL}/api/users/count`,
  
  // Emergency endpoints
  EMERGENCY: `${API_BASE_URL}/api/emergency`,
  EMERGENCY_BY_ID: (id) => `${API_BASE_URL}/api/emergency/${id}`,
  
  // Inventory endpoints
  INVENTORY: `${API_BASE_URL}/api/inventory`,
  INVENTORY_BY_ID: (id) => `${API_BASE_URL}/api/inventory/${id}`,
  
  // Vehicle Registration endpoints
  VEHICLE_REGISTRATION: `${API_BASE_URL}/api/vehicle-registration`,
  VEHICLE_REGISTRATION_BY_ID: (id) => `${API_BASE_URL}/api/vehicle-registration/${id}`,
  VEHICLE_REGISTRATION_COUNT: `${API_BASE_URL}/api/vehicle-registration/count`,
  
  // Vehicle Error endpoints
  VEHICLE_ERRORS: `${API_BASE_URL}/api/vehicle-errors`,
  VEHICLE_ERRORS_BY_ID: (id) => `${API_BASE_URL}/api/vehicle-errors/${id}`,
  VEHICLE_ERRORS_UPLOAD: `${API_BASE_URL}/api/vehicle-errors/upload`,
  VEHICLE_ERRORS_ANALYZE: `${API_BASE_URL}/api/vehicle-errors/analyze`,
  VEHICLE_ERRORS_REPORT: `${API_BASE_URL}/api/vehicle-errors/report`,
  VEHICLE_ERRORS_MY_ERRORS: `${API_BASE_URL}/api/vehicle-errors/my-errors`,
  VEHICLE_ERRORS_ALL: `${API_BASE_URL}/api/vehicle-errors/all`,
  VEHICLE_ERRORS_STATUS: (id) => `${API_BASE_URL}/api/vehicle-errors/${id}/status`,
  
  // Chatbot endpoints
  CHATBOT_CHAT: `${API_BASE_URL}/api/chatbot/chat`,
  
  // Notifications endpoints
  NOTIFICATIONS: `${API_BASE_URL}/api/notifications`,
  NOTIFICATIONS_BY_ID: (id) => `${API_BASE_URL}/api/notifications/${id}`,
  NOTIFICATIONS_READ: (id) => `${API_BASE_URL}/api/notifications/${id}/read`,
};

// Helper function to get upload URL
export const getUploadUrl = (path) => {
  if (path.startsWith('http')) return path;
  return `${API_BASE_URL}${path}`;
};

export default API_ENDPOINTS;

