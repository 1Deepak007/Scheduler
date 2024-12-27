import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './components/Login';
import Signup from './components/Signup';
import Todos from './components/Todos';
import Cookies from 'js-cookie';
import Navbar from './components/utils/Navbar';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check for tokens on mount
  useEffect(() => {
    const access_Token = Cookies.get('accessToken');
    const refresh_Token = Cookies.get('refreshToken');
    setIsAuthenticated(!!access_Token && !!refresh_Token); // Set true if both tokens exist
  }, []);

  const checkAuthentication = () => {
    const access_Token = Cookies.get('accessToken');
    const refresh_Token = Cookies.get('refreshToken');
    setIsAuthenticated(!!access_Token && !!refresh_Token); // Set true if both tokens exist
  };

  useEffect(() => {
    checkAuthentication();
  }, []);

  // Logout handler to reset authentication
  // const handleLogout = () => {
  //   setIsAuthenticated(false);
  // };

  return (
    <Router>
      <div className="bg-gray-100 min-h-screen">
        {isAuthenticated && <Navbar onLogout={() => setIsAuthenticated(false)} />}
        <Routes>
          {/* Protected Todos route */}
          <Route
            path="/"
            element={isAuthenticated ? <Todos /> : <Navigate to="/login" />}
          />
          {/* Public routes */}
          <Route
            path="/signup"
            element={!isAuthenticated ? <Signup /> : <Navigate to="/" />}
          />
          <Route
            path="/login"
            element={!isAuthenticated ? <Login onLogin={checkAuthentication} /> : <Navigate to="/" />}
          />
        </Routes>
        <ToastContainer />
      </div>
    </Router>
  );
}

export default App;
