import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import TopBar from './components/TopBar';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Service from './pages/Service';
import AddService from './pages/AddService';
import Profile from './pages/Profile';
import Modal from './components/Modal';
import { setGlobalSignInHandler, setGlobalNavigateToHome } from './config/api';
import './styles/theme.css';
import './styles/App.css';

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

const AppContent: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [isAdminSignUpModalOpen, setIsAdminSignUpModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const jwtToken = localStorage.getItem('jwt_token');
    
    if (storedUser && jwtToken) {
      setUser(JSON.parse(storedUser));
    } else {
      localStorage.removeItem('user');
      localStorage.removeItem('jwt_token');
    }
  }, []);

  useEffect(() => {
    setGlobalSignInHandler(() => {
      setIsSignInModalOpen(true);
    });
    
    setGlobalNavigateToHome(() => {
      navigate('/');
    });
  }, [navigate]);

  useEffect(() => {
    if (location.pathname === '/adminSignup') {
      console.log('admin');
      setIsAdminSignUpModalOpen(true);
      navigate('/', { replace: true });
    }
  }, [location.pathname, navigate]);

  const handleLogin = (userData: User) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    setIsSignInModalOpen(false);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('jwt_token');
  };

  const handleSignUpSuccess = (userData: User) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    setIsSignUpModalOpen(false);
  };

  const handleAdminSignUpSuccess = (userData: User) => {
    const adminUser = { ...userData, role: 'admin' as const };
    setUser(adminUser);
    localStorage.setItem('user', JSON.stringify(adminUser));
    setIsAdminSignUpModalOpen(false);
  };

  return (
    <div className="app">
      <TopBar 
        user={user} 
        onLogout={handleLogout} 
        onSignInClick={() => setIsSignInModalOpen(true)}
      />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home user={user} onLogin={handleLogin} />} />
          <Route path="/services/:id" element={<Service user={user} />} />
          <Route
            path="/profile"
            element={
              user ? (
                <Profile user={user} />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/add-service"
            element={
              user?.role === 'admin' ? (
                <AddService user={user} />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
        </Routes>
      </main>

      <Modal 
        isOpen={isSignInModalOpen} 
        onClose={() => setIsSignInModalOpen(false)}
      >
        <SignIn 
          onLogin={handleLogin} 
          onSignUpClick={() => {
            setIsSignInModalOpen(false);
            setIsSignUpModalOpen(true);
          }}
        />
      </Modal>

      <Modal 
        isOpen={isSignUpModalOpen} 
        onClose={() => setIsSignUpModalOpen(false)}
      >
        <SignUp 
          onSignUp={handleSignUpSuccess}
          onSignInClick={() => {
            setIsSignUpModalOpen(false);
            setIsSignInModalOpen(true);
          }}
        />
      </Modal>

      <Modal 
        isOpen={isAdminSignUpModalOpen} 
        onClose={() => setIsAdminSignUpModalOpen(false)}
      >
        <SignUp 
          onSignUp={handleAdminSignUpSuccess}
          onSignInClick={() => {
            setIsAdminSignUpModalOpen(false);
            setIsSignInModalOpen(true);
          }}
          isAdminSignUp={true}
        />
      </Modal>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
