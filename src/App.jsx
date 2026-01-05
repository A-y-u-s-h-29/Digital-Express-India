import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';

// Common Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Lazy Loaded Components
const Home = lazy(() => import('./components/Home'));
const About = lazy(() => import('./components/About'));
const Services = lazy(() => import('./components/Services'));
const Skiper = lazy(() => import('./components/Portfolio'));
const ModernAchievement = lazy(() => import('./components/AchievementShowcase'));
const Reviews = lazy(() => import('./components/Reviews'));
const Connect = lazy(() => import('./components/Connect'));

const Contact = lazy(() => import('./pages/Contact'));
const Terms = lazy(() => import('./pages/Terms'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Refund = lazy(() => import('./pages/Refund'));
const ServiceDetail = lazy(() => import('./pages/ServiceDetail'));
const ServiceSubservices = lazy(() => import('./pages/ServiceSubservices'));

// Simple Loader Component
const Loader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <p className="text-lg font-semibold">Loading...</p>
  </div>
);

function App() {
  return (
    <>
      <Suspense fallback={<Loader />}>
        <Routes>

          {/* Home Page */}
          <Route
            path="/"
            element={
              <>
                <Home />
                <About />
                <Services />
                <Skiper />
                <ModernAchievement />
                <Reviews />
                <Connect />
              </>
            }
          />

          {/* Projects */}
          <Route
            path="/projects"
            element={
              <>
                <Navbar isHomePage={false} />
                <Skiper />
              </>
            }
          />

          {/* Contact */}
          <Route path="/contact" element={<Contact />} />

          {/* Legal Pages */}
          <Route
            path="/term"
            element={
              <>
                <Navbar isHomePage={false} />
                <Terms />
              </>
            }
          />

          <Route
            path="/privacy"
            element={
              <>
                <Navbar isHomePage={false} />
                <Privacy />
              </>
            }
          />

          <Route
            path="/refund"
            element={
              <>
                <Navbar isHomePage={false} />
                <Refund />
              </>
            }
          />

          {/* Service Pages */}
          <Route
            path="/subservice/:serviceId/subservices"
            element={
              <>
                <Navbar isHomePage={false} />
                <ServiceSubservices />
              </>
            }
          />

          <Route
            path="/subservice/:serviceId/detail/:subserviceId"
            element={
              <>
                <Navbar isHomePage={false} />
                <ServiceDetail />
              </>
            }
          />

          

        </Routes>
      </Suspense>

      <Footer />
    </>
  );
}

export default App;
