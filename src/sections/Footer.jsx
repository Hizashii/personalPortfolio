import { Icon } from "@iconify/react";
import { socials } from "../constants";
import { Link } from "react-scroll";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { label: "Home", to: "home" },
    { label: "Services", to: "services" },
    { label: "Projects", to: "projects" },
    { label: "About", to: "about" },
    { label: "Contact", to: "contact" },
  ];

  return (
    <footer className="px-6 sm:px-10 py-10 sm:py-14 bg-black border-t border-white/10">
      <div className="flex flex-col lg:flex-row justify-between gap-10 lg:gap-20 mb-10">
        {/* Brand */}
        <div className="max-w-md">
          <h3 className="text-lg sm:text-xl font-light text-white uppercase tracking-wider mb-2">
            Luchezar Dimchov
          </h3>
          <p className="text-xs sm:text-sm font-light text-white/30 leading-relaxed">
            Full-stack developer & automation specialist. I build web tools that
            save teams hours — with fixed pricing, clear scope, and predictable
            delivery.
          </p>
        </div>

        {/* Navigation */}
        <div className="flex flex-wrap gap-x-8 gap-y-3">
          {footerLinks.map((link, index) => (
            <Link
              key={index}
              to={link.to}
              smooth
              offset={0}
              duration={2000}
              className="text-xs font-light text-white/30 uppercase tracking-wider cursor-pointer hover:text-white transition-colors duration-200"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Social */}
        <div className="flex gap-x-2">
          {socials.map((social, index) => (
            <a
              key={index}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-light text-white/30 leading-loose tracking-widest uppercase hover:text-white transition-colors duration-200"
            >
              {"{"}
              {social.name}
              {"}"}
            </a>
          ))}
        </div>
      </div>

      {/* Résumé */}
      <div className="flex items-center justify-between gap-4 mb-10 px-5 py-4 border border-white/10 rounded-lg">
        <div>
          <p className="text-xs sm:text-sm font-light text-white uppercase tracking-wider">
            Résumé / CV
          </p>
          <p className="text-[11px] font-light text-white/30 mt-1">
            View my full background, experience & skills
          </p>
        </div>
        <a
          href="/CV/WorkingCV.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 text-xs font-light text-white uppercase tracking-wider border border-white/20 rounded hover:bg-white hover:text-black transition-colors duration-300 whitespace-nowrap"
        >
          Open PDF
          <Icon icon="lucide:arrow-up-right" className="size-3.5" />
        </a>
      </div>

      {/* Bottom */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-8 border-t border-white/5">
        <p className="text-[10px] font-light text-white/15 uppercase tracking-wider">
          &copy; {currentYear} Luchezar Dimchov. All rights reserved.
        </p>
        <p className="text-[10px] font-light text-white/15 uppercase tracking-wider">
          Built with React, Three.js & GSAP
        </p>
      </div>
    </footer>
  );
};

export default Footer;
