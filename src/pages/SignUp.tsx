import React, { useState } from 'react';
import { FaUser, FaLock, FaEnvelope, FaUserPlus } from 'react-icons/fa';
import { API_ENDPOINTS, apiRequest } from '../config/api';
import '../styles/SignUp.css';

interface SignUpProps {
  onSignUp: (user: any) => void;
  onSignInClick: () => void;
  isAdminSignUp?: boolean;
}

const SignUp: React.FC<SignUpProps> = ({ onSignUp, onSignInClick, isAdminSignUp = false }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
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

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);

    try {
      // Register user with backend
      const registrationData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: isAdminSignUp ? 'ADMIN' : 'USER'
      };

      const response = await apiRequest(API_ENDPOINTS.auth.register, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Registration failed');
      }

      const userData = await response.json();

      // Transform user data to match frontend interface
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

      onSignUp(user);
    } catch (error: any) {
      console.error('Error signing up:', error);
      setError(error.message || 'An error occurred while signing up');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="sign-up-container">
      <div className="sign-up-header">
        <h2>{isAdminSignUp ? 'Create Admin Account' : 'Create Account'}</h2>
        <p className="sign-up-subtitle">
          {isAdminSignUp ? 'Join as an administrator' : 'Join us to get started'}
        </p>
      </div>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit} className="sign-up-form">
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
            placeholder="Choose a username"
            required
            disabled={isLoading}
            minLength={3}
            maxLength={50}
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">
            <FaEnvelope className="input-icon" />
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter your email"
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
            placeholder="Create a password (min 6 characters)"
            required
            disabled={isLoading}
            minLength={6}
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">
            <FaLock className="input-icon" />
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            placeholder="Confirm your password"
            required
            disabled={isLoading}
          />
        </div>
        <button type="submit" className="submit-button" disabled={isLoading}>
          <FaUserPlus className="button-icon" />
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>
      <div className="sign-in-link">
        Already have an account?
        <button onClick={onSignInClick} className="link-button" disabled={isLoading}>
          Sign In
        </button>
      </div>
    </div>
  );
};

export default SignUp; 