import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ReactLenis } from "lenis/react";
import { Helmet } from 'react-helmet-async';

// सभी 6 Projects अलग-अलग array में
const allProjects = [
  {
    id: 1,
    title: "Shiv Gauri",
    subtitle: "Infrastructure Services",
    description:
      "Shiv Gauri Infra Project provides reliable Fabrication, O&M, and R&M services with precision, efficiency, and long-term infrastructure support.",
    results: "Reliable Infra Services",
    year: "2024",
    tech: ["React", "Node.js", "MongoDB", "Stripe"],
    link: "https://shivgauriinfra.com/",
    bgImage: "/Shiv.png"
  },
  {
    id: 2,
    title: "Best Balloon",
    subtitle: "Event Decoration",
    description:
      "Professional event decoration services that turn your special moments into unforgettable memories.",
    results: "Event Decoration",
    year: "2024",
    tech: ["React", "Node.js", "MongoDB", "Stripe"],
    link: "https://precious-elf-6c250a.netlify.app/",
    bgImage: "/ballon.png"
  },
  {
    id: 3,
    title: "Hsrp Plate",
    subtitle: "Hsrp Plate Booking",
    description:
      "Get you'r vehical hsrp number plate",
    results: "Hsrp Plate Booking",
    year: "2024",
    tech: ["React", "Node.js", "MongoDB", "Stripe"],
    link: "https://bookingshsrp.com/",
    bgImage: "/hsrp.png"
  },
   {
    id: 4,
    title: "Kuntal Agro",
    subtitle: "Ecommerce Website",
    description:
      "Expert Agro chemical for supieror crop's",
    results: "Hsrp Plate Booking",
    year: "2024",
    tech: ["React", "Node.js", "MongoDB", "Stripe"],
    link: "https://www.kuntalagro.com/",
    bgImage: "/kuntal.png"
  },
  {
    id: 5,
    title: "Best Mehndi Artist",
    subtitle: "Professional Mehndi Artist",
    description:
      "Get beautifully crafted Bridal Mehndi, Engagement Mehndi, Party Mehndi, and festival henna designs",
    year: "2024",
    tech: ["React", "Node.js", "MongoDB", "Stripe"],
    link: "https://www.bestmehndiartist.in/",
    bgImage: "/mehndi.png"
  },
  {
    id: 6,
    title: "Venus Geyser Service",
    subtitle: "Home Service Platform",
    description:
      "Venus Geyser Service provides fast, reliable, and expert geyser installation and repair solutions for homes and businesses.",
    results: "Local Service Website",
    year: "2024",
    tech: ["React", "Node.js", "MongoDB", "Stripe"],
    link: "https://venus-geyser-service.netlify.app/",
    bgImage: "/Venus.png"
  },
  {
    id: 7,
    title: "Stellar Serve",
    subtitle: "Fast URL Indexing Tool",
    description:
      "StellarServe provides fast and reliable indexing solutions to help blogs and websites get discovered quickly on search engines.",
    results: "Indexing API Integration",
    year: "2024",
    tech: ["Flutter", "Firebase", "Google Maps API"],
    link: "https://dapper-druid-feb24d.netlify.app/",
    bgImage: "/quick.png"
  },
  {
    id: 8,
    title: "Mahesh Painter",
    subtitle: "Building Painting Service",
    description:
      "Mahesh Painter delivers expert, high-quality residential and commercial painting services with a commitment to precision and perfection.",
    results: "Professional Services Website",
    year: "2024",
    tech: ["Vue.js", "Laravel", "MySQL"],
    link: "https://maheshpainter.in/",
    bgImage: "/Mahesh.png"
  },
  {
    id: 9,
    title: "Mosaic Nature Stays",
    subtitle: "Luxury Nature Resort",
    description:
      "Mosaic Nature Stays — a peaceful hotel retreat blending comfort, nature, and unforgettable hospitality.",
    results: "Luxury Resort UI",
    year: "2024",
    tech: ["React", "Python", "PostgreSQL"],
    link: "https://mosaicnaturestays.in/",
    bgImage: "/Mosaic.png"
  }
];

// Desktop के लिए pairs में group करें (optional)
const desktopProjectPairs = [
  { id: 1, left: allProjects[0], right: allProjects[1] },
  { id: 2, left: allProjects[2], right: allProjects[3] },
  { id: 3, left: allProjects[4], right: allProjects[5] }
];

// Single Project Card Component
const ProjectCard = ({ project, index }) => {
  // Preload important above-the-fold image
  React.useEffect(() => {
    if (index === 0) {
      const img = new Image();
      img.src = project.bgImage;
    }
  }, [project.bgImage, index]);

  return (
    <a 
      href={project.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative overflow-hidden rounded-xl h-full rounded-2xl"
      aria-label={`View ${project.title} project - ${project.subtitle}`}
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img 
          src={project.bgImage}
          alt={`${project.title} - ${project.subtitle} project showcase`}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 rounded-4xl"
          loading={index === 0 ? "eager" : "lazy"}
          width={800}
          height={400}
          decoding="async"
        />
      </div>

      {/* Content Container */}
      <div className="relative h-full p-6 flex flex-col justify-between">
        {/* Hover Arrow - Desktop only */}
        <div className="hidden lg:block absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </div>
        </div>
      </div>
    </a>
  );
};

// Desktop Pair Card Component
const DesktopProjectPair = ({ i, pair, progress, range, targetScale }) => {
  const scale = useTransform(progress, range, [1, targetScale]);

  return (
    <div className="sticky -top-[10vh] lg:-top-30 flex items-center justify-center">
      <motion.div
        style={{ scale, top: `calc(-5vh + ${i * 20 + 250}px)` }}
        className="relative -top-1/4 origin-top flex rounded-2xl 
          w-[90vw] h-[400px]           /* mobile height */
          lg:h-[400px] lg:w-[1100px]   /* desktop */
        "
        role="group"
        aria-label={`Project pair ${i + 1} of ${desktopProjectPairs.length}`}
      >
        {/* Desktop: Two cards side by side */}
        <div className="hidden lg:flex w-full h-full gap-8">
          {/* Left Card */}
          <div className="flex-1">
            <ProjectCard project={pair.left} index={i * 2} />
          </div>
          
          {/* Right Card */}
          <div className="flex-1">
            <ProjectCard project={pair.right} index={i * 2 + 1} />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const Skiper = () => {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  // Preconnect to important domains
  React.useEffect(() => {
    const preconnectLinks = [
      { rel: "preconnect", href: "https://shivgauriinfra.com" },
      { rel: "preconnect", href: "https://powercruiseholidays.netlify.app" },
      { rel: "preconnect", href: "https://venus-geyser-service.netlify.app" },
      { rel: "preconnect", href: "https://maheshpainter.in" },
      { rel: "preconnect", href: "https://mosaicnaturestays.in" },
    ];

    preconnectLinks.forEach(link => {
      const el = document.createElement("link");
      el.rel = link.rel;
      el.href = link.href;
      el.crossOrigin = "anonymous";
      document.head.appendChild(el);
    });

    return () => {
      // Cleanup if needed
    };
  }, []);

  return (
    <>
      <Helmet>
        <title>Our Projects & Portfolio | Digital Express India</title>
        <meta
          name="description"
          content="View our portfolio showcasing professional website development projects delivered by Digital Express India. See 6+ featured projects including Shiv Gauri Infra, Power Cruises, Venus Geyser Service, and more."
        />
        <meta
          name="keywords"
          content="website portfolio, web design projects, digital express india work, React development, web development projects, professional websites"
        />
        <meta property="og:title" content="Our Projects & Portfolio | Digital Express India" />
        <meta property="og:description" content="View our professional website development portfolio featuring projects for global brands" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://digitalexpressindia.com/projects" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Digital Express India Projects Portfolio" />
        <meta name="twitter:description" content="Professional website development projects showcase" />
        <link rel="canonical" href="https://digitalexpressindia.com/projects" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": "Digital Express India Projects Portfolio",
            "description": "Featured website development projects",
            "numberOfItems": allProjects.length,
            "itemListElement": allProjects.map((project, index) => ({
              "@type": "ListItem",
              "position": index + 1,
              "item": {
                "@type": "WebSite",
                "name": project.title,
                "description": project.description,
                "url": project.link,
                "keywords": project.tech.join(", "),
                "dateCreated": project.year
              }
            }))
          })}
        </script>
      </Helmet>

      <div id="work" className="bg-black rounded-3xl lg:rounded-[10vh]">
        {/* Page Header */}
        <div className="px-6 lg:px-15 mt-10 lg:mt-15 mb-10">
          <h1 className='bebas-neue-regular text-6xl lg:text-9xl big text-white py-20 font-semibold text-center lg:text-left'>
            CLIENT WORK
          </h1>
          <p className="text-gray-400 mt-2 text-lg text-center lg:text-left">
            {allProjects.length} featured projects for global brands
          </p>
        </div>

        <ReactLenis root>
          <main
            ref={container}
            className="relative flex w-full flex-col items-center justify-center 
              pb-[10vh] lg:pb-[60vh] 
              pt-[10vh] 
              -mt-[20vh] lg:-mt-[50vh]
            "
            role="main"
            aria-label="Projects portfolio showcase"
          >
            {/* MOBILE VIEW - All 6 projects in vertical stack */}
            <div className="lg:hidden w-full max-w-4xl space-y-6 px-4">
              {allProjects.map((project, index) => (
                <div 
                  key={project.id} 
                  className="h-[300px] w-full"
                  role="article"
                  aria-label={`Project: ${project.title}`}
                >
                  <ProjectCard project={project} index={index} />
                </div>
              ))}
            </div>

            {/* DESKTOP VIEW - 3 pairs of cards with sticky effect */}
            <div className="hidden lg:block" role="list" aria-label="Desktop project pairs">
              {desktopProjectPairs.map((pair, i) => {
                const targetScale = Math.max(0.5, 1 - (desktopProjectPairs.length - i - 1) * 0.1);
                return (
                  <DesktopProjectPair
                    key={pair.id}
                    i={i}
                    pair={pair}
                    progress={scrollYProgress}
                    range={[i * 0.25, 1]}
                    targetScale={targetScale}
                  />
                );
              })}
            </div>
          </main>
        </ReactLenis>
      </div>
    </>
  );
};

export default React.memo(Skiper);