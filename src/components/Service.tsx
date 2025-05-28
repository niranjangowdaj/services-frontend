import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaStar, FaPhone, FaMapMarkerAlt, FaUser, FaEdit, FaTrash } from 'react-icons/fa';
import { Service as ServiceType } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { API_ENDPOINTS, apiRequest } from '../config/api';
import '../styles/Service.css';

const Service: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [service, setService] = useState<ServiceType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await apiRequest(API_ENDPOINTS.service(id!));
        if (!response.ok) {
          throw new Error('Service not found');
        }
        const data = await response.json();
        setService(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch service');
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [id]);

  const handleEdit = () => {
    navigate(`/services/${id}/edit`);
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this service?')) {
      return;
    }

    try {
      const response = await apiRequest(API_ENDPOINTS.service(id!), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user?.token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete service');
      }

      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete service');
    }
  };

  if (loading) {
    return <div className="service-page">Loading...</div>;
  }

  if (error || !service) {
    return <div className="service-page">Error: {error || 'Service not found'}</div>;
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="service-page">
      <div className="service-container">
        <div className="service-header">
          <img src={service.image} alt={service.name} />
          <div className="service-header-content">
            <h1>{service.name}</h1>
            <div className="service-meta">
              <div className="service-meta-item">
                <FaStar className="icon" />
                <span>{service.rating} ({service.reviews} reviews)</span>
              </div>
              <div className="service-meta-item">
                <FaPhone className="icon" />
                <span>{service.phone}</span>
              </div>
              <div className="service-meta-item">
                <FaMapMarkerAlt className="icon" />
                <span>{service.location}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="service-content">
          <div className="service-details">
            <h2>About this service</h2>
            <p className="service-description">{service.description}</p>

            <h2>Features</h2>
            <div className="service-features">
              {service.features.map((feature, index) => (
                <div key={index} className="feature-item">
                  <FaStar className="icon" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="service-sidebar">
            <div className="service-card">
              <h3>Price</h3>
              <div className="price">
                {formatPrice(service.price)}
                <span>/service</span>
              </div>
              <button onClick={() => window.location.href = `tel:${service.phone}`}>
                Contact Provider
              </button>
            </div>

            <div className="service-card">
              <h3>Location</h3>
              <div className="service-location">
                <FaMapMarkerAlt className="icon" />
                <span>{service.location}</span>
              </div>
              <div className="service-provider">
                <img src={service.provider.avatar} alt={service.provider.name} className="provider-avatar" />
                <div className="provider-info">
                  <h4>{service.provider.name}</h4>
                  <p>Service Provider</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {user?.id === service.provider.id && (
          <div className="admin-controls">
            <button className="edit-button" onClick={handleEdit}>
              <FaEdit /> Edit Service
            </button>
            <button className="delete-button" onClick={handleDelete}>
              <FaTrash /> Delete Service
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Service; 