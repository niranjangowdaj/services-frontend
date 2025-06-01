import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaPhone, FaMapMarkerAlt, FaBroom, FaWrench, FaBolt, FaPaintBrush, FaHammer, FaLeaf, FaTruck } from 'react-icons/fa';
import { ServiceType, Location } from '../types/enums';
import { API_ENDPOINTS, apiRequest } from '../config/api';
import Modal from '../components/Modal';
import SignIn from './SignIn';
import '../styles/Home.css';

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  rating: number;
  reviews: number;
  location: Location;
  type: ServiceType;
  image: string;
  phone: string;
  features: string[];
  provider: {
    id: string;
    name: string;
    avatar: string;
  };
}

interface HomeProps {
  user: any;
  onLogin: (user: any) => void;
}

const serviceIcons: Record<ServiceType, React.ReactNode> = {
  [ServiceType.CLEANING]: <FaBroom className="icon" />,
  [ServiceType.PLUMBING]: <FaWrench className="icon" />,
  [ServiceType.ELECTRICAL]: <FaBolt className="icon" />,
  [ServiceType.PAINTING]: <FaPaintBrush className="icon" />,
  [ServiceType.CARPENTRY]: <FaHammer className="icon" />,
  [ServiceType.GARDENING]: <FaLeaf className="icon" />,
  [ServiceType.MOVING]: <FaTruck className="icon" />,
  [ServiceType.OTHER]: <FaWrench className="icon" />
};

const Home: React.FC<HomeProps> = ({ user, onLogin }) => {
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [selectedType, setSelectedType] = useState<ServiceType | ''>('');
  const [selectedLocation, setSelectedLocation] = useState<Location | ''>('');
  const [sortBy, setSortBy] = useState<'price' | 'rating'>('rating');
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Preselect location based on user's city when user changes
  useEffect(() => {
    if (user && user.role === 'user' && user.address && user.address.city) {
      const userCity = user.address.city.trim().toUpperCase();
      // Check if user's city matches any of the available locations
      const availableLocations = Object.values(Location);
      
      // First try exact match
      let matchingLocation = availableLocations.find(location => 
        location.toUpperCase() === userCity
      );
      
      // If no exact match, try partial match (for cases like "New Delhi" -> "Delhi")
      if (!matchingLocation) {
        matchingLocation = availableLocations.find(location => 
          userCity.includes(location.toUpperCase()) || location.toUpperCase().includes(userCity)
        );
      }
      
      if (matchingLocation && selectedLocation !== matchingLocation) {
        setSelectedLocation(matchingLocation);
      }
    }
  }, [user]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await apiRequest(API_ENDPOINTS.services);
        if (!response.ok) {
          throw new Error('Failed to fetch services');
        }
        const data = await response.json();
        setServices(data);
        setFilteredServices(data);
      } catch (err) {
        setError('Failed to load services. Please try again later.');
        console.error('Error fetching services:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, []);

  const filterAndSortServices = () => {
    let filtered = [...services];

    if (selectedType) {
      filtered = filtered.filter(service => service.type === selectedType);
    }

    if (selectedLocation) {
      filtered = filtered.filter(service => service.location === selectedLocation);
    }

    filtered.sort((a, b) => {
      if (sortBy === 'price') {
        return a.price - b.price;
      }
      return b.rating - a.rating;
    });

    setFilteredServices(filtered);
  };

  useEffect(() => {
    filterAndSortServices();
  }, [selectedType, selectedLocation, sortBy, services]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  if (isLoading) {
    return <div className="loading">Loading services...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="home">
      <div className="filters">
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value as ServiceType | '')}
        >
          <option value="">All Types</option>
          {Object.values(ServiceType).map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>

        <select
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value as Location | '')}
        >
          <option value="">All Locations</option>
          {Object.values(Location).map(location => (
            <option key={location} value={location}>{location}</option>
          ))}
        </select>

        <div className="sort-buttons">
          <button
            className={`sort-button ${sortBy === 'price' ? 'active' : ''}`}
            onClick={() => setSortBy('price')}
          >
            Sort by Price
          </button>
          <button
            className={`sort-button ${sortBy === 'rating' ? 'active' : ''}`}
            onClick={() => setSortBy('rating')}
          >
            Sort by Rating
          </button>
        </div>
      </div>

      <div className="services-grid">
        {filteredServices.map(service => (
          <Link to={`/services/${service.id}`} key={service.id} className="service-card">
            <div className="service-icon">{serviceIcons[service.type]}</div>
            <img src={service.image} alt={service.name} />
            <h2>{service.name}</h2>
            <p>{service.description}</p>
            <div className="service-meta">
              <div className="service-rating">
                <FaStar />
                <span>{service.rating} ({service.reviews})</span>
              </div>
              <div className="service-cost">{formatPrice(service.price)}</div>
            </div>
            <div className="service-location">
              <FaMapMarkerAlt />
              <span>{service.location}</span>
            </div>
          </Link>
        ))}
      </div>

      <Modal
        isOpen={isSignInModalOpen}
        onClose={() => setIsSignInModalOpen(false)}
      >
        <SignIn onLogin={onLogin} onSignUpClick={() => {
          setIsSignInModalOpen(false);
          setIsSignUpModalOpen(true);
        }} />
      </Modal>
    </div>
  );
};

export default Home; 