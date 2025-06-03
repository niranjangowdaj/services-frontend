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

let globalSignInHandler: (() => void) | null = null;
let globalNavigateToHome: (() => void) | null = null;

export const setGlobalSignInHandler = (handler: () => void) => {
  globalSignInHandler = handler;
};

export const setGlobalNavigateToHome = (navigate: () => void) => {
  globalNavigateToHome = navigate;
};

export const apiRequest = async (url: string, options?: RequestInit): Promise<Response> => {
  const token = localStorage.getItem('jwt_token');
  
  const headers = new Headers(options?.headers);
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  
  if (!headers.has('Content-Type') && options?.body) {
    headers.set('Content-Type', 'application/json');
  }

  const requestOptions = {
    ...options,
    headers
  };

  const response = await fetch(url, requestOptions);
  
  if (response.status === 403) {
    if (globalNavigateToHome) {
      globalNavigateToHome();
    }
    
    setTimeout(() => {
      if (globalSignInHandler) {
        globalSignInHandler();
      }
    }, 100);
  }
  
  if (response.status === 401) {
    localStorage.removeItem('jwt_token');
    
    if (globalNavigateToHome) {
      globalNavigateToHome();
    }
    
    setTimeout(() => {
      if (globalSignInHandler) {
        globalSignInHandler();
      }
    }, 100);
  }
  
  return response;
};

export default API_BASE_URL; 