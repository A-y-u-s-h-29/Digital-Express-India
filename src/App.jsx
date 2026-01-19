import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Navbar from './components/Navbar';
import Home from './components/Home';
import About from './components/About';
import Services from './components/Services';
import Skiper from './components/Portfolio';
import ModernAchievement from './components/AchievementShowcase';
import Reviews from './components/Reviews';
import Connect from './components/Connect';
import Footer from './components/Footer';

import ServiceDetail from './pages/ServiceDetail';
import ServiceSubservices from './pages/ServiceSubservices';
import Contact from './pages/Contact';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Refund from './pages/Refund';

import Login from './components/Login';
import Dashboard from './components/Dashboard';
import CareerPage from './components/CareerPage';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) setIsAuthenticated(true);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        Loading...
      </div>
    );
  }

  return (
    <Routes>
      {/* Home */}
      <Route path="/" element={
        <>
          <Navbar isHomePage />
          <Home />
          <About />
          <Services />
          <Skiper />
          <ModernAchievement />
          <Reviews />
          <Connect />
          <Footer />
        </>
      } />

      {/* Careers */}
      <Route path="/careers" element={
        <>
          <Navbar isHomePage={false} />
          <CareerPage />
          <Footer />
        </>
      } />

      {/* Contact */}
      <Route path="/contact" element={
        <>
          <Navbar isHomePage={false} />
          <Contact />
          <Footer />
        </>
      } />

      {/* Policies */}
      <Route path="/term" element={<><Navbar /><Terms /><Footer /></>} />
      <Route path="/privacy" element={<><Navbar /><Privacy /><Footer /></>} />
      <Route path="/refund" element={<><Navbar /><Refund /><Footer /></>} />

      {/* Services */}
      <Route path="/subservice/:serviceId/subservices" element={<><Navbar /><ServiceSubservices /><Footer /></>} />
      <Route path="/subservice/:serviceId/detail/:subserviceId" element={<><Navbar /><ServiceDetail /><Footer /></>} />

      {/* Admin */}
      <Route
        path="/admin/login"
        element={!isAuthenticated ? <Login setIsAuthenticated={() => setIsAuthenticated(true)} /> : <Navigate to="/admin/dashboard" />}
      />

      <Route
        path="/admin/dashboard"
        element={isAuthenticated ? <Dashboard onLogout={() => setIsAuthenticated(false)} /> : <Navigate to="/admin/login" />}
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
