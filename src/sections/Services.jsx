import { useRef } from "react";
import AnimatedHeaderSection from "../components/AnimatedHeaderSection";
import { servicesData } from "../constants";
import { useMediaQuery } from "react-responsive";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";

gsap.registerPlugin(ScrollTrigger);

const Services = () => {
  const text = `I build secure, high-performance full-stack apps
    with smooth UX to drive growth 
    not headaches.`;
  const wrapperRef = useRef(null);
  const isDesktop = useMediaQuery({ minWidth: "48rem" }); 
  
  useGSAP(() => {
    if (!wrapperRef.current) return;

    const sections = wrapperRef.current.querySelectorAll(".stack_section");
    if (sections.length === 0) return;

    const offset = 100;
    const titleGap = 0;

    if (!isDesktop) {
      gsap.killTweensOf(sections);
      gsap.set(sections, { clearProps: "all" });
      gsap.from(sections, {
        opacity: 0,
        y: 40,
        duration: 0.8,
        stagger: 0.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: "top 85%",
        },
      });
      return;
    }

    const time = 1;

    const finalPositions = Array.from(sections).map((target, index) => {
      const title = target.querySelector("h2");
      if (!title) return offset * index;
      const titleBottom = title.offsetTop + title.offsetHeight;
      return titleBottom + titleGap + offset * index;
    });

    gsap.set(sections, {
      y: (index) => finalPositions[index],
      transformOrigin: "center top",
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: wrapperRef.current,
        start: "top top",
        end: () => `+=${wrapperRef.current.offsetHeight}`,
        scrub: 5,
        pin: true,
        markers: false,
      },
    });

    tl.from(sections, {
      y: (index) => window.innerHeight + offset * index,
      duration: time,
      stagger: time,
      ease: "none",
    });
  }, [isDesktop]);
  return (
    <section id="services" className="min-h-screen bg-black rounded-t-4xl">
      <AnimatedHeaderSection
        subTitle={"Behind the scene, Beyond the screen"}
        title={"Service"}
        text={text}
        textColor={"text-white"}
        withScrollTrigger={true}
      />
      <div ref={wrapperRef} className="stack_wrapper">
        <ul className="stack_items">
          {servicesData.map((service, index) => (
            <li
              key={index}
              className="stack_section px-6 pt-6 pb-10 text-white bg-black border-t-2 border-white/30 sm:px-10"
            >
          <div className="font-light">
            <div className="flex flex-col gap-5">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl">{service.title}</h2>
              <p className="text-base leading-relaxed tracking-wide sm:text-lg lg:text-2xl text-white/60 text-pretty">
                {service.description}
              </p>
              <div className="flex flex-col gap-2 text-lg sm:gap-3 sm:text-xl lg:text-3xl text-white/80">
                {service.items.map((item, itemIndex) => (
                  <div key={`item-${index}-${itemIndex}`}>
                    <h3 className="flex">
                      <span className="mr-6 text-sm text-white/40 sm:mr-12 sm:text-base">
                        0{itemIndex + 1}
                      </span>
                      {item.title}
                    </h3>
                    {itemIndex < service.items.length - 1 && (
                      <div className="w-full h-px my-2 bg-white/30" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Services;