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
import './styles/theme.css';
import './styles/App.css';

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

const AppContent: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [isAdminSignUpModalOpen, setIsAdminSignUpModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    // Check for admin signup URL
    if (location.pathname === '/adminSignup') {
      console.log('admin');
      setIsAdminSignUpModalOpen(true);
      // Navigate back to home
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
  };

  const handleSignUpSuccess = (userData: User) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    setIsSignUpModalOpen(false);
  };

  const handleAdminSignUpSuccess = (userData: User) => {
    // Force role to admin for admin signup
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
