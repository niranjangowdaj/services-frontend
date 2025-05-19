const API_BASE_URL = 'http://localhost:3001';

export const API_ENDPOINTS = {
  services: `${API_BASE_URL}/services`,
  service: (id: string) => `${API_BASE_URL}/services/${id}`,
  users: `${API_BASE_URL}/users`,
  user: (id: string) => `${API_BASE_URL}/users/${id}`,
  auth: {
    login: `${API_BASE_URL}/auth/login`,
    register: `${API_BASE_URL}/auth/register`,
  }
}; 