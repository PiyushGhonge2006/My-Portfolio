import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const trailRefs = useRef([])

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches
    const small = window.matchMedia('(max-width: 1023px)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || small || reduced) return

    const dot = dotRef.current
    const ring = ringRef.current
    const trails = trailRefs.current
    if (!dot || !ring || trails.length !== 3) return

    let visible = false
    let dx = -100
    let dy = -100
    let rx = -100
    let ry = -100
    const tx = [-100, -100, -100]
    const ty = [-100, -100, -100]
    const LERP = [0.3, 0.2, 0.12]
    const SIZE = [4, 3, 2]
    let raf = 0

    const onMove = (e) => {
      if (!visible) {
        visible = true
        document.body.classList.add('cursor-visible')
        dx = e.clientX
        dy = e.clientY
        rx = dx
        ry = dy
        for (let i = 0; i < 3; i++) {
          tx[i] = dx
          ty[i] = dy
        }
      }
      dx = e.clientX
      dy = e.clientY
      document.body.classList.remove('cursor-timeout')
    }

    const loop = () => {
      dot.style.transform = `translate(${dx - 3}px, ${dy - 3}px)`
      rx += (dx - rx) * 0.16
      ry += (dy - ry) * 0.16
      ring.style.transform = `translate(${rx - 17}px, ${ry - 17}px)`
      for (let i = 0; i < 3; i++) {
        const prevX = i === 0 ? rx : tx[i - 1]
        const prevY = i === 0 ? ry : ty[i - 1]
        tx[i] += (prevX - tx[i]) * LERP[i]
        ty[i] += (prevY - ty[i]) * LERP[i]
        const size = SIZE[i]
        trails[i].style.transform = `translate(${tx[i] - size / 2}px, ${ty[i] - size / 2}px)`
      }
      raf = requestAnimationFrame(loop)
    }

    const onOver = (e) => {
      const interactive = e.target.closest('a, button, [role="button"], .card-hover, .magnetic')
      document.body.classList.toggle('cursor-active', Boolean(interactive))
    }

    const onLeave = () => {
      visible = false
      document.body.classList.add('cursor-timeout')
      document.body.classList.remove('cursor-visible', 'cursor-active')
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mouseover', onOver, { passive: true })
    document.documentElement.addEventListener('mouseleave', onLeave)
    raf = requestAnimationFrame(loop)

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', onOver)
      document.documentElement.removeEventListener('mouseleave', onLeave)
      cancelAnimationFrame(raf)
      document.body.classList.remove('cursor-visible', 'cursor-active', 'cursor-timeout')
    }
  }, [])

  const setTrailRef = (i) => (el) => {
    trailRefs.current[i] = el
  }

  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
      <div ref={setTrailRef(0)} className="cursor-trail" aria-hidden="true" />
      <div ref={setTrailRef(1)} className="cursor-trail t-2" aria-hidden="true" />
      <div ref={setTrailRef(2)} className="cursor-trail t-3" aria-hidden="true" />
    </>
  )
}