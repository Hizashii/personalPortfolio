import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";

gsap.registerPlugin(ScrollTrigger);

const ServiceSummary = () => {
  useGSAP(() => {
    const mm = gsap.matchMedia();
    const sectionSelector = ".service-summary";
    const ids = [
      "#title-service-1",
      "#title-service-2",
      "#title-service-3",
      "#title-service-4",
    ];

    // Only animate on larger screens
    mm.add("(min-width: 900px)", () => {
      const makeScroll = (id, startXPercent) => {
        // Set initial position (offset from center)
        gsap.set(id, { xPercent: startXPercent });
        
        // Animate to center (xPercent: 0)
        gsap.to(id, {
          xPercent: 0,
          scrollTrigger: {
            trigger: id,
            start: "top 80%",
            end: "top 20%",
            scrub: 1, // smooth scrubbing
          },
          ease: "none",
        });
      };

      // Start from left (negative) or right (positive), animate to center
      makeScroll("#title-service-1", -15); // starts left, moves to center
      makeScroll("#title-service-2", 20); // starts right, moves to center
      makeScroll("#title-service-3", -12); // starts left, moves to center
      makeScroll("#title-service-4", 18); // starts right, moves to center
    });

    // Simpler fade-in for smaller screens
    mm.add("(max-width: 899px)", () => {
      const elements = ids
        .map((id) => document.querySelector(id))
        .filter(Boolean);

      gsap.from(elements, {
        opacity: 0,
        y: 40,
        duration: 0.8,
        stagger: 0.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionSelector,
          start: "top 80%",
        },
      });
    });

    return () => mm.revert();
  });

  return (
    <section className="service-summary mt-16 overflow-hidden font-light leading-snug text-center contact-text-responsive space-y-6 sm:space-y-10 px-6 sm:px-10">
      <div id="title-service-1" className="tracking-tight">
        <p>Architecture</p>
      </div>

      <div
        id="title-service-2"
        className="flex flex-wrap items-center justify-center gap-2 sm:gap-3"
      >
        <p className="font-normal">Development</p>
        <div className="w-10 h-1 md:w-24 bg-gold" />
        <p>Deployment</p>
      </div>

      <div
        id="title-service-3"
        className="flex flex-wrap items-center justify-center gap-2 sm:gap-3"
      >
        <p>APIs</p>
        <div className="w-10 h-1 md:w-20 bg-gold" />
        <p className="italic">Frontends</p>
        <div className="w-10 h-1 md:w-20 bg-gold" />
        <p>Scalability</p>
      </div>

      <div id="title-service-4" className="tracking-tight">
        <p>Databases</p>
      </div>
    </section>
  );
};

export default ServiceSummary;
