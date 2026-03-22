import AnimatedHeaderSection from "../components/AnimatedHeaderSection";
import { AnimatedTextLines } from "../components/AnimatedTextLines";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const text = `I build fast, clean digital experiences
From idea to deployed product.`;

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
      <div className="px-6 pb-12 sm:px-10 text-lg font-light tracking-wide sm:text-xl md:text-2xl lg:text-3xl text-white/60 max-w-5xl space-y-10">
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
    </section>
  );
};

export default About;
