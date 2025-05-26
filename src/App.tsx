import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
  email: string;
  name: string;
  role: 'user' | 'admin';
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

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

  return (
    <Router>
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
          title="Sign In"
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
          title="Sign Up"
        >
          <SignUp 
            onSignUp={handleSignUpSuccess}
            onSignInClick={() => {
              setIsSignUpModalOpen(false);
              setIsSignInModalOpen(true);
            }}
          />
        </Modal>
      </div>
    </Router>
  );
};

export default App;
