const API_BASE_URL = 'http://localhost:8080/api';

export const API_ENDPOINTS = {
  services: `${API_BASE_URL}/services`,
  service: (id: string) => `${API_BASE_URL}/services/${id}`,
  users: `${API_BASE_URL}/users`,
  user: (id: string) => `${API_BASE_URL}/users/${id}`,
  orders: `${API_BASE_URL}/orders`,
  order: (id: string) => `${API_BASE_URL}/orders/${id}`,
  auth: {
    login: `${API_BASE_URL}/auth/login`,
    register: `${API_BASE_URL}/users/register`,
  }
};

// Global 403 error handler
let globalSignInHandler: (() => void) | null = null;
let globalNavigateToHome: (() => void) | null = null;

export const setGlobalSignInHandler = (handler: () => void) => {
  globalSignInHandler = handler;
};

export const setGlobalNavigateToHome = (navigate: () => void) => {
  globalNavigateToHome = navigate;
};

export const apiRequest = async (url: string, options?: RequestInit): Promise<Response> => {
  // Get JWT token from localStorage
  const token = localStorage.getItem('jwt_token');
  
  // Prepare headers
  const headers = new Headers(options?.headers);
  
  // Add JWT token to Authorization header if available
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  
  // Add Content-Type if not already set and this is a POST/PUT request
  if (!headers.has('Content-Type') && options?.body) {
    headers.set('Content-Type', 'application/json');
  }

  const requestOptions = {
    ...options,
    headers
  };

  const response = await fetch(url, requestOptions);
  
  if (response.status === 403) {
    // Navigate to home page using React Router
    if (globalNavigateToHome) {
      globalNavigateToHome();
    }
    
    // Show sign-in modal after a short delay to ensure navigation completes
    setTimeout(() => {
      if (globalSignInHandler) {
        globalSignInHandler();
      }
    }, 100);
  }
  
  // Handle 401 Unauthorized (expired/invalid token)
  if (response.status === 401) {
    // Clear invalid token
    localStorage.removeItem('jwt_token');
    
    // Navigate to home page
    if (globalNavigateToHome) {
      globalNavigateToHome();
    }
    
    // Show sign-in modal
    setTimeout(() => {
      if (globalSignInHandler) {
        globalSignInHandler();
      }
    }, 100);
  }
  
  return response;
};

export default API_BASE_URL; 