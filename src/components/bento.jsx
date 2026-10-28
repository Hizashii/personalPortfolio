import { useEffect, useRef } from 'react'
import { Link } from '../router'

const PROJECTS = [
  { number: '01', name: 'APPLYER', to: '/applyer', description: 'Job discovery and application platform.', tags: ['NEXT.JS', 'SUPABASE', 'AI'], image: '/assets/applyer/applyer-jobs.webp', className: 'applyer' },
  { number: '02', name: 'SpisNem', to: '/spisnem', description: 'Mobile ordering and queue management for restaurants.', tags: ['REACT', 'NODE.JS', 'MOBILE'], image: '/assets/spisnem/spisnem-discover.webp', className: 'spisnem' },
  { number: '03', name: 'CreativeHub', to: '/lab', description: 'Content creation and collaboration platform.', tags: ['REACT', 'EXPRESS', 'MONGODB'], className: 'creative' },
]

function ProjectCard({ project }) {
  return <Link className={`jp-bento-card jp-bento-card--${project.className}`} to={project.to} aria-label={`${project.name}: ${project.description}`}>
    <span className="jp-bento-number">{project.number}</span>
    <span className="jp-bento-arrow" aria-hidden="true">&#8599;</span>
    <h3>{project.name}</h3>
    <p>{project.description}</p>
    <span className="jp-bento-tags">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</span>
    {project.image ? <img className="jp-bento-image" src={project.image} alt="" loading="lazy" decoding="async" /> : <span className="jp-bento-creative-art" aria-hidden="true"><span className="jp-bento-play">&#9654;</span><span className="jp-bento-artbar" /></span>}
  </Link>
}

export default function Bento() {
  const trayRef = useRef(null)
  const sectionRef = useRef(null)

  useEffect(() => {
    const tray = trayRef.current
    const section = sectionRef.current
    if (!tray || !section || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    let raf = 0
    let landed = false
    const update = () => {
      raf = 0
      const viewport = window.innerHeight
      const top = section.getBoundingClientRect().top
      const progress = Math.max(0, Math.min(1, (viewport * 1.04 - top) / (viewport * 0.68)))
      const ease = progress * progress * (3 - 2 * progress)
      tray.style.setProperty('--bento-rise', `${Math.round((1 - ease) * 260)}px`)
      tray.style.setProperty('--bento-scale', (0.9 + ease * 0.1).toFixed(4))
      tray.style.setProperty('--bento-tilt', `${((1 - ease) * 8).toFixed(2)}deg`)
      if (progress === 1 && !landed) {
        landed = true
        tray.classList.add('is-landed')
      }
    }
    const schedule = () => { if (!raf) raf = requestAnimationFrame(update) }
    schedule()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      cancelAnimationFrame(raf)
    }
  }, [])

  return <section className="jp-bento-scene" id="work" ref={sectionRef} aria-labelledby="jp-work-title">
    <div className="jp-bento-scene-shadow" aria-hidden="true" />
    <div className="jp-bento-heading">
      <span className="jp-bento-side">03 <i /> PRODUCTS<br />IDEAS<br />EXPERIENCES</span>
      <div className="jp-bento-heading-main"><span className="jp-bento-kanji" aria-hidden="true">&#20316;</span><h2 id="jp-work-title">SELECTED WORK</h2><i /><p>A mix of products, experiments and ideas &mdash;<br /> built with code, design and curiosity.</p></div>
      <Link to="/work" className="jp-bento-view">VIEW ALL<br />PROJECTS <span aria-hidden="true">&#8599;</span></Link>
    </div>
    <div className="jp-bento-tray" ref={trayRef}><div className="jp-bento-tray-inner">{PROJECTS.map(project => <ProjectCard key={project.number} project={project} />)}</div></div>
    <span className="jp-bento-next" aria-hidden="true">&#8595;</span>
  </section>
}
