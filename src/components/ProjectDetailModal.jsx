import { Icon } from "@iconify/react";

const ProjectDetailModal = ({ project, onClose }) => {
  if (!project) return null;

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Project details"
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl bg-white shadow-2xl border-2 border-black"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/10 hover:bg-black/20 transition-colors"
          aria-label="Close"
        >
          <Icon icon="lucide:x" className="size-5 text-black" />
        </button>

        {/* Image */}
        <div className="relative h-48 sm:h-56 overflow-hidden rounded-t-lg">
          <img
            src={project.bgImage || project.image}
            alt=""
            className="object-cover w-full h-full brightness-75"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              src={project.image}
              alt=""
              className="max-h-[80%] max-w-[85%] object-contain drop-shadow-lg"
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8">
          <h2 className="text-2xl sm:text-3xl font-medium text-black mb-2">
            {project.name}
          </h2>
          <p className="text-black/80 text-sm sm:text-base leading-relaxed mb-6">
            {project.description}
          </p>

          <div className="mb-6">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-black/60 mb-3">
              Tech stack
            </h3>
            <div className="flex flex-wrap gap-2">
              {project.frameworks.map((f) => (
                <span
                  key={f.id}
                  className="px-3 py-1.5 text-sm bg-black/10 text-black rounded-full"
                >
                  {f.name}
                </span>
              ))}
            </div>
          </div>

          {project.href && (
            <a
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 bg-black text-white rounded-lg hover:bg-black/90 transition-colors text-sm font-medium"
            >
              Open live site
              <Icon icon="lucide:arrow-up-right" className="size-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailModal;
