import React, { useEffect, useRef, useMemo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Helmet } from 'react-helmet-async';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const Reviews = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const cardsRef = useRef([]);
  const highlightsRef = useRef([]);

  // Memoize testimonials data to prevent unnecessary re-renders
  const testimonials = useMemo(() => [
    {
      id: 1,
      name: "Arjun Mehta",
      position: "Digital Marketing Head",
      quote: "He asked thoughtful, strategic questions that helped us clarify our message and visual identity. The result was a digital presence that feels alive, intuitive, and deeply aligned with our values.",
      highlight: "alive, intuitive, and value-aligned"
    },
    {
      id: 2,
      name: "Priya Sharma",
      position: "UI/UX Lead",
      quote: "His grasp of UI/UX principles is sophisticated, and he approaches every project with equal parts logic and imagination. What impressed me most was his ability to think like a true designer.",
      highlight: "logic and imagination in perfect balance"
    },
    {
      id: 3,
      name: "Rajesh Patel",
      position: "Marketing Head",
      quote: "He is the kind of designer every marketing team dreams of working with. He listens deeply, understands the brand voice instantly, and brings ideas to life with clarity and creativity.",
      highlight: "listens deeply and understands instantly"
    },
  ], []);

  useEffect(() => {
    // Cleanup function for animations
    let scrollTriggers = [];

    // Title reveal animation
    const titleAnimation = ScrollTrigger.create({
      trigger: titleRef.current,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.fromTo(titleRef.current,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: 'power3.out'
          }
        );
      }
    });
    scrollTriggers.push(titleAnimation);

    // Cards animation
    cardsRef.current.forEach((card, index) => {
      if (card) {
        const cardAnimation = ScrollTrigger.create({
          trigger: card,
          start: 'top 90%',
          once: true,
          onEnter: () => {
            gsap.fromTo(card,
              { 
                opacity: 0, 
                y: 80,
                scale: 0.95 
              },
              {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.9,
                delay: index * 0.15,
                ease: 'power3.out'
              }
            );
          }
        });
        scrollTriggers.push(cardAnimation);
      }
    });

    // Highlight text animation
    highlightsRef.current.forEach((highlight, index) => {
      if (highlight) {
        const highlightAnimation = ScrollTrigger.create({
          trigger: highlight,
          start: 'top 85%',
          once: true,
          onEnter: () => {
            gsap.fromTo(highlight,
              { width: 0 },
              {
                width: '100%',
                duration: 1.5,
                delay: index * 0.3 + 0.8,
                ease: 'power2.inOut'
              }
            );
          }
        });
        scrollTriggers.push(highlightAnimation);
      }
    });

    // Cleanup function
    return () => {
      scrollTriggers.forEach(trigger => trigger.kill());
      gsap.killTweensOf([titleRef.current, ...cardsRef.current, ...highlightsRef.current]);
    };
  }, []);

  const handleCardHover = React.useCallback((index, isHovering) => {
    const card = cardsRef.current[index];
    if (card) {
      gsap.killTweensOf(card);
      gsap.to(card, {
        y: isHovering ? -12 : 0,
        duration: 0.4,
        ease: 'power2.out'
      });
    }
  }, []);

  // Preload any critical assets
  useEffect(() => {
    // Preconnect to any external domains if needed
    const preconnectLinks = [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com" },
    ];

    preconnectLinks.forEach(link => {
      const el = document.createElement("link");
      el.rel = link.rel;
      el.href = link.href;
      el.crossOrigin = "anonymous";
      document.head.appendChild(el);
    });
  }, []);

  return (
    <>
      <Helmet>
        <title>Client Reviews & Testimonials | Digital Express India</title>
        <meta
          name="description"
          content="Read genuine client reviews and testimonials for website development services by Digital Express India. See what Arjun Mehta, Priya Sharma, and Rajesh Patel have to say about our work."
        />
        <meta
          name="keywords"
          content="client reviews, testimonials, website development feedback, digital marketing testimonials, web design reviews, digital express india reviews"
        />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta property="og:title" content="Client Reviews & Testimonials | Digital Express India" />
        <meta property="og:description" content="Read genuine client reviews and testimonials for website development services by Digital Express India." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://digitalexpressindia.com/reviews" />
        <meta property="og:site_name" content="Digital Express India" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Digital Express India Client Reviews" />
        <meta name="twitter:description" content="What industry leaders say about working with Digital Express India" />
        <link rel="canonical" href="https://digitalexpressindia.com/reviews" />
        
        {/* Structured Data for Reviews */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "Client Reviews & Testimonials",
            "description": "Genuine client reviews and testimonials for Digital Express India",
            "url": "https://digitalexpressindia.com/reviews",
            "mainEntity": {
              "@type": "ItemList",
              "itemListElement": testimonials.map((testimonial, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "item": {
                  "@type": "Review",
                  "author": {
                    "@type": "Person",
                    "name": testimonial.name
                  },
                  "reviewBody": testimonial.quote,
                  "reviewRating": {
                    "@type": "Rating",
                    "ratingValue": "5",
                    "bestRating": "5"
                  },
                  "publisher": {
                    "@type": "Organization",
                    "name": "Digital Express India"
                  }
                }
              }))
            }
          })}
        </script>
      </Helmet>

      <div 
        className="min-h-screen bg-black text-white rounded-t-3xl" 
        ref={sectionRef}
        role="main"
        aria-label="Client reviews and testimonials"
      >
        <section className="py-20 lg:py-12 px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            
            {/* Title Section */}
            <div className="mb-20 lg:mb-28">
              <div ref={titleRef} className="inline-block">
                <div className="relative mb-5">
                  <h1 className="text-6xl exo lg:text-9xl font-bold relative z-10 tracking-tight">
                    REVIEWS
                  </h1>
                </div>
                
                <p className="text-lg lg:text-xl text-white/70 max-w-2xl mx-auto">
                  What industry leaders say about our collaboration
                </p>
              </div>
            </div>

            {/* Testimonials Grid */}
            <div 
              className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10 mb-24"
              role="list"
              aria-label="Client testimonials"
            >
              {testimonials.map((testimonial, index) => (
                <article
                  key={testimonial.id}
                  ref={(el) => {
                    if (el && !cardsRef.current.includes(el)) {
                      cardsRef.current[index] = el;
                    }
                  }}
                  className="group relative"
                  onMouseEnter={() => handleCardHover(index, true)}
                  onMouseLeave={() => handleCardHover(index, false)}
                  onFocus={() => handleCardHover(index, true)}
                  onBlur={() => handleCardHover(index, false)}
                  role="listitem"
                  aria-labelledby={`testimonial-title-${testimonial.id}`}
                  tabIndex={0}
                >
                  {/* Glow effect */}
                  <div 
                    className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    aria-hidden="true"
                  />
                  
                  {/* Card */}
                  <div className="relative h-full p-8 lg:p-10 bg-gray-900/30 backdrop-blur-sm rounded-2xl border border-white/10 group-hover:border-white/20 transition-all duration-500">
                    {/* Company logo indicator */}
                    <div 
                      className="absolute top-6 right-6 text-white/20 text-4xl font-bold"
                      aria-hidden="true"
                    >
                      0{testimonial.id}
                    </div>
                    
                    {/* Quote */}
                    <div className="mb-8">
                      <div 
                        className="text-white/30 text-5xl font-serif mb-6"
                        aria-hidden="true"
                      >
                        "
                      </div>
                      <p className="text-lg lg:text-xl text-white/90 leading-relaxed">
                        {testimonial.quote}
                      </p>
                    </div>

                    {/* Highlight underline */}
                    <div className="mb-10 overflow-hidden">
                      <div 
                        ref={(el) => {
                          if (el && !highlightsRef.current.includes(el)) {
                            highlightsRef.current[index] = el;
                          }
                        }}
                        className="h-px bg-gradient-to-r from-white/0 via-white to-white/0"
                        aria-hidden="true"
                      />
                    </div>

                    {/* Client Info */}
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 
                          id={`testimonial-title-${testimonial.id}`}
                          className="text-2xl font-bold mb-1"
                        >
                          {testimonial.name}
                        </h3>
                        <p className="text-white/70">{testimonial.position}</p>
                        {/* Hidden text for SEO */}
                        <span className="sr-only">
                          Rating: 5 out of 5 stars. Review excerpt: {testimonial.highlight}
                        </span>
                      </div>
                      
                      {/* Hover arrow */}
                      <div 
                        className="opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300"
                        aria-hidden="true"
                      >
                        <svg 
                          className="w-6 h-6" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={1.5} 
                            d="M17 8l4 4m0 0l-4 4m4-4H3" 
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default React.memo(Reviews);