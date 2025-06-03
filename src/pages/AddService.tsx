import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ServiceType, Location } from '../types/enums';
import { API_ENDPOINTS, apiRequest } from '../config/api';
import '../styles/AddService.css';

interface AddServiceProps {
  user: any;
}

const AddService: React.FC<AddServiceProps> = ({ user }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    type: ServiceType.CLEANING,
    location: Location.MUMBAI,
    phone: '',
    features: '',
    image: '',
    providerName: '',
    contact: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
      const response = await apiRequest(API_ENDPOINTS.services, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({
          serviceName: formData.name,
          description: formData.description,
          category: formData.type,
          cost: parseFloat(formData.price),
          location: formData.location,
          contact: formData.contact,
          image: formData.image,
          phone: formData.phone,
          providerName: formData.providerName,
          providerAvatar: '', 
          features: formData.features.split(',').map(feature => feature.trim()).filter(feature => feature.length > 0)
        })
      });

      if (!response.ok) {
        throw new Error('Failed to add service');
      }

      navigate('/');
    } catch (err) {
      setError('Failed to add service. Please try again.');
    }
  };

  return (
    <div className="add-service">
      <div className="add-service-header">
        <h1>Add New Service</h1>
        <p>Fill in the details below to create a new service offering</p>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="add-service-form" id="add-service-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="name">Service Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Professional Home Cleaning"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="providerName">Provider Name *</label>
            <input
              type="text"
              id="providerName"
              name="providerName"
              value={formData.providerName}
              onChange={handleChange}
              placeholder="e.g. CleanPro Services"
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your service in detail..."
              rows={4}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="features">Features *</label>
            <input
              type="text"
              id="features"
              name="features"
              value={formData.features}
              onChange={handleChange}
              placeholder="Deep Cleaning, Sanitization, Window Cleaning"
              required
            />
            <small className="help-text">Separate multiple features with commas</small>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="price">Price (₹) *</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="2500"
              min="0"
              step="0.01"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="type">Service Category *</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
            >
              {Object.values(ServiceType).map(type => (
                <option key={type} value={type}>
                  {type.replace('_', ' ').toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="location">Location *</label>
            <select
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
            >
              {Object.values(Location).map(location => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number *</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+91 98765 43210"
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="image">Image URL *</label>
            <input
              type="url"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="contact">Contact Email *</label>
            <input
              type="email"
              id="contact"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              placeholder="contact@example.com"
              required
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" form="add-service-form" className="submit-button">
            Add Service 
          </button>
        </div>
      </form>
      
        
      
    </div>
  );
};

export default AddService; 