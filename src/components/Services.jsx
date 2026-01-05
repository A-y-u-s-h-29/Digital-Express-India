import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import TextRoll from './v1/TextRoll';
import { useNavigate } from 'react-router-dom';
import { services } from './data/data';
import { Helmet } from 'react-helmet-async';

// Register ScrollTrigger
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const Services = () => {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [isImageHovered, setIsImageHovered] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  const navigate = useNavigate();
  const servicesRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const accordionItemsRef = useRef([]);
  const imageContainerRef = useRef(null);
  const hoverTimeoutRef = useRef(null);
  const imageRef = useRef(null);
  const scrollTriggersRef = useRef([]);

  // Service images - memoized to prevent recreation
  const serviceImages = useMemo(() => [
    '/img.avif',
    'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    '/img1.avif',
    '/img2.avif',
    '/img3.webp',
    'https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  ], []);

  // Initialize with first image
  useEffect(() => {
    setCurrentImage(serviceImages[0]);
  }, [serviceImages]);

  // Preload images and cleanup
  useEffect(() => {
    // Preload images
    const preloadImages = () => {
      serviceImages.forEach((src) => {
        // Only preload local images and mark external images for lazy loading
        if (src.startsWith('/')) {
          const img = new Image();
          img.src = src;
        }
      });
    };
    
    preloadImages();

    // Preconnect to external domains
    const preconnectLinks = [
      { rel: "preconnect", href: "https://images.unsplash.com" },
    ];

    preconnectLinks.forEach(link => {
      const el = document.createElement("link");
      el.rel = link.rel;
      el.href = link.href;
      el.crossOrigin = "anonymous";
      document.head.appendChild(el);
    });

    // Cleanup on unmount
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      
      // Kill all ScrollTrigger instances
      scrollTriggersRef.current.forEach(trigger => {
        if (trigger && trigger.kill) trigger.kill();
      });
      
      // Kill all GSAP animations
      gsap.killTweensOf([
        titleRef.current, 
        subtitleRef.current, 
        imageContainerRef.current,
        imageRef.current,
        ...accordionItemsRef.current
      ]);
    };
  }, [serviceImages]);

  // Animations setup
  useEffect(() => {
    const scrollTriggers = [];

    // Title animation
    const titleTrigger = ScrollTrigger.create({
      trigger: titleRef.current,
      start: 'top 90%',
      once: true,
      onEnter: () => {
        gsap.fromTo(
          titleRef.current,
          { y: 100, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.5,
            ease: 'power4.out'
          }
        );
      }
    });
    scrollTriggers.push(titleTrigger);

    // Subtitle animation
    const subtitleTrigger = ScrollTrigger.create({
      trigger: subtitleRef.current,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.fromTo(
          subtitleRef.current,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.2,
            delay: 0.3,
            ease: 'power3.out'
          }
        );
      }
    });
    scrollTriggers.push(subtitleTrigger);

    // Accordion items animation
    gsap.utils.toArray('.accordion-item').forEach((item, index) => {
      const accordionTrigger = ScrollTrigger.create({
        trigger: item,
        start: 'top 90%',
        once: true,
        onEnter: () => {
          gsap.fromTo(
            item,
            { y: 50, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.8,
              delay: index * 0.1,
              ease: 'power3.out'
            }
          );
        }
      });
      scrollTriggers.push(accordionTrigger);
    });

    scrollTriggersRef.current = scrollTriggers;

    return () => {
      scrollTriggers.forEach(trigger => trigger.kill());
    };
  }, []);

  // Memoized handlers
  const handleMouseEnter = useCallback((index) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    
    setCurrentImage(serviceImages[index]);
    setHoveredIndex(index);
    
    if (imageContainerRef.current) {
      gsap.killTweensOf(imageContainerRef.current);
      
      gsap.to(imageContainerRef.current, {
        opacity: 0,
        scale: 0.8,
        duration: 0.1,
        onComplete: () => {
          gsap.fromTo(imageContainerRef.current,
            {
              opacity: 0,
              scale: 0.8,
              width: '100px',
              height: '100px'
            },
            {
              opacity: 1,
              scale: 1,
              width: '300px',
              height: '300px',
              duration: 0.6,
              ease: 'back.out(1.7)'
            }
          );
        }
      });
    }
  }, [serviceImages]);

  const handleMouseLeave = useCallback(() => {
    hoverTimeoutRef.current = setTimeout(() => {
      if (!isImageHovered) {
        hideImage();
      }
    }, 100);
  }, [isImageHovered]);

  const handleImageMouseEnter = useCallback(() => {
    setIsImageHovered(true);
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
  }, []);

  const handleImageMouseLeave = useCallback(() => {
    setIsImageHovered(false);
    hoverTimeoutRef.current = setTimeout(() => {
      hideImage();
    }, 150);
  }, []);

  const hideImage = useCallback(() => {
    setHoveredIndex(null);
    
    if (imageContainerRef.current) {
      gsap.killTweensOf(imageContainerRef.current);
      
      gsap.to(imageContainerRef.current, {
        opacity: 0,
        scale: 0.3,
        width: '100px',
        height: '100px',
        duration: 0.4,
        ease: 'power2.in'
      });
    }
  }, []);

  const handleAccordionClick = useCallback((index) => {
    const wasExpanded = expandedIndex === index;
    setExpandedIndex(wasExpanded ? null : index);

    const content = accordionItemsRef.current[index]?.querySelector('.accordion-content');
    if (content) {
      if (wasExpanded) {
        gsap.to(content, {
          height: 0,
          opacity: 0,
          duration: 0.4,
          ease: 'power2.inOut'
        });
      } else {
        gsap.fromTo(content,
          { height: 0, opacity: 0 },
          {
            height: 'auto',
            opacity: 1,
            duration: 0.5,
            ease: 'power2.out'
          }
        );
      }
    }
  }, [expandedIndex]);

  const handleServiceClick = useCallback((serviceId) => {
    navigate(`/subservice/${serviceId}/subservices`);
  }, [navigate]);

  // Calculate total subservices for meta description
  const totalSubservices = useMemo(() => {
    return services.reduce((total, service) => total + service.subservices.length, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>Our Services | Website Development & Digital Marketing Solutions</title>
        <meta
          name="description"
          content={`Explore professional website development, design, and digital marketing services at Digital Express India. We offer ${services.length} main services with ${totalSubservices} specialized subservices for your business growth.`}
        />
        <meta
          name="keywords"
          content="website development services, digital marketing services, seo services india, web design services, ecommerce development, mobile app development, ui/ux design, digital transformation"
        />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta property="og:title" content="Our Services | Website Development & Digital Marketing" />
        <meta property="og:description" content="Complete digital solutions for your business growth. Professional services from Digital Express India." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://digitalexpressindia.com/services" />
        <meta property="og:site_name" content="Digital Express India" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Digital Express India Services" />
        <meta name="twitter:description" content="Professional website development and digital marketing services" />
        <link rel="canonical" href="https://digitalexpressindia.com/services" />
        
        {/* Structured Data for Service Page */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "Digital Express India Services",
            "description": "Complete digital solutions for business growth",
            "url": "https://digitalexpressindia.com/services",
            "provider": {
              "@type": "Organization",
              "name": "Digital Express India",
              "url": "https://digitalexpressindia.com"
            },
            "serviceType": services.map(service => service.name),
            "areaServed": {
              "@type": "Country",
              "name": "India"
            },
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "Digital Services",
              "itemListElement": services.map((service, index) => ({
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": service.name,
                  "description": service.description,
                  "provider": {
                    "@type": "Organization",
                    "name": "Digital Express India"
                  }
                },
                "position": index + 1
              }))
            }
          })}
        </script>
      </Helmet>

      <div 
        className="min-h-screen bg-white text-black" 
        ref={servicesRef}
        role="main"
        aria-label="Our Services"
      >
        <section className="pt-32 pb-20 lg:px-8 relative">
          <div className="max-w-7xl mx-auto">
            {/* Main Title */}
            <div className="mb-12 px-6">
              <h1 
                ref={titleRef}
                className="text-7xl lg:text-9xl font-black tracking-tighter leading-none"
                aria-label="Services"
              >
                <TextRoll className="text-black big">
                  SERVICES
                </TextRoll>
              </h1>
            </div>

            {/* Subtitle */}
            <div className="mb-20 max-w-3xl px-6">
              <p 
                ref={subtitleRef}
                className="text-xl exo lg:text-3xl text-gray-700 font-medium tracking-wide"
                aria-label="Service description"
              >
                COMPLETE DIGITAL SOLUTIONS FOR YOUR BUSINESS GROWTH
              </p>
            </div>

            {/* Separator Line */}
            <div className="relative bg-gray-300 mb-20" aria-hidden="true">
              <div className="absolute left-0 top-1/2 w-32 h-0.5 bg-black transform -translate-y-1/2"></div>
            </div>

            {/* Floating Image */}
            <div 
              ref={imageContainerRef}
              className="fixed top-1/2 right-28 z-40 pointer-events-auto hidden lg:block"
              style={{
                opacity: 0,
                transform: 'translateY(-50%) scale(0.3)',
                width: '100px',
                height: '100px',
                transformOrigin: 'center center'
              }}
              onMouseEnter={handleImageMouseEnter}
              onMouseLeave={handleImageMouseLeave}
              aria-hidden={hoveredIndex === null}
              role="img"
              aria-label={hoveredIndex !== null ? `Visual representation of ${services[hoveredIndex]?.name} service` : "Service visualization"}
            >
              <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  ref={imageRef}
                  src={currentImage}
                  alt={hoveredIndex !== null ? `Illustration for ${services[hoveredIndex]?.name} service` : "Digital services"}
                  className="w-full h-full object-cover transition-opacity duration-200"
                  loading={hoveredIndex === null ? "lazy" : "eager"}
                  onLoad={() => {
                    if (imageRef.current) {
                      gsap.fromTo(imageRef.current,
                        { opacity: 0 },
                        { opacity: 1, duration: 0.3 }
                      );
                    }
                  }}
                  key={currentImage}
                  width="300"
                  height="300"
                />
              </div>
            </div>

            {/* Services Accordion */}
            <div 
              className="space-y-6"
              role="list"
              aria-label="List of services"
            >
              {services.map((service, index) => (
                <article
                  key={service.id}
                  ref={(el) => {
                    if (el && !accordionItemsRef.current.includes(el)) {
                      accordionItemsRef.current[index] = el;
                    }
                  }}
                  className="accordion-item border-b border-gray-200"
                  onMouseEnter={() => handleMouseEnter(index)}
                  onMouseLeave={handleMouseLeave}
                  onFocus={() => handleMouseEnter(index)}
                  onBlur={handleMouseLeave}
                  role="listitem"
                  tabIndex={0}
                >
                  {/* Service Header */}
                  <button
                    onClick={() => handleServiceClick(service.id)}
                    className="w-full py-4 lg:py-8 flex items-center justify-between hover:bg-gray-50 transition-colors duration-300 group relative"
                    aria-expanded={expandedIndex === index}
                    aria-controls={`service-content-${service.id}`}
                    aria-label={`Learn more about ${service.name} service with ${service.subservices.length} subservices`}
                  >
                    <div 
                      className={`absolute inset-y-0 left-0 w-1 bg-black transform transition-transform duration-300 ${hoveredIndex === index ? 'scale-y-100' : 'scale-y-0'}`}
                      aria-hidden="true"
                    ></div>
                    
                    <div className="flex items-start w-full">
                      {/* Service Number */}
                      <div className="w-12 flex-shrink-0">
                        <span 
                          className="text-sm font-medium text-gray-500 tracking-widest"
                          aria-hidden="true"
                        >
                          {service.id.toString().padStart(2, '0')}
                        </span>
                      </div>

                      {/* Service Info */}
                      <div className="flex-1 text-left">
                        <h3 className="text-2xl big lg:text-4xl font-bold mb-2">
                          <TextRoll>
                            {service.name}
                          </TextRoll>
                        </h3>

                        <div className="mb-2">
                          <p className="text-md lg:text-xl exo font-light text-gray-600 tracking-wide">
                            {service.description}
                          </p>
                        </div>
                        
                        {/* View Subservices Button */}
                        <div className="mt-4 flex items-center text-blue-600 font-medium">
                          <span>View {service.subservices.length} Subservices</span>
                          <svg 
                            className="w-5 h-5 ml-2 transform group-hover:translate-x-2 transition-transform"
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </div>
                      </div>

                      {/* Arrow Icon */}
                      <div 
                        className="mr-2 w-12 flex-shrink-0 flex items-center justify-center"
                        aria-hidden="true"
                      >
                        <div className="h-8 w-8 lg:w-12 lg:h-12 rounded-full border-2 border-gray-300 flex items-center justify-center transition-all duration-300 group-hover:border-black group-hover:bg-black">
                          <svg 
                            className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors duration-300"
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </button>
                </article>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default React.memo(Services);