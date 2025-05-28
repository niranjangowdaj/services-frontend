import React, { useState } from 'react';
import { FaUser, FaLock, FaEnvelope } from 'react-icons/fa';
import { API_ENDPOINTS, apiRequest } from '../config/api';
import '../styles/SignIn.css';

interface SignInProps {
  onLogin: (user: any) => void;
  onSignUpClick: () => void;
}

const SignIn: React.FC<SignInProps> = ({ onLogin, onSignUpClick }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Step 1: Authenticate and get JWT token
      const loginResponse = await apiRequest(API_ENDPOINTS.auth.login, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password
        })
      });
      console.log(loginResponse);
      if (!loginResponse.ok) {
        const errorText = await loginResponse.text();
        throw new Error(errorText || 'Invalid username or password');
      }

      const authData = await loginResponse.json();
      
      // Step 2: Store JWT token
      localStorage.setItem('jwt_token', authData.token);
      
      // Step 3: Fetch user details using the username
      const userResponse = await apiRequest(`${API_ENDPOINTS.users}/username/${authData.username}`);
      
      if (!userResponse.ok) {
        throw new Error('Failed to fetch user details');
      }

      const userData = await userResponse.json();
      
      // Step 4: Transform user data to match frontend interface
      const user = {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        role: userData.role.toLowerCase(), // Convert 'USER'/'ADMIN' to 'user'/'admin'
        address: userData.address || {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: ''
        }
      };

      onLogin(user);
    } catch (error: any) {
      console.error('Error signing in:', error);
      setError(error.message || 'An error occurred while signing in');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="sign-in-container">
      <div className="sign-in-header">
        <h2>Welcome Back</h2>
        <p className="sign-in-subtitle">Sign in to access your account</p>
      </div>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit} className="sign-in-form">
        <div className="form-group">
          <label htmlFor="username">
            <FaUser className="input-icon" />
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            placeholder="Enter your username"
            required
            disabled={isLoading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">
            <FaLock className="input-icon" />
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Enter your password"
            required
            disabled={isLoading}
          />
        </div>
        <button type="submit" className="submit-button" disabled={isLoading}>
          <FaUser className="button-icon" />
          {isLoading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>
      <div className="sign-up-link">
        Don't have an account? 
        <button onClick={onSignUpClick} className="link-button" disabled={isLoading}>
          Create Account
        </button>
      </div>
    </div>
  );
};

export default SignIn; 