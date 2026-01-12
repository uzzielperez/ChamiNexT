import React, { useEffect, useState } from 'react'
import './styles.css'
import './motion-utils.css'
import useSpring from './useSpring'

export default function App() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50)
    return () => clearTimeout(t)
  }, [])

  return (
    <main className={`hero ${mounted ? 'mounted' : ''}`}>
      <div className="hero-inner">
        <h1 className="fade-up">Vibe — Interactive Visuals</h1>
        <p className="fade-up delay-1">Learn to build expressive, performant UI with motion and shaders.</p>
        <AnimatedCTA className="fade-up delay-2">Start the Sprint</AnimatedCTA>

        <section className="card-grid" aria-label="Example cards">
          {['Design', 'Motion', 'Shaders'].map((t, i) => (
            <article key={t} className="card stagger-child" style={{ '--i': i }}>
              <h3>{t}</h3>
              <p>Short example of {t.toLowerCase()} demo.</p>
            </article>
          ))}
        </section>
      </div>
    </main>
  )
}

function AnimatedCTA({ children, className }) {
  const [hover, setHover] = useState(false)
  const target = hover ? 1.06 : 1
  const scale = useSpring(target, { stiffness: 200, damping: 20 })

  return (
    <a
      className={className}
      href="#"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ transform: `scale(${scale})`, display: 'inline-block' }}
    >
      {children}
    </a>
  )
}
