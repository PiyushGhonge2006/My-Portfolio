import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

const BLOCKS = [
  { id: 1, className: 'cg-block cg-block-a cg-l1', style: { top: '12%', left: '-6%', width: 220, height: 140, borderRadius: 18 } },
  { id: 2, className: 'cg-block cg-block-b cg-l2', style: { top: '58%', right: '-8%', width: 280, height: 170, borderRadius: 22 } },
  { id: 3, className: 'cg-block cg-block-c cg-l3', style: { top: '24%', right: '16%', width: 140, height: 200, borderRadius: 14 } },
  { id: 4, className: 'cg-block cg-block-b cg-l1', style: { bottom: '10%', left: '24%', width: 180, height: 120, borderRadius: 16 } },
  { id: 5, className: 'cg-block cg-block-a cg-l2', style: { top: '66%', left: '-4%', width: 150, height: 220, borderRadius: 18 } },
]

const MOBILE_BLOCKS = [BLOCKS[0], BLOCKS[1]]

const SHAPES = [
  { id: 's1', kind: 'square', cls: 'fg-float-a fg-shape', style: { top: '16%', left: '9%', width: 26, height: 26, borderRadius: 7, rotate: 45 } },
  { id: 's2', kind: 'rect', cls: 'fg-float-b fg-shape', style: { top: '74%', left: '16%', width: 48, height: 32, borderRadius: 10 } },
  { id: 's3', kind: 'frame', cls: 'fg-float-c fg-shape', style: { top: '30%', right: '9%', width: 34, height: 34, borderRadius: 8 } },
  { id: 's4', kind: 'node', cls: 'fg-float-d fg-shape', style: { top: '62%', right: '12%', width: 12, height: 12, borderRadius: 9999 } },
  { id: 's5', kind: 'bracket', cls: 'fg-float-e fg-shape', style: { top: '20%', left: '26%', fontSize: 26 } },
  { id: 's6', kind: 'plus', cls: 'fg-float-b fg-shape', style: { bottom: '20%', left: '8%', width: 22, height: 22 } },
  { id: 's7', kind: 'circle', cls: 'fg-float-c fg-shape', style: { top: '12%', right: '32%', width: 18, height: 18, borderRadius: 9999 } },
]

const MOBILE_SHAPES = SHAPES.filter((s) => ['s1', 's2', 's3', 's4'].includes(s.id))

const CELLS = [
  { top: 14, left: 14, dur: 9, delay: 0 },
  { top: 14, left: 30, dur: 12, delay: 3.2 },
  { top: 14, left: 62, dur: 10, delay: 5.1 },
  { top: 14, left: 78, dur: 13, delay: 1.4 },
  { top: 38, left: 20, dur: 11, delay: 6.2 },
  { top: 38, left: 46, dur: 9, delay: 2.3 },
  { top: 38, left: 70, dur: 12, delay: 7.8 },
  { top: 62, left: 10, dur: 13, delay: 4.5 },
  { top: 62, left: 34, dur: 10, delay: 0.7 },
  { top: 62, left: 58, dur: 11, delay: 5.9 },
  { top: 62, left: 82, dur: 9, delay: 3.8 },
  { top: 86, left: 26, dur: 12, delay: 8.4 },
  { top: 86, left: 52, dur: 10, delay: 1.9 },
  { top: 86, left: 72, dur: 13, delay: 6.6 },
]

const MOBILE_CELLS = CELLS.slice(0, 7)

function ShapeNode({ shape, border, fill }) {
  return (
    <div className={shape.cls} style={{ position: 'absolute', ...shape.style }}>
      {shape.kind === 'bracket' ? (
        <span className="font-mono font-bold" style={{ color: border, opacity: 0.5 }}>
          {'</>'}
        </span>
      ) : shape.kind === 'plus' ? (
        <span className="block relative w-full h-full">
          <span className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px" style={{ background: border, opacity: 0.6 }} />
          <span className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-px" style={{ background: border, opacity: 0.6 }} />
        </span>
      ) : (
        <span
          className="block w-full h-full"
          style={{
            border: shape.kind === 'frame' || shape.kind === 'rectangle' || shape.kind === 'square' ? `1px solid ${border}` : 'none',
            borderRadius: shape.style.borderRadius,
            background: shape.kind === 'node' || shape.kind === 'circle' ? fill : 'transparent',
            opacity: 0.55,
          }}
        />
      )}
    </div>
  )
}

export default function CinematicGrid({ show = true }) {
  const rootRef = useRef(null)
  const lightRef = useRef(null)
  const [mobile, setMobile] = useState(() => window.matchMedia('(max-width: 640px)').matches)

  useEffect(() => {
    const mqMobile = window.matchMedia('(max-width: 640px)')
    const onChange = (e) => setMobile(e.matches)
    if (mqMobile.addEventListener) mqMobile.addEventListener('change', onChange)
    else mqMobile.addListener(onChange)
    return () => {
      if (mqMobile.removeEventListener) mqMobile.removeEventListener('change', onChange)
      else mqMobile.removeListener(onChange)
    }
  }, [])

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const fine = window.matchMedia('(pointer: fine)').matches
    if (reduced || !fine || mobile) return

    let frame = 0
    let tx = 0
    let ty = 0
    let cx = 0
    let cy = 0
    let cgx = 0
    let cgy = 0
    let lx = 0
    let ly = 0

    const onMove = (e) => {
      const w = window.innerWidth
      const h = window.innerHeight
      cx = e.clientX / w - 0.5
      cy = e.clientY / h - 0.5
    }

    const loop = () => {
      tx += (cx - tx) * 0.05
      ty += (cy - ty) * 0.05
      cgx += (cx - cgx) * 0.04
      cgy += (cy - cgy) * 0.04
      lx += (cx - lx) * 0.12
      ly += (cy - ly) * 0.12
      root.style.setProperty('--mx', (tx * 46).toFixed(2))
      root.style.setProperty('--my', (ty * 46).toFixed(2))
      const persp = root.querySelector('.cg-perspective')
      if (persp) {
        persp.style.transform = `perspective(1100px) rotateX(${(-cgy * 3.2).toFixed(2)}deg) rotateY(${(cgx * 3.2).toFixed(2)}deg)`
      }
      const light = lightRef.current
      if (light) {
        const lw = light.offsetWidth
        const lh = light.offsetHeight
        light.style.left = `${cx * 40 + 50 - lw / 2}%`
        light.style.top = `${cy * 40 + 46 - lh / 2}%`
      }
      frame = requestAnimationFrame(loop)
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    frame = requestAnimationFrame(loop)
    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(frame)
    }
  }, [mobile])

  const blocks = mobile ? MOBILE_BLOCKS : BLOCKS
  const shapes = mobile ? MOBILE_SHAPES : SHAPES
  const cells = mobile ? MOBILE_CELLS : CELLS

  return (
    <motion.div
      ref={rootRef}
      className="cinematic-grid"
      aria-hidden="true"
      initial={{ opacity: 0 }}
      animate={show ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 1.6, ease: 'easeOut' }}
    >
      <div className="cg-perspective">
        <div className="cg-grid-layer cg-drift cg-l1" />
        <div className="cg-grid-layer cg-drift-rev cg-l2" />
        <div className="cg-grid-layer cg-major cg-drift cg-l3" />
      </div>

      {blocks.map((b) => (
        <div key={b.id} className={`absolute ${b.className}`} style={b.style} />
      ))}

      <div className="cg-sweep cg-l2" />

      <div
        className="cg-orb cg-l1"
        style={{ top: '-10%', left: '-10%', width: 420, height: 420, background: 'var(--cg-glow)' }}
      />
      <div
        className="cg-orb cg-l2"
        style={{ bottom: '-14%', right: '-12%', width: 480, height: 480, background: 'var(--cg-glow)' }}
      />

      <div
        ref={lightRef}
        className="cg-light"
        style={{ width: 320, height: 320, borderRadius: 9999, filter: 'blur(80px)', background: 'var(--cg-glow)', opacity: 0.8 }}
      />

      {cells.map((c, i) => (
        <div
          key={`cell-${i}`}
          className="fg-cell"
          style={{
            top: `${c.top}%`,
            left: `${c.left}%`,
            width: 6,
            height: 6,
            background: 'var(--cg-line-strong)',
            ['--cell-dur']: `${c.dur}s`,
            ['--cell-delay']: `${c.delay}s`,
            ['--cell-peak']: 0.5,
          }}
        />
      ))}

      {shapes.map((s) => (
        <ShapeNode
          key={s.id}
          shape={s}
          border="var(--cg-line-strong)"
          fill="var(--cg-glow)"
        />
      ))}
    </motion.div>
  )
}