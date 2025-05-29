import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaStar, FaPhone, FaTrash, FaEdit, FaMapMarkerAlt, FaCheck } from 'react-icons/fa';
import { API_ENDPOINTS, apiRequest } from '../config/api';
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
  name: string;
  description: string;
  image: string;
  type: string;
  location: string;
  price: number;
  phone: string;
  rating: number;
  reviews: number;
  features: string[];
  provider: {
    id: string;
    name: string;
    avatar: string;
  };
}

const Service: React.FC<ServiceProps> = ({ user }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [service, setService] = useState<ServiceDetails | null>(null);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    fetchService();
  }, [id]);

  const fetchService = async () => {
    try {
      const response = await apiRequest(`${API_ENDPOINTS.services}/${id}`);
      const data = await response.json();
      setService(data);
    } catch (error) {
      console.error('Error fetching service:', error);
    }
  };

  const handleBookService = async () => {
    if (!user) {
      // Redirect to sign in if user is not logged in
      navigate('/');
      return;
    }

    setIsBooking(true);
    try {
      const orderData = {
        serviceId: parseInt(id!),
        scheduledDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // Schedule for tomorrow
      };

      const response = await apiRequest(API_ENDPOINTS.orders, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        setBookingSuccess(true);
        // Redirect to profile after 2 seconds
        setTimeout(() => {
          navigate('/profile');
        }, 2000);
      } else {
        console.error('Failed to book service');
      }
    } catch (error) {
      console.error('Error booking service:', error);
    } finally {
      setIsBooking(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await apiRequest(`${API_ENDPOINTS.services}/${id}`, {
          method: 'DELETE',
        });
        navigate('/');
      } catch (error) {
        console.error('Error deleting service:', error);
      }
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  if (!service) {
    return <div className="service-not-found">Service not found</div>;
  }

  if (bookingSuccess) {
    return (
      <div className="service-page">
        <div className="booking-success">
          <FaCheck className="success-icon" />
          <h2>Service Booked Successfully!</h2>
          <p>Your booking has been confirmed. Redirecting to your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="service-page">
      <div className="service-container">
        {/* Service Image */}
        <div className="service-image-container">
          <img src={service.image} alt={service.name} className="service-image" />
        </div>

        {/* Service Header Info */}
        <div className="service-header-info">
          <h1 className="service-title">{service.name}</h1>
          
          <div className="service-key-details">
            <div className="detail-item">
              <div className="detail-icon">
                <FaStar />
              </div>
              <div className="detail-content">
                <span className="detail-value">{service.rating}</span>
                <span className="detail-label">({service.reviews} reviews)</span>
              </div>
            </div>

            <div className="detail-item">
              <div className="detail-icon">
                ₹
              </div>
              <div className="detail-content">
                <span className="detail-value">{formatPrice(service.price)}</span>
                <span className="detail-label">per service</span>
              </div>
            </div>

            <div className="detail-item">
              <div className="detail-icon">
                <FaPhone />
              </div>
              <div className="detail-content">
                <span className="detail-value">{service.phone}</span>
                <span className="detail-label">Contact</span>
              </div>
            </div>

            <div className="detail-item">
              <div className="detail-icon">
                <FaMapMarkerAlt />
              </div>
              <div className="detail-content">
                <span className="detail-value">{service.location}</span>
                <span className="detail-label">Location</span>
              </div>
            </div>
          </div>

          {/* Book Button */}
          {user && user.role !== 'admin' && (
            <button 
              className="book-button" 
              onClick={handleBookService}
              disabled={isBooking}
            >
              {isBooking ? 'Booking...' : 'Book Service'}
            </button>
          )}

          {/* Admin Controls */}
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

        {/* About This Service Section */}
        <div className="service-about-section">
          <h2>About This Service</h2>
          <p className="service-description">{service.description}</p>
          
          <div className="service-features">
            <h3>What's Included</h3>
            <ul className="features-list">
              {service.features.map((feature, index) => (
                <li key={index} className="feature-item">
                  <FaCheck className="feature-check" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* Provider Info */}
          <div className="provider-section">
            <h3>Service Provider</h3>
            <div className="provider-info">
              <img 
                src={service.provider.avatar} 
                alt={service.provider.name}
                className="provider-avatar"
              />
              <div className="provider-details">
                <h4>{service.provider.name}</h4>
                <p>Professional service provider</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Service; 