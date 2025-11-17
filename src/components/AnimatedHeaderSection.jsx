import React from "react";
import { useRef } from "react";
import { AnimatedTextLines } from "../components/AnimatedTextLines";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";

gsap.registerPlugin(ScrollTrigger);
const AnimatedHeaderSection = ({
  subTitle,
  title,
  text,
  textColor,
  withScrollTrigger = false,
}) => {
  const contextRef = useRef(null);
  const headerRef = useRef(null);
  const shouldSplitTitle = title.includes(" ");
  const titleParts = shouldSplitTitle ? title.split(" ") : [title];
  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: withScrollTrigger
        ? {
            trigger: contextRef.current,
          }
        : undefined,
    });
    tl.from(contextRef.current, {
      y: "50vh",
      duration: 1,
      ease: "circ.out",
    });
    tl.from(
      headerRef.current,
      {
        opacity: 0,
        y: "200",
        duration: 1,
        ease: "circ.out",
      },
      "<+0.2"
    );
  }, []);
  return (
    <div ref={contextRef} className="px-6 sm:px-10">
      <div style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}>
        <div
          ref={headerRef}
          className="flex flex-col justify-center gap-8 pt-14 sm:gap-14"
        >
          <p
            className={`text-xs font-light tracking-[0.3rem] uppercase sm:text-sm sm:tracking-[0.5rem] ${textColor}`}
          >
            {subTitle}
          </p>
          <div>
            <h1
              className={`flex flex-col uppercase banner-text-responsive sm:gap-6 md:block md:leading-[1.15] ${textColor}`}
            >
              {titleParts.map((part, index) => (
                <span key={index} className="md:inline-block md:mr-10">{part}</span>
              ))}
            </h1>
          </div>
        </div>
      </div>
      <div className={`relative ${textColor}`}>
        <div className="absolute inset-x-0 border-t-2" />
        <div className="py-8 sm:py-12 text-end">
          <AnimatedTextLines
            text={text}
            className={`font-light uppercase value-text-responsive ${textColor}`}
          />
        </div>
      </div>
    </div>
  );
};

export default AnimatedHeaderSection;