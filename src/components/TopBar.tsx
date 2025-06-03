import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaUser, FaUserPlus, FaSignOutAlt, FaUserCircle, FaPlus, FaList, FaChartBar } from 'react-icons/fa';
import '../styles/TopBar.css';

interface TopBarProps {
  user: any;
  onLogout: () => void;
  onSignInClick: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ user, onLogout, onSignInClick }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isServicePage = location.pathname.startsWith('/service/');

  return (
    <div className="top-bar">
      <div className="top-bar-content">
        <div className="logo" onClick={() => navigate('/')}>
          E-Services
        </div>
        <div className="nav-links">
          {isServicePage && (
            <Link to="/" className="nav-link">
              <FaList /> All Services
            </Link>
          )}
          {user ? (
            <>
              {user.role === 'admin' && (
                <>
                  <Link to="/add-service" className="nav-link admin-link">
                    <FaPlus /> Add Service
                  </Link>
                  <Link to="/analytics" className="nav-link admin-link">
                    <FaChartBar /> Analytics
                  </Link>
                </>
              )}
              <div className="user-info" ref={dropdownRef}>
                <span>{user.email}</span>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="icon-button"
                >
                  <FaUser />
                </button>
                {isDropdownOpen && (
                  <div className="dropdown-menu">
                    <button className="dropdown-item" onClick={() => navigate('/profile')}>
                      <FaUserCircle /> Profile
                    </button>
                    <button className="dropdown-item" onClick={onLogout}>
                      <FaSignOutAlt /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <button onClick={onSignInClick} className="nav-link">
              <FaUserPlus /> Sign In
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopBar; 