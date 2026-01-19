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
  
  // Refs for animation
  const elementsRef = useRef([]);
  const formRef = useRef(null);
  const imageRef = useRef(null);

  // Find service and subservice
  const service = services.find(s => s.id === parseInt(serviceId));
  const subservice = service?.subservices.find(s => s.id === parseInt(subserviceId));

  // Animation on component mount
  useEffect(() => {
    gsap.fromTo(
      elementsRef.current,
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out"
      }
    );

    gsap.fromTo(
      imageRef.current,
      { scale: 1.1, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.8, ease: "power2.out" }
    );

    gsap.fromTo(
      formRef.current,
      { x: 30, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.8, delay: 0.3, ease: "power2.out" }
    );
  }, []);

  if (!service || !subservice) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
        <div className="text-center p-8">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center">
            <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Service Not Found</h1>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            The service you're looking for doesn't exist or has been moved.
          </p>
          <button 
            onClick={() => navigate('/')}
            className="px-8 py-3 bg-gradient-to-r from-gray-900 to-black text-white font-semibold rounded-xl hover:from-black hover:to-gray-900 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
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
        
        // Animation for success message
        gsap.fromTo('.success-message', 
          { scale: 0.8, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }
        );
        
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 text-gray-900 pt-24 pb-20">
      {/* Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/3 w-72 h-72 bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Back Button */}
        <div 
          className="mb-8"
          ref={el => elementsRef.current[0] = el}
        >
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Service Details */}
          <div>
            {/* Service Image & Header */}
            <div 
              className="mb-10"
              ref={el => elementsRef.current[1] = el}
            >
              <div 
                ref={imageRef}
                className="relative w-full h-72 rounded-3xl overflow-hidden mb-8 group"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent z-10"></div>
                <img 
                  src={subservice.image} 
                  alt={subservice.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                  <span className="inline-block px-4 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-sm font-semibold text-gray-800 mb-2">
                    {service.name}
                  </span>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div>
                  <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-3 leading-tight">
                    {subservice.name}
                  </h1>
                  <p className="text-lg text-gray-600">
                    Complete solution for your business needs
                  </p>
                </div>
                
                {/* Call Now Button */}
                <button 
                  onClick={() => {
                    window.location.href = 'tel:+1234567890';
                  }}
                  className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-blue-500/25 flex items-center justify-center space-x-3 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  <svg className="w-5 h-5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="relative z-10">CALL FOR QUOTE</span>
                </button>
              </div>
            </div>

            {/* Service Description */}
            <div 
              className="mb-10 bg-white rounded-2xl p-8 shadow-sm border border-gray-100"
              ref={el => elementsRef.current[2] = el}
            >
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Service Overview</h2>
              </div>
              <p className="text-gray-700 text-lg leading-relaxed">
                {subservice.description}
              </p>
            </div>

            {/* What's Included */}
            <div 
              className="mb-10"
              ref={el => elementsRef.current[3] = el}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="mr-3">📋</span>
                What's Included
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  'Professional Setup & Configuration',
                  'Quality Assurance & Testing',
                  'Ongoing Support & Maintenance',
                  'Regular Updates & Reports',
                  'Dedicated Account Manager',
                  '24/7 Customer Support'
                ].map((feature, index) => (
                  <div 
                    key={index} 
                    className="group bg-white p-5 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="font-medium text-gray-800">{feature}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Benefits */}
            <div 
              className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100"
              ref={el => elementsRef.current[4] = el}
            >
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Why Choose Us</h3>
              </div>
              <ul className="space-y-4">
                {[
                  {text: 'Expert professionals with 10+ years experience', icon: '👨‍💼'},
                  {text: 'Quick turnaround time (24-48 hours)', icon: '⚡'},
                  {text: 'Competitive pricing with no hidden costs', icon: '💰'},
                  {text: '100% satisfaction guaranteed', icon: '✅'},
                  {text: 'Custom solutions tailored to your needs', icon: '🎯'},
                  {text: 'Post-service support & maintenance', icon: '🛠️'}
                ].map((item, index) => (
                  <li key={index} className="flex items-start group hover:translate-x-2 transition-transform duration-300">
                    <span className="text-2xl mr-4">{item.icon}</span>
                    <div>
                      <span className="font-medium text-gray-800">{item.text}</span>
                      {index === 3 && (
                        <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                          Money Back Guarantee
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column - Inquiry Form */}
          <div>
            <div 
              ref={formRef}
              className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 lg:p-10 sticky top-24 overflow-hidden"
            >
              {/* Form background decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-green-500/5 to-teal-500/5 rounded-full translate-y-20 -translate-x-20"></div>
              
              <div className="relative z-10">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Get Your Free Quote</h2>
                  <p className="text-gray-600">
                    Complete this form and our expert will contact you within 2 hours
                  </p>
                </div>

                {/* Status Messages */}
                {submitStatus === 'success' && (
                  <div className="success-message mb-6 p-5 bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-xl">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center mr-4">
                        <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-bold text-emerald-800">Thank You!</h4>
                        <p className="text-emerald-700">We've received your inquiry. Our team will contact you shortly.</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {submitStatus === 'error' && (
                  <div className="mb-6 p-5 bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 rounded-xl">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mr-4">
                        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-bold text-red-800">Submission Failed</h4>
                        <p className="text-red-700">Please try again or contact us directly.</p>
                      </div>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Form fields with improved styling */}
                  {[
                    { label: 'Business Name *', name: 'businessName', type: 'text', placeholder: 'Enter your business name', icon: '🏢' },
                    { label: 'Business Location *', name: 'businessLocation', type: 'text', placeholder: 'City, State, Country', icon: '📍' },
                    { label: 'Phone Number *', name: 'phoneNumber', type: 'tel', placeholder: '+1 (555) 123-4567', icon: '📱' },
                    { label: 'Email Address *', name: 'email', type: 'email', placeholder: 'you@business.com', icon: '✉️' },
                  ].map((field, index) => (
                    <div key={index} className="relative">
                      <label className="block text-sm font-semibold text-gray-700 mb-2 pl-1">
                        {field.label}
                      </label>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                          {field.icon}
                        </div>
                        <input
                          type={field.type}
                          name={field.name}
                          value={formData[field.name]}
                          onChange={handleChange}
                          required
                          className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-300 hover:border-gray-300"
                          placeholder={field.placeholder}
                        />
                      </div>
                    </div>
                  ))}

                  {/* Message Textarea */}
                  <div className="relative">
                    <label className="block text-sm font-semibold text-gray-700 mb-2 pl-1">
                      Additional Details
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-4 text-gray-400">
                        💬
                      </div>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows="4"
                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-300 hover:border-gray-300 resize-none"
                        placeholder="Tell us about your specific requirements, timeline, budget, and any special requests..."
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group relative w-full py-4 bg-gradient-to-r from-gray-900 to-black text-white font-bold rounded-xl hover:from-black hover:to-gray-900 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                    {isSubmitting ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing Your Request...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <span className="mr-2">GET FREE QUOTE</span>
                        <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </div>
                    )}
                  </button>

                  {/* Privacy Note */}
                  <div className="text-center pt-4 border-t border-gray-100">
                    <p className="text-xs text-gray-500">
                      <span className="inline-flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        Your information is secure with us. We never share your data.
                      </span>
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      By submitting, you agree to our terms and privacy policy
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add these styles for animations */}
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default ServiceDetail;