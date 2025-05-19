import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaStar, FaPhone, FaTrash, FaEdit } from 'react-icons/fa';
import { API_ENDPOINTS } from '../config/api';
import '../styles/Service.css';

interface User {
  id: number;
  email: string;
  role: 'user' | 'admin';
}

interface ServiceProps {
  user: User | null;
}

interface ServiceDetails {
  id: number;
  title: string;
  description: string;
  image: string;
  longDescription: string;
  type: string;
  location: string;
  cost: number;
  phoneNumber: string;
  rating: number;
  features: string[];
}

const Service: React.FC<ServiceProps> = ({ user }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [service, setService] = useState<ServiceDetails | null>(null);

  useEffect(() => {
    fetchService();
  }, [id]);

  const fetchService = async () => {
    try {
      const response = await fetch(`${API_ENDPOINTS.services}/${id}`);
      const data = await response.json();
      setService(data);
    } catch (error) {
      console.error('Error fetching service:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await fetch(`${API_ENDPOINTS.services}/${id}`, {
          method: 'DELETE',
        });
        navigate('/');
      } catch (error) {
        console.error('Error deleting service:', error);
      }
    }
  };

  if (!service) {
    return <div className="service-not-found">Service not found</div>;
  }

  return (
    <div className="service-page">
      <div className="service-header">
        <img src={service.image} alt={service.title} className="service-image" />
        <div className="service-info">
          <h1>{service.title}</h1>
          <p className="service-description">{service.description}</p>
          <div className="service-meta">
            <div className="service-rating">
              <FaStar className="icon" /> {service.rating}
            </div>
            <div className="service-cost">${service.cost}/hr</div>
            <div className="service-phone">
              <FaPhone className="icon" /> {service.phoneNumber}
            </div>
          </div>
          {user?.role === 'admin' && (
            <div className="admin-controls">
              <button className="edit-button">
                <FaEdit className="icon" /> Edit
              </button>
              <button className="delete-button" onClick={handleDelete}>
                <FaTrash className="icon" /> Delete
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className="service-content">
        <section className="service-details">
          <h2>About this Service</h2>
          <p>{service.longDescription}</p>
        </section>

        <section className="service-features">
          <h2>Features</h2>
          <ul>
            {service.features.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
        </section>

        <section className="service-location-info">
          <h2>Location</h2>
          <p>{service.location}</p>
        </section>

        <button className="service-cta">Get Started</button>
      </div>
    </div>
  );
};

export default Service; 