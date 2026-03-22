import { useGSAP } from "@gsap/react";
import AnimatedHeaderSection from "../components/AnimatedHeaderSection";
import Marquee from "../components/Marquee";
import { socials } from "../constants";
import gsap from "gsap";
import { Icon } from "@iconify/react";

const Contact = () => {
  const text = `Got a question, how or project Idea?
    I'd love to hear from you and discus further!`;
  const items = [
    "just imagine, I code",
    "just imagine, I code",
    "just imagine, I code",
    "just imagine, I code",
    "just imagine, I code",
  ];
  useGSAP(() => {
    gsap.from(".social-link", {
      y: 100,
      opacity: 0,
      delay: 0.5,
      duration: 1,
      stagger: 0.3,
      ease: "back.out",
      scrollTrigger: {
        trigger: ".social-link",
      },
    });
  }, []);
  return (
    <section
      id="contact"
      className="flex flex-col justify-between min-h-screen bg-black"
    >
      <div>
        <AnimatedHeaderSection
          subTitle={"You Dream It, I Code it"}
          title={"Contact"}
          text={text}
          textColor={"text-white"}
          withScrollTrigger={true}
        />
        <div className="flex px-6 font-light text-white uppercase text-[22px] leading-tight sm:px-10 sm:text-[26px] lg:text-[32px] mb-10">
          <div className="flex flex-col w-full gap-8">
            <div className="social-link">
              <h2>E-mail</h2>
              <div className="w-full h-px my-2 bg-white/30" />
              <p className="text-lg tracking-wider lowercase sm:text-xl md:text-2xl lg:text-3xl break-all">
                Luchezar.dd@protonmail.com
              </p>
            </div>
            <div className="social-link">
              <h2>Phone</h2>
              <div className="w-full h-px my-2 bg-white/30" />
              <p className="text-lg lowercase sm:text-xl md:text-2xl lg:text-3xl">
                +45 55 21 92 82
              </p>
            </div>
            <div className="social-link">
              <h2>Social Media</h2>
              <div className="w-full h-px my-2 bg-white/30" />
              <div className="flex flex-wrap gap-2 text-[11px] sm:text-xs md:text-sm">
                {socials.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className="leading-loose tracking-widest uppercase hover:text-white/80 transition-colors duration-200"
                  >
                    {"{ "}
                    {social.name}
                    {" }"}
                  </a>
                ))}
              </div>
            </div>
            <div className="social-link">
              <h2>RESUME</h2>
              <div className="w-full h-px my-2 bg-white/30" />
              <a
                href="/CV/WorkingCV.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between py-2 cursor-pointer hover:text-white transition-colors duration-300"
              >
                <div className="flex items-center gap-4">
                  <Icon
                    icon="lucide:file-text"
                    className="size-6 text-white/50 group-hover:text-white transition-colors duration-300"
                  />
                  <span className="text-lg tracking-wider uppercase sm:text-xl md:text-2xl lg:text-3xl">
                    Download CV
                  </span>
                </div>
                <Icon
                  icon="lucide:arrow-up-right"
                  className="size-6 text-white/30 group-hover:text-white transition-colors duration-300"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
      <Marquee items={items} className="text-white bg-transparent" />
    </section>
  );
};

export default Contact;
