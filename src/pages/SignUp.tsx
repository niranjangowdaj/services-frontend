import React, { useState } from 'react';
import { FaUser, FaLock, FaEnvelope, FaUserPlus } from 'react-icons/fa';
import { API_ENDPOINTS } from '../config/api';
import '../styles/SignUp.css';

interface SignUpProps {
  onSignUp: (user: any) => void;
  onSignInClick: () => void;
  isAdminSignUp?: boolean;
}

const SignUp: React.FC<SignUpProps> = ({ onSignUp, onSignInClick, isAdminSignUp = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

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

    try {
      const response = await fetch(API_ENDPOINTS.users);
      const users = await response.json();
      
      const existingUser = users.find((u: any) => u.email === formData.email);
      if (existingUser) {
        setError('Email already exists');
        return;
      }

      const newUser = {
        id: users.length + 1,
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: 'user'
      };

      const createResponse = await fetch(API_ENDPOINTS.users, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });

      if (createResponse.ok) {
        onSignUp(newUser);
      } else {
        setError('Failed to create account');
      }
    } catch (error) {
      console.error('Error signing up:', error);
      setError('An error occurred while signing up');
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
          <label htmlFor="name">
            <FaUser className="input-icon" />
            Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter your full name"
            required
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
            placeholder="Create a password"
            required
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
          />
        </div>
        <button type="submit" className="submit-button">
          <FaUserPlus className="button-icon" />
          Create Account
        </button>
      </form>
      <div className="sign-in-link">
        Already have an account?
        <button onClick={onSignInClick} className="link-button">
          Sign In
        </button>
      </div>
    </div>
  );
};

export default SignUp; 