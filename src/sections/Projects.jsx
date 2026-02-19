import { Icon } from "@iconify/react";
import AnimatedHeaderSection from "../components/AnimatedHeaderSection";
import ProjectDetailModal from "../components/ProjectDetailModal";
import { projects } from "../constants";
import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const Projects = () => {
  const overlayRefs = useRef([]);
  const previewRef = useRef(null);

  const [currentIndex, setCurrentIndex] = useState(null);
  const [detailProject, setDetailProject] = useState(null);
  const text = `Featured projects that have been meticulously
    crafted with passion to drive
    results and impact.`;

  const mouse = useRef({ x: 0, y: 0 });
  const moveX = useRef(null);
  const moveY = useRef(null);

  useGSAP(() => {
    moveX.current = gsap.quickTo(previewRef.current, "x", {
      duration: 1.5,
      ease: "power3.out",
    });
    moveY.current = gsap.quickTo(previewRef.current, "y", {
      duration: 2,
      ease: "power3.out",
    });

    gsap.from("#project", {
      y: 100,
      opacity: 0,
      delay: 0.5,
      duration: 1,
      stagger: 0.3,
      ease: "back.out",
      scrollTrigger: {
        trigger: "#project",
      },
    });
  }, []);

  const handleMouseEnter = (index) => {
    if (window.innerWidth < 768) return;
    setCurrentIndex(index);

    const el = overlayRefs.current[index];
    if (!el) return;

    gsap.killTweensOf(el);
    gsap.fromTo(
      el,
      {
        clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)",
      },
      {
        clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)",
        duration: 0.15,
        ease: "power2.out",
      }
    );

    gsap.to(previewRef.current, {
      opacity: 1,
      scale: 1,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = (index) => {
    if (window.innerWidth < 768) return;
    setCurrentIndex(null);

    const el = overlayRefs.current[index];
    if (!el) return;

    gsap.killTweensOf(el);
    gsap.to(el, {
      clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)",
      duration: 0.2,
      ease: "power2.in",
    });

    gsap.to(previewRef.current, {
      opacity: 0,
      scale: 0.95,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const handleMouseMove = (e) => {
    if (window.innerWidth < 768) return;
    mouse.current.x = e.clientX + 24;
    mouse.current.y = e.clientY + 24;
    moveX.current(mouse.current.x);
    moveY.current(mouse.current.y);
  };

  const handleProjectClick = (project) => {
    if (project.href) {
      window.open(project.href, "_blank", "noopener,noreferrer");
    }
  };

  const handleProjectContextMenu = (e, project) => {
    e.preventDefault();
    setDetailProject(project);
  };

  return (
    <section id="projects" className="flex flex-col min-h-screen pt-20 pb-12">
      <AnimatedHeaderSection
        subTitle={"Logic meets Aesthetics, Seamlessly"}
        title={"Projects"}
        text={text}
        textColor={"text-black"}
        withScrollTrigger={true}
      />
      <p className="px-6 sm:px-10 mt-2 text-xs text-black/50 flex items-center gap-1.5">
        <Icon icon="lucide:mouse-pointer-click" className="size-3.5" />
        Left-click to visit · Right-click for details
      </p>
      <div
        className="relative flex flex-col font-light px-6 sm:px-10"
        onMouseMove={handleMouseMove}
      >
        {projects.map((project, index) => (
          <div
            key={project.id}
            id="project"
            className="relative flex flex-col gap-1 py-5 cursor-pointer group md:gap-0"
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={() => handleMouseLeave(index)}
            onClick={() => handleProjectClick(project)}
            onContextMenu={(e) => handleProjectContextMenu(e, project)}
          >
            {/* overlay */}
            <div
              ref={(el) => {
                overlayRefs.current[index] = el;
              }}
              className="absolute inset-0 hidden md:block duration-200 bg-black -z-10 clip-path"
            />

            {/* title */}
            <div className="flex justify-between px-2 text-black transition-all duration-500 sm:px-0 md:group-hover:px-4 md:group-hover:text-white">
              <h2 className="lg:text-[32px] text-[26px] leading-none">
                {project.name}
              </h2>
              <Icon icon="lucide:arrow-up-right" className="md:size-6 size-5" />
            </div>
            {/* divider */}
            <div className="w-full h-0.5 bg-black/80" />
            {/* framework */}
            <div className="flex px-2 text-xs leading-loose uppercase transition-all duration-500 sm:px-0 md:text-sm gap-x-5 md:group-hover:px-4">
              {project.frameworks.map((framework) => (
                <p
                  key={framework.id}
                  className="text-black transition-colors duration-500 md:group-hover:text-white"
                >
                  {framework.name}
                </p>
              ))}
            </div>
            {/* mobile preview image - consistent dark background for all */}
            <div className="relative flex items-center justify-center md:hidden h-[320px] sm:h-[400px] rounded-md bg-neutral-900 overflow-hidden">
              <img
                src={project.image}
                alt={`${project.name}-image`}
                loading="lazy"
                decoding="async"
                className="object-contain max-h-full max-w-full px-6 py-4 rounded-xl"
              />
            </div>

          </div>
        ))}
        {/* desktop Flaoting preview image */}
<div
  ref={previewRef}
  className="fixed -top-2/6 left-0 z-50 overflow-hidden border-8 border-black pointer-events-none w-[960px] h-[650px] md:block hidden opacity-0"
>
  {currentIndex !== null && (
    <img
      src={projects[currentIndex].image}
      alt="preview"
      loading="eager"
      decoding="async"
      className="object-cover w-full h-full"
    />
  )}
</div>
</div>
<div
  className="relative flex flex-col gap-1 py-5 cursor-default md:gap-0 px-6 sm:px-10"
>
  {/* title */}
  <div className="flex justify-between text-black/60">
    <h2 className="lg:text-[32px] text-[26px] leading-none">
      More projects coming soon
    </h2>
  </div>

  {/* divider */}
  <div className="w-full h-0.5 bg-black/20" />

  {/* small text */}
  <div className="flex text-xs md:text-sm uppercase gap-x-5 text-black/40">
    <p>Currently crafting new case studies</p>
  </div>
</div>

      {detailProject && (
        <ProjectDetailModal
          project={detailProject}
          onClose={() => setDetailProject(null)}
        />
      )}
    </section>
  );
};

export default Projects;
