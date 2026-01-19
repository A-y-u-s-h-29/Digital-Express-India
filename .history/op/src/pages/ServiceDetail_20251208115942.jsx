import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { services } from '../components/data/data';

const ServiceDetail = () => {
  const { serviceId, subserviceId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    businessName: '',
    businessLocation: '',
    phoneNumber: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  
  // Refs for animation
  const elementsRef = useRef([]);
  const formRef = useRef(null);
  const imageRef = useRef(null);

  // Check mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);


  // Find service and subservice
  const service = services.find(s => s.id === parseInt(serviceId));
  const subservice = service?.subservices.find(s => s.id === parseInt(subserviceId));

  if (!service || !subservice) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white px-4">
        <div className="text-center p-6 w-full max-w-md">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
            <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">Service Not Found</h1>
          <p className="text-gray-600 mb-6 text-sm sm:text-base">
            The service you're looking for doesn't exist or has been moved.
          </p>
          <button 
            onClick={() => navigate('/')}
            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-gray-900 to-black text-white font-semibold rounded-xl hover:from-black hover:to-gray-900 transition-all duration-300 active:scale-95 shadow-lg"
          >
            Back to Home
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
    
    try {
      // Web3Forms API Integration
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          access_key: 'YOUR_WEB3FORMS_ACCESS_KEY',
          subject: `Inquiry: ${subservice.name}`,
          business_name: formData.businessName,
          business_location: formData.businessLocation,
          phone_number: formData.phoneNumber,
          email: formData.email,
          message: formData.message,
          service: service.name,
          subservice: subservice.name,
          from_name: formData.businessName,
          reply_to: formData.email
        })
      });

      const result = await response.json();
      
      if (result.success) {
        setSubmitStatus('success');
        setFormData({
          businessName: '',
          businessLocation: '',
          phoneNumber: '',
          email: '',
          message: ''
        });
        
        if (!isMobile) {
          gsap.fromTo('.success-message', 
            { scale: 0.8, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }
          );
        }
        
        setTimeout(() => setSubmitStatus(null), 5000);
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 text-gray-900 pt-10 pb-12 px-4 sm:px-6">
      {/* Mobile Header Sticky */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-sm z-40 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center text-gray-700"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="text-sm font-medium">Back</span>
          </button>
          <span className="text-sm font-semibold text-gray-900 truncate max-w-[140px]">
            {subservice.name}
          </span>
          <div className="w-10"></div> {/* Spacer for balance */}
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-12 lg:pt-4">
        {/* Desktop Back Button - Hidden on mobile */}
        <div className="hidden lg:block mb-6">
          <button 
            onClick={() => navigate('/')}
            className="group inline-flex items-center px-4 py-2.5 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl hover:bg-white hover:shadow-lg hover:border-gray-300 transition-all duration-300"
          >
            <svg className="w-5 h-5 mr-2 text-gray-600 group-hover:text-gray-900 group-hover:-translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="font-medium text-gray-700 group-hover:text-gray-900">Back to Home</span>
          </button>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Left Column - Service Details */}
          <div>
            {/* Service Image & Header */}
            <div className="mb-6 lg:mb-8">
              <div 
                ref={imageRef}
                className="relative w-full h-56 sm:h-64 md:h-72 rounded-2xl lg:rounded-3xl overflow-hidden mb-6"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10"></div>
                
                <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-6 z-20">
                  <span className="inline-block px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs sm:text-sm font-semibold text-gray-800">
                    {service.name}
                  </span>
                </div>
              </div>
              
              <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 leading-tight">
                  {subservice.name}
                </h1>
                <p className="text-gray-600 text-sm sm:text-base lg:text-lg">
                  Complete solution for your business needs
                </p>
              </div>
              
              {/* Call Now Button - Mobile Full Width */}
              <button 
                onClick={() => {
                  window.location.href = 'tel:+1234567890';
                }}
                className="w-full lg:w-auto px-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 active:scale-95 shadow-lg flex items-center justify-center space-x-2 mb-6"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>CALL FOR QUOTE</span>
              </button>
            </div>

            {/* Service Description - Mobile Accordion Style */}
            <div className="mb-6 bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-blue-100 flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">Service Overview</h2>
              </div>
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                {subservice.description}
              </p>
            </div>

            {/* What's Included */}
            <div className="mb-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="mr-2">📋</span>
                What's Included
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  'Professional Setup',
                  'Quality Assurance',
                  'Ongoing Support',
                  'Regular Updates',
                  'Dedicated Manager',
                  '24/7 Support'
                ].map((feature, index) => (
                  <div 
                    key={index} 
                    className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="font-medium text-gray-800 text-sm sm:text-base">{feature}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Benefits */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-blue-100">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900">Why Choose Us</h3>
              </div>
              <ul className="space-y-3">
                {[
                  {text: 'Expert professionals', icon: '👨‍💼'},
                  {text: 'Quick turnaround', icon: '⚡'},
                  {text: 'Competitive pricing', icon: '💰'},
                  {text: '100% satisfaction', icon: '✅'}
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-xl mr-3">{item.icon}</span>
                    <span className="font-medium text-gray-800 text-sm sm:text-base">{item.text}</span>
                    {index === 3 && (
                      <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                        Guarantee
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column - Inquiry Form */}
          <div>
            <div 
              ref={formRef}
              className="bg-white rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-lg sm:shadow-xl border border-gray-100 p-4 sm:p-6 lg:p-8"
            >
              <div className="text-center mb-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 rounded-lg sm:rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">Get Your Free Quote</h2>
                <p className="text-gray-600 text-sm sm:text-base">
                  Our expert will contact you within 2 hours
                </p>
              </div>

              {/* Status Messages */}
              {submitStatus === 'success' && (
                <div className="mb-4 p-3 sm:p-4 bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-emerald-100 flex items-center justify-center mr-3">
                      <svg className="w-4 h-4 sm:w-6 sm:h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-emerald-800 text-sm sm:text-base">Thank You!</h4>
                      <p className="text-emerald-700 text-xs sm:text-sm">We'll contact you shortly.</p>
                    </div>
                  </div>
                </div>
              )}
              
              {submitStatus === 'error' && (
                <div className="mb-4 p-3 sm:p-4 bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-red-100 flex items-center justify-center mr-3">
                      <svg className="w-4 h-4 sm:w-6 sm:h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-red-800 text-sm sm:text-base">Submission Failed</h4>
                      <p className="text-red-700 text-xs sm:text-sm">Please try again.</p>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                {/* Form fields with mobile optimization */}
                {[
                  { label: 'Business Name *', name: 'businessName', type: 'text', placeholder: 'Business name', icon: '🏢' },
                  { label: 'Location *', name: 'businessLocation', type: 'text', placeholder: 'City, State', icon: '📍' },
                  { label: 'Phone *', name: 'phoneNumber', type: 'tel', placeholder: 'Phone number', icon: '📱' },
                  { label: 'Email *', name: 'email', type: 'email', placeholder: 'Email address', icon: '✉️' },
                ].map((field, index) => (
                  <div key={index} className="relative">
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 pl-1">
                      {field.label}
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
                        {field.icon}
                      </div>
                      <input
                        type={field.type}
                        name={field.name}
                        value={formData[field.name]}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 pr-3 py-2.5 sm:py-3.5 bg-gray-50 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-300"
                        placeholder={field.placeholder}
                      />
                    </div>
                  </div>
                ))}

                {/* Message Textarea */}
                <div className="relative">
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 pl-1">
                    Additional Details
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-3 text-gray-400 text-sm">
                      💬
                    </div>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows="3"
                      className="w-full pl-10 pr-3 py-2.5 sm:py-3.5 bg-gray-50 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-300 resize-none"
                      placeholder="Tell us about your requirements..."
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 sm:py-4 bg-gradient-to-r from-gray-900 to-black text-white font-bold rounded-lg sm:rounded-xl hover:from-black hover:to-gray-900 transition-all duration-300 active:scale-95 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-4 w-4 sm:h-5 sm:w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="text-sm sm:text-base">Processing...</span>
                    </div>
                  ) : (
                    <span className="text-sm sm:text-base">GET FREE QUOTE</span>
                  )}
                </button>

                {/* Privacy Note - Mobile Optimized */}
                <div className="text-center pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-500">
                    <span className="inline-flex items-center">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Your information is secure
                    </span>
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    By submitting, you agree to our terms
                  </p>
                </div>
              </form>
            </div>

            {/* Mobile Call Now Sticky Bottom */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 shadow-2xl">
              <div className="max-w-7xl mx-auto">
                <button 
                  onClick={() => {
                    window.location.href = 'tel:+1234567890';
                  }}
                  className="w-full flex items-center justify-center space-x-2 py-3"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="font-bold">CALL NOW FOR QUICK QUOTE</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Spacing for Sticky Elements */}
      <div className="lg:hidden h-20"></div>
    </div>
  );
};

export default ServiceDetail;