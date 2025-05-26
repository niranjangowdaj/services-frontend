import React, { useState, useEffect } from 'react';
import { FaUser, FaMapMarkerAlt, FaPhone, FaCalendarAlt, FaStar, FaClock, FaCheckCircle, FaHourglassHalf } from 'react-icons/fa';
import { API_ENDPOINTS } from '../config/api';
import '../styles/Profile.css';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'admin';
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

interface Order {
  id: string;
  userId: number;
  serviceId: string;
  rating: number | null;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  orderDate: string;
  scheduledDate: string;
}

interface Service {
  id: string;
  name: string;
  price: number;
  location: string;
  type: string;
  phone: string;
  provider: {
    id: string;
    name: string;
    avatar: string;
  };
}

interface OrderWithService extends Order {
  service: Service;
}

interface ProfileProps {
  user: User | null;
}

const Profile: React.FC<ProfileProps> = ({ user }) => {
  const [orders, setOrders] = useState<OrderWithService[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [completeUser, setCompleteUser] = useState<User | null>(user);

  useEffect(() => {
    const fetchCompleteUserData = async () => {
      if (!user) return;
      
      // Check if user data is incomplete (missing address)
      if (!user.address) {
        try {
          const response = await fetch(`http://localhost:3001/users/${user.id}`);
          if (response.ok) {
            const userData = await response.json();
            setCompleteUser(userData);
            // Update localStorage with complete user data
            localStorage.setItem('user', JSON.stringify(userData));
          }
        } catch (err) {
          console.error('Error fetching complete user data:', err);
        }
      }
    };

    const fetchUserOrdersWithServices = async () => {
      if (!user) return;
      
      try {
        // Fetch orders
        const ordersResponse = await fetch('http://localhost:3001/orders');
        if (!ordersResponse.ok) {
          throw new Error('Failed to fetch orders');
        }
        const allOrders = await ordersResponse.json();
        const userOrders = allOrders.filter((order: Order) => order.userId === user.id);

        // Fetch services
        const servicesResponse = await fetch('http://localhost:3001/services');
        if (!servicesResponse.ok) {
          throw new Error('Failed to fetch services');
        }
        const services = await servicesResponse.json();

        // Combine orders with service data
        const ordersWithServices: OrderWithService[] = userOrders.map((order: Order) => {
          const service = services.find((s: Service) => s.id === order.serviceId);
          return {
            ...order,
            service
          };
        }).filter((order: OrderWithService) => order.service); // Remove orders with missing services

        setOrders(ordersWithServices);
      } catch (err) {
        setError('Failed to load order history');
        console.error('Error fetching orders:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompleteUserData();
    fetchUserOrdersWithServices();
  }, [user]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <FaCheckCircle className="status-icon completed" />;
      case 'in-progress':
        return <FaClock className="status-icon in-progress" />;
      case 'pending':
        return <FaHourglassHalf className="status-icon pending" />;
      default:
        return <FaClock className="status-icon" />;
    }
  };

  const getStatusClass = (status: string) => {
    return `status-badge ${status}`;
  };

  const currentUser = completeUser || user;

  if (!currentUser) {
    return (
      <div className="profile-page">
        <div className="error-message">Please sign in to view your profile</div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="profile-page">
        <div className="loading">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar">
            <FaUser />
          </div>
          <div className="profile-info">
            <h1>{currentUser.name}</h1>
            <p className="profile-email">{currentUser.email}</p>
            <span className={`role-badge ${currentUser.role}`}>{currentUser.role}</span>
          </div>
        </div>

        <div className="profile-content">
          <div className="profile-section">
            <h2>
              <FaMapMarkerAlt className="section-icon" />
              Address Information
            </h2>
            <div className="address-card">
              {currentUser.address ? (
                <>
                  <p>{currentUser.address.street}</p>
                  <p>{currentUser.address.city}, {currentUser.address.state} {currentUser.address.zipCode}</p>
                  <p>{currentUser.address.country}</p>
                </>
              ) : (
                <p>Address information not available</p>
              )}
            </div>
          </div>

          <div className="profile-section">
            <h2>
              <FaCalendarAlt className="section-icon" />
              Order History ({orders.length})
            </h2>
            {error && <div className="error-message">{error}</div>}
            {orders.length === 0 ? (
              <div className="no-orders">
                <p>No orders found. Start exploring our services!</p>
              </div>
            ) : (
              <div className="orders-list">
                {orders.map(order => (
                  <div key={order.id} className="order-card">
                    <div className="order-header">
                      <div className="order-info">
                        <h3>{order.service.name}</h3>
                        <p className="order-id">Order #{order.id}</p>
                      </div>
                      <div className="order-status">
                        {getStatusIcon(order.status)}
                        <span className={getStatusClass(order.status)}>
                          {order.status.replace('-', ' ').toUpperCase()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="order-details">
                      <div className="order-detail-item">
                        <span className="label">Provider:</span>
                        <span className="value">{order.service.provider.name}</span>
                      </div>
                      <div className="order-detail-item">
                        <span className="label">Phone:</span>
                        <span className="value">{order.service.phone}</span>
                      </div>
                      <div className="order-detail-item">
                        <span className="label">Location:</span>
                        <span className="value">{order.service.location}</span>
                      </div>
                      <div className="order-detail-item">
                        <span className="label">Service Type:</span>
                        <span className="value">{order.service.type}</span>
                      </div>
                      <div className="order-detail-item">
                        <span className="label">Order Date:</span>
                        <span className="value">{formatDate(order.orderDate)}</span>
                      </div>
                      <div className="order-detail-item">
                        <span className="label">Scheduled:</span>
                        <span className="value">{formatDate(order.scheduledDate)}</span>
                      </div>
                      <div className="order-detail-item">
                        <span className="label">Price:</span>
                        <span className="value price">{formatPrice(order.service.price)}</span>
                      </div>
                      {order.rating && (
                        <div className="order-detail-item">
                          <span className="label">Your Rating:</span>
                          <span className="value rating">
                            {Array.from({ length: 5 }, (_, i) => (
                              <FaStar 
                                key={i} 
                                className={i < order.rating! ? 'star filled' : 'star'} 
                              />
                            ))}
                            <span className="rating-number">({order.rating}/5)</span>
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 