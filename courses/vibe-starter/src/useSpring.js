import { useRef, useState, useEffect } from 'react'

// Simple numeric spring hook: useSpring(target, config)
// Returns a single numeric value that smoothly springs to `target`.
export default function useSpring(target, config = {}) {
  const { stiffness = 170, damping = 26, mass = 1 } = config
  const ref = useRef({ x: target, v: 0, target, raf: null })
  const [value, setValue] = useState(target)

  useEffect(() => {
    ref.current.target = target
    if (ref.current.raf) return

    let last = performance.now()

    function step(now) {
      const dt = Math.min(32, now - last) / 1000 // seconds, clamp
      last = now

      const state = ref.current
      const x = state.x
      const v = state.v
      const to = state.target

      const k = stiffness
      const c = damping

      // spring force and damping
      const F = -k * (x - to)
      const a = F / mass
      const nv = v + a * dt - (c / mass) * v * dt
      const nx = x + nv * dt

      state.v = nv
      state.x = nx

      // set value for React
      setValue(nx)

      // stop when near target and velocity near zero
      if (Math.abs(nx - to) < 0.0005 && Math.abs(nv) < 0.0005) {
        state.x = to
        state.v = 0
        setValue(to)
        state.raf = null
        return
      }

      state.raf = requestAnimationFrame(step)
    }

    ref.current.raf = requestAnimationFrame(step)

    return () => {
      if (ref.current.raf) cancelAnimationFrame(ref.current.raf)
      ref.current.raf = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stiffness, damping, mass, target])

  return value
}
