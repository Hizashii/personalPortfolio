import { useRef } from "react";
import AnimatedHeaderSection from "../components/AnimatedHeaderSection";
import { AnimatedTextLines } from "../components/AnimatedTextLines";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const text = `I build fast, clean digital experiences
From idea to deployed product.`;

  const imgRef = useRef(null);

  useGSAP(() => {
    gsap.to("#about", {
      scale: 0.95,
      scrollTrigger: {
        trigger: "#about",
        start: "bottom 80%",
        end: "bottom 20%",
        scrub: true,
        markers: false,
      },
      ease: "power1.inOut",
    });

    gsap.set(imgRef.current, {
      clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0% 100%)",
    });
    gsap.to(imgRef.current, {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      duration: 2,
      ease: "power4.out",
      scrollTrigger: { trigger: imgRef.current },
    });
  });

  return (
    <section id="about" className="min-h-screen bg-black rounded-b-4xl">
      <AnimatedHeaderSection
        subTitle={"Code with purpose / Built with intent"}
        title={"About"}
        text={text}
        textColor={"text-white"}
        withScrollTrigger={true}
      />
      <div className="flex flex-col items-center justify-between gap-10 px-6 pb-12 text-lg font-light tracking-wide sm:gap-16 sm:px-10 sm:text-xl lg:flex-row md:text-2xl lg:text-3xl text-white/60">
        <img src="/images/me.png" alt="Profile picture of the developer" />
        <div className="w-full space-y-10">
          <AnimatedTextLines
            text={`I'm a full-stack developer who enjoys building things that feel good to use. ⚡
Fast apps, clean UI, smooth interactions basically the stuff that makes a product enjoyable, not just functional.`}
            className="leading-relaxed"
          />

          <AnimatedTextLines
            text={`The torii gate ⛩️ on this site is intentional. Japan has been a big part of my life asI speak Japanese, and the culture influences how I think about design and code.`}
            className="leading-relaxed"
          />

          <AnimatedTextLines
            text={`Outside of dev work, I'm usually 🎮 gaming, 🏋️‍♂️ lifting, or hacking on some side experiment that spiraled way beyond what I planned. `}
            className="leading-relaxed"
          />
        </div>
      </div>
    </section>
  );
};

export default About;
