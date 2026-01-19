import React, { useState } from 'react';
import TextRoll from './v1/TextRoll';

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', or null

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    
    const form = e.target;
    const formData = new FormData(form);
    
    formData.append('access_key', '4bb59a47-d936-4b81-b4d8-3609f37220de');
    
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSubmitStatus('success');
        form.reset();
        
        // Auto-hide success message after 5 seconds
        setTimeout(() => {
          setSubmitStatus(null);
        }, 5000);
      } else {
        setSubmitStatus('error');
        
        // Auto-hide error message after 5 seconds
        setTimeout(() => {
          setSubmitStatus(null);
        }, 5000);
      }
    } catch (error) {
      console.error('Error:', error);
      setSubmitStatus('error');
      
      // Auto-hide error message after 5 seconds
      setTimeout(() => {
        setSubmitStatus(null);
      }, 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-white flex items-center justify-center p-4 py-8">
        <div className="max-w-6xl w-full flex flex-col md:flex-row items-start justify-between gap-12 md:gap-24">
          
          {/* LEFT SECTION - Text Content */}
          <div className="md:w-1/2 exo">
            <h1 className="text-5xl md:text-6xl font-bold text-[#333333] mb-6 tracking-tight">
              LET'S WORK TOGETHER
            </h1>
            
            <div className="w-24 h-[2px] bg-[#333333] mb-8"></div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-[#333333] mb-6">
              <TextRoll>LET'S COMMENT!</TextRoll>  
            </h2>
            
            <p className="text-xl md:text-2xl text-[#444444] leading-relaxed">
              FEELING GOOD ABOUT A NEW PROJECT? WRITE ME WHAT'S IN YOUR MIND AND LET'S TALK ABOUT IT!
            </p>
          </div>
          
          {/* RIGHT SECTION - Contact Form */}
          <div className="md:w-1/2 bg-white p-12 rounded-lg shadow-lg relative">
            <h3 className="text-2xl font-bold text-[#333333] mb-6">Get in Touch</h3>
            
            {/* Confirmation/Error Message on top of the form */}
            {submitStatus === 'success' && (
              <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 animate-slideIn">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-800">
                      Message sent successfully! We'll get back to you soon.
                    </p>
                  </div>
                  <div className="ml-auto pl-3">
                    <button
                      onClick={() => setSubmitStatus(null)}
                      className="text-green-500 hover:text-green-700"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 animate-slideIn">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-800">
                      Failed to send message. Please try again.
                    </p>
                  </div>
                  <div className="ml-auto pl-3">
                    <button
                      onClick={() => setSubmitStatus(null)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            <form className="space-y-4" onSubmit={handleSubmit}>
              <input type="hidden" name="subject" value="New Contact Form Submission" />
              <input type="checkbox" name="botcheck" className="hidden" style={{display: 'none'}} />
              
              <div>
                <label className="block text-[#333333] mb-2">Name</label>
                <input 
                  type="text" 
                  name="name"
                  className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#333333]"
                  placeholder="Your name"
                  required
                  disabled={isSubmitting}
                />
              </div>
              
              <div>
                <label className="block text-[#333333] mb-2">Email</label>
                <input 
                  type="email" 
                  name="email"
                  className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#333333]"
                  placeholder="Your email"
                  required
                  disabled={isSubmitting}
                />
              </div>
              
              <div>
                <label className="block text-[#333333] mb-2">Message</label>
                <textarea 
                  name="message"
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#333333] resize-none"
                  placeholder="Your message"
                  required
                  disabled={isSubmitting}
                ></textarea>
              </div>
              
              <button 
                type="submit"
                disabled={isSubmitting}
                className={`w-full text-white py-3 px-6 rounded font-medium transition flex items-center justify-center ${
                  isSubmitting 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-[#333333] hover:bg-black'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    SENDING...
                  </>
                ) : (
                  'SEND MESSAGE'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Add CSS for animation */}
      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default Contact;