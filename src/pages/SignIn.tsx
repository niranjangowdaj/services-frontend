import React, { useState } from 'react';
import { FaUser, FaLock, FaEnvelope } from 'react-icons/fa';
import { API_ENDPOINTS } from '../config/api';
import '../styles/SignIn.css';

interface SignInProps {
  onLogin: (user: any) => void;
  onSignUpClick: () => void;
}

const SignIn: React.FC<SignInProps> = ({ onLogin, onSignUpClick }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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

    try {
      const response = await fetch(API_ENDPOINTS.users);
      const users = await response.json();
      
      const user = users.find((u: any) => 
        u.email === formData.email && u.password === formData.password
      );

      if (user) {
        onLogin(user);
      } else {
        setError('Invalid email or password');
      }
    } catch (error) {
      console.error('Error signing in:', error);
      setError('An error occurred while signing in');
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
            placeholder="Enter your password"
            required
          />
        </div>
        <button type="submit" className="submit-button">
          <FaUser className="button-icon" />
          Sign In
        </button>
      </form>
      <div className="sign-up-link">
        Don't have an account? 
        <button onClick={onSignUpClick} className="link-button">
          Create Account
        </button>
      </div>
    </div>
  );
};

export default SignIn; 