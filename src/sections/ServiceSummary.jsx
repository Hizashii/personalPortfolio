import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";

gsap.registerPlugin(ScrollTrigger);

const ServiceSummary = () => {
  useGSAP(() => {
    const mm = gsap.matchMedia();

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

    return () => mm.revert();
  });

  return (
    <section className="mt-20 overflow-hidden font-light leading-snug text-center mb-42 contact-text-responsive">
      <div id="title-service-1">
        <p>Architecture</p>
      </div>

      <div
        id="title-service-2"
        className="flex items-center justify-center gap-3"
      >
        <p className="font-normal">Development</p>
        <div className="w-10 h-1 md:w-32 bg-gold" />
        <p>Deployment</p>
      </div>

      <div
        id="title-service-3"
        className="flex items-center justify-center gap-3"
      >
        <p>APIs</p>
        <div className="w-10 h-1 md:w-32 bg-gold" />
        <p className="italic">Frontends</p>
        <div className="w-10 h-1 md:w-32 bg-gold" />
        <p>Scalability</p>
      </div>

      <div id="title-service-4">
        <p>Databases</p>
      </div>
    </section>
  );
};

export default ServiceSummary;
