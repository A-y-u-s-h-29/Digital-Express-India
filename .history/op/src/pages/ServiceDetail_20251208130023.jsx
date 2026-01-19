import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { services } from '../components/data/data';

const ServiceDetail = () => {
  const { serviceId, subserviceId } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [activeFeature, setActiveFeature] = useState(0);
  const [showWhatsAppOptions, setShowWhatsAppOptions] = useState(false);
  const [copied, setCopied] = useState(false);

  // Auto-rotate features
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const service = services.find(s => s.id === parseInt(serviceId));
  const subservice = service?.subservices.find(s => s.id === parseInt(subserviceId));

  // WhatsApp functionality
  const whatsappNumber = "+919667277348";
  const whatsappMessage = `Hello! I'm interested in ${subservice?.name}. Please provide more details.`;

  const handleWhatsAppClick = () => {
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`, '_blank');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(whatsappNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!service || !subservice) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
            <span className="text-3xl">⚠️</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-3">Service Not Found</h1>
          <p className="text-gray-600 mb-8">The requested service could not be found.</p>
          <button 
            onClick={() => navigate('/')}
            className="px-8 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-black transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setSubmitStatus('success');
      setFormData({ name: '', phone: '', email: '', message: '' });
      setIsSubmitting(false);
      
      setTimeout(() => setSubmitStatus(null), 3000);
    }, 1500);
  };

  const features = [
    { icon: '⚡', title: 'Fast Delivery', desc: '24-48 hours turnaround' },
    { icon: '💎', title: 'Premium Quality', desc: 'Industry-best standards' },
    { icon: '🛡️', title: '100% Secure', desc: 'Data protection guaranteed' }
  ];

  const includedItems = [
    'Professional Consultation',
    'Custom Strategy',
    '24/7 Support',
    'Quality Assurance',
    'Regular Updates',
    'Success Reports'
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <span>←</span>
            <span>Back</span>
          </button>
          
          <div className="text-center">
            <h1 className="text-lg font-bold text-gray-900">{subservice.name}</h1>
            <p className="text-sm text-gray-500">Get instant quote</p>
          </div>
          
          <div className="w-20"></div> {/* Spacer */}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Service Details */}
          <div>
            {/* Service Header */}
            <div className="mb-8">
              <div className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4">
                {service.name}
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {subservice.name}
              </h1>
              <p className="text-gray-600 text-lg">
                {subservice.description}
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-3 mb-8">
              <button 
                onClick={() => window.location.href = `tel:${whatsappNumber}`}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <span>📞</span>
                Call Now
              </button>
              
              <button 
                onClick={handleWhatsAppClick}
                className="flex-1 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
              >
                <span>💬</span>
                WhatsApp
              </button>
            </div>

            {/* Features Carousel */}
            <div className="mb-8 bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Why Choose Us</h2>
              
              <div className="relative h-32 overflow-hidden">
                {features.map((feature, index) => (
                  <div 
                    key={index}
                    className={`absolute inset-0 transition-all duration-500 ${
                      activeFeature === index ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl">
                        {feature.icon}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{feature.title}</h3>
                        <p className="text-gray-600">{feature.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-center gap-2 mt-6">
                {features.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveFeature(index)}
                    className={`w-2 h-2 rounded-full ${
                      activeFeature === index ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* What's Included */}
            <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">What's Included</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {includedItems.map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 text-sm">✓</span>
                    </div>
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* WhatsApp Quick Info */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600">💬</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Quick WhatsApp Inquiry</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Send: <span className="font-medium">"Hello! I need {subservice.name}"</span>
                  </p>
                </div>
              </div>
              
              <div className="mt-4 flex gap-2">
                <button 
                  onClick={handleWhatsAppClick}
                  className="flex-1 bg-green-600 text-white py-2.5 rounded-lg font-medium hover:bg-green-700 transition-colors"
                >
                  Open WhatsApp
                </button>
                <button 
                  onClick={copyToClipboard}
                  className="px-4 py-2.5 bg-white border border-green-300 text-green-700 rounded-lg font-medium hover:bg-green-50 transition-colors"
                >
                  {copied ? 'Copied!' : 'Copy Number'}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="bg-white rounded-xl shadow-lg p-6 lg:p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📋</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Get Free Quote</h2>
                <p className="text-gray-600">Get pricing within 1 hour</p>
              </div>

              {/* Status Messages */}
              {submitStatus === 'success' && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-green-600 text-xl">✅</span>
                    <div>
                      <p className="font-medium text-green-800">Thank you!</p>
                      <p className="text-sm text-green-700">We'll contact you shortly.</p>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Form Fields */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Enter phone number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Enter email address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Requirements
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                    placeholder="Tell us about your project..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gray-900 text-white py-4 rounded-lg font-bold hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Processing...</span>
                    </div>
                  ) : (
                    'GET FREE QUOTE NOW'
                  )}
                </button>
              </form>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-center text-sm text-gray-500">
                  <span className="flex items-center justify-center gap-1">
                    <span>🔒</span>
                    Your data is 100% secure
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Bottom Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="max-w-7xl mx-auto flex gap-3">
          <button 
            onClick={() => window.location.href = `tel:${whatsappNumber}`}
            className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2"
          >
            <span>📞</span>
            Call Now
          </button>
          
          <button 
            onClick={handleWhatsAppClick}
            className="flex-1 bg-green-600 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2"
          >
            <span>💬</span>
            WhatsApp
          </button>
        </div>
      </div>

      {/* Spacer for mobile bottom bar */}
      <div className="lg:hidden h-20"></div>
    </div>
  );
};

export default ServiceDetail;