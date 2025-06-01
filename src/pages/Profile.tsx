import React, { useState, useEffect } from 'react';
import { FaUser, FaMapMarkerAlt, FaCalendarAlt, FaStar, FaClock, FaCheckCircle, FaHourglassHalf, FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import { API_ENDPOINTS, apiRequest } from '../config/api';
import '../styles/Profile.css';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'admin';
  address: {
    address: string;
    city: string;
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
  isReviewed: boolean;
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
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [editedAddress, setEditedAddress] = useState('');
  const [hoveredRating, setHoveredRating] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const fetchCompleteUserData = async () => {
      if (!user) return;
      
      try {
        const response = await apiRequest(`${API_ENDPOINTS.users}/${user.id}`);
        if (response.ok) {
          const userData = await response.json();
          setCompleteUser(userData);
          // Update localStorage with fresh user data
          localStorage.setItem('user', JSON.stringify(userData));
        }
      } catch (err) {
        console.error('Error fetching complete user data:', err);
      }
    };

    fetchCompleteUserData();
  }, [user]);

  useEffect(() => {
    const fetchUserOrdersWithServices = async () => {
      if (!user) return;
      
      try {
        // Fetch user-specific orders from the correct endpoint
        const ordersResponse = await apiRequest(`${API_ENDPOINTS.orders}/user/${user.id}`);
        if (!ordersResponse.ok) {
          throw new Error('Failed to fetch orders');
        }
        const userOrdersData = await ordersResponse.json();

        // The backend already returns orders with service data included
        const ordersWithServices: OrderWithService[] = userOrdersData.map((orderData: any) => ({
          id: orderData.id.toString(),
          userId: orderData.userId,
          serviceId: orderData.serviceId.toString(),
          rating: orderData.rating,
          status: orderData.status.toLowerCase().replace('_', '-'),
          orderDate: orderData.orderDate,
          scheduledDate: orderData.scheduledDate,
          isReviewed: orderData.isReviewed,
          service: {
            id: orderData.service.id.toString(),
            name: orderData.service.name,
            price: orderData.service.price || orderData.service.cost,
            location: orderData.service.location,
            type: orderData.service.category,
            phone: orderData.service.phone,
            provider: {
              id: orderData.service.provider.id,
              name: orderData.service.provider.name,
              avatar: orderData.service.provider.avatar
            }
          }
        }));

        setOrders(ordersWithServices);
      } catch (err) {
        setError('Failed to load order history');
        console.error('Error fetching orders:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserOrdersWithServices();
  }, [user]);

  const handleEditAddress = () => {
    setEditedAddress(completeUser?.address?.address || '');
    setIsEditingAddress(true);
  };

  const handleSaveAddress = async () => {
    if (!completeUser) return;

    try {
      const response = await apiRequest(`${API_ENDPOINTS.users}/${completeUser.id}/address`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address: editedAddress }),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setCompleteUser(updatedUser);
        // Update localStorage with the complete updated user data
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setIsEditingAddress(false);
      } else {
        setError('Failed to update address');
      }
    } catch (err) {
      setError('Failed to update address');
      console.error('Error updating address:', err);
    }
  };

  const handleCancelEdit = () => {
    setIsEditingAddress(false);
    setEditedAddress('');
  };

  const handleRatingHover = (orderId: string, rating: number) => {
    setHoveredRating(prev => ({ ...prev, [orderId]: rating }));
  };

  const handleRatingLeave = (orderId: string) => {
    setHoveredRating(prev => {
      const newState = { ...prev };
      delete newState[orderId];
      return newState;
    });
  };

  const handleRatingClick = async (orderId: string, rating: number) => {
    try {
      const response = await apiRequest(`${API_ENDPOINTS.orders}/${orderId}/rating`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rating }),
      });

      if (response.ok) {
        // Update the order in the local state
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order.id === orderId 
              ? { ...order, rating, isReviewed: true }
              : order
          )
        );
        // Clear hover state
        handleRatingLeave(orderId);
      } else {
        setError('Failed to submit rating');
      }
    } catch (err) {
      setError('Failed to submit rating');
      console.error('Error submitting rating:', err);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const response = await apiRequest(`${API_ENDPOINTS.orders}/${orderId}/status?status=${newStatus}`, {
        method: 'PUT'
      });

      if (response.ok) {
        // Refetch orders to get updated data
        const ordersResponse = await apiRequest(`${API_ENDPOINTS.orders}/user/${user?.id}`);
        if (ordersResponse.ok) {
          const userOrdersData = await ordersResponse.json();
          const ordersWithServices: OrderWithService[] = userOrdersData.map((orderData: any) => ({
            id: orderData.id.toString(),
            userId: orderData.userId,
            serviceId: orderData.serviceId.toString(),
            rating: orderData.rating,
            status: orderData.status.toLowerCase().replace('_', '-'),
            orderDate: orderData.orderDate,
            scheduledDate: orderData.scheduledDate,
            isReviewed: orderData.isReviewed,
            service: {
              id: orderData.service.id.toString(),
              name: orderData.service.name,
              price: orderData.service.price || orderData.service.cost,
              location: orderData.service.location,
              type: orderData.service.category,
              phone: orderData.service.phone,
              provider: {
                id: orderData.service.provider.id,
                name: orderData.service.provider.name,
                avatar: orderData.service.provider.avatar
              }
            }
          }));
          setOrders(ordersWithServices);
        }
      } else {
        setError('Failed to update order status');
      }
    } catch (err) {
      setError('Failed to update order status');
      console.error('Error updating order status:', err);
    }
  };

  const renderStars = (order: OrderWithService) => {
    const orderId = order.id;
    const currentRating = order.rating || 0;
    const hovered = hoveredRating[orderId] || 0;
    const isReviewed = order.isReviewed;
    const canRate = order.status === 'completed' && !isReviewed;

    return (
      <div className="rating-stars">
        {Array.from({ length: 5 }, (_, i) => {
          const starNumber = i + 1;
          let isFilled = false;
          
          if (canRate) {
            // If can rate, show hovered stars or current rating
            isFilled = hovered > 0 ? starNumber <= hovered : starNumber <= currentRating;
          } else if (isReviewed) {
            // If already reviewed, show the actual rating
            isFilled = starNumber <= currentRating;
          }
          
          return (
            <FaStar
              key={i}
              className={`star ${isFilled ? 'filled' : ''} ${canRate ? 'interactive' : ''}`}
              onMouseEnter={() => canRate && handleRatingHover(orderId, starNumber)}
              onMouseLeave={() => canRate && handleRatingLeave(orderId)}
              onClick={() => canRate && handleRatingClick(orderId, starNumber)}
              style={{
                cursor: canRate ? 'pointer' : 'default',
                color: isFilled ? '#fbbf24' : '#d1d5db',
                fontSize: '1.1rem',
                transition: 'all 0.2s ease'
              }}
            />
          );
        })}
        {isReviewed && currentRating > 0 && (
          <span className="rating-text">({currentRating}/5)</span>
        )}
        {canRate && (
          <span className="rating-text">Click to rate</span>
        )}
      </div>
    );
  };

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
            <div className="profile-badges">
              <span className={`role-badge ${currentUser.role}`}>{currentUser.role}</span>
              {currentUser.address?.city && (
                <span className="city-badge">
                  <FaMapMarkerAlt className="city-icon" />
                  {currentUser.address.city}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="profile-content">
          {currentUser.role !== 'admin' && (
            <div className="profile-section">
              <h2>
                <FaMapMarkerAlt className="section-icon" />
                Address Information
              </h2>
              <div className="address-card">
                {!isEditingAddress ? (
                  <div className="address-display">
                    <p className="address-text">
                      {currentUser.address?.address || 'No address provided'}
                    </p>
                    <button 
                      className="edit-button" 
                      onClick={handleEditAddress}
                      title="Edit Address"
                    >
                      <FaEdit />
                    </button>
                  </div>
                ) : (
                  <div className="address-edit">
                    <textarea
                      value={editedAddress}
                      onChange={(e) => setEditedAddress(e.target.value)}
                      placeholder="Enter your address"
                      className="address-input"
                      rows={3}
                    />
                    <div className="edit-actions">
                      <button 
                        className="save-button" 
                        onClick={handleSaveAddress}
                        title="Save Address"
                      >
                        <FaSave />
                      </button>
                      <button 
                        className="cancel-button" 
                        onClick={handleCancelEdit}
                        title="Cancel"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {currentUser.role !== 'admin' && (
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
                          <span className="label">Price:</span>
                          <span className="value price">{formatPrice(order.service.price)}</span>
                        </div>
                        <div className="order-detail-item">
                          <span className="label">Rating:</span>
                          <span className="value rating">
                            {renderStars(order)}
                          </span>
                        </div>
                      </div>
                      
                      {/* Action buttons */}
                      <div className="order-actions">
                        {order.status !== 'completed' && (
                          <button 
                            className="complete-order-btn"
                            onClick={() => handleStatusChange(order.id, 'COMPLETED')}
                            title="Mark order as completed"
                          >
                            <FaCheckCircle />
                            Mark as Completed
                          </button>
                        )}
                        {order.status === 'completed' && !order.isReviewed && (
                          <div className="rating-prompt">
                            <span className="rating-prompt-text">
                              ⭐ Service completed! Please rate your experience above.
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {currentUser.role === 'admin' && (
            <div className="profile-section">
              <h2>Admin Dashboard</h2>
              <div className="admin-info">
                <p>We can develop an admin panel to manage ( not developed yet because out of scope for assignment)</p>
                <div className="admin-features">
                  <div className="admin-feature">
                    <h3>Service Management</h3>
                    <p>Add, edit, and manage services on the platform</p>
                  </div>
                  <div className="admin-feature">
                    <h3>User Management</h3>
                    <p>Monitor and manage user accounts and activities</p>
                  </div>
                  <div className="admin-feature">
                    <h3>System Overview</h3>
                    <p>Access platform analytics and system status</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile; 