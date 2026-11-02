import { useEffect, useRef, useState } from 'react'
import { animate, motion, useInView, useMotionValue, useSpring, useTransform } from 'motion/react'
import { useLang } from '../i18n'
import { Head } from './Sections'
import { Img, ease, soft, stiff } from './ui'

function Count({ to, suffix }: { to: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const mv = useMotionValue(0)
  const text = useTransform(mv, (v) => Math.round(v).toString())
  useEffect(() => {
    if (!inView) return
    const c = animate(mv, to, { duration: 1.8, ease: [0.16, 1, 0.3, 1] })
    return () => c.stop()
  }, [inView, mv, to])
  return (
    <span ref={ref} dir="ltr">
      <motion.span>{text}</motion.span>
      {suffix}
    </span>
  )
}

export function Stats() {
  const { t } = useLang()
  return (
    <section className="stats">
      <div className="wrap">
        <Head title={t.stats.title} light />
        <motion.dl initial="h" whileInView="s" viewport={{ once: true, margin: '-10% 0px' }} variants={{ s: { transition: { staggerChildren: 0.05 } } }}>
          {t.stats.items.map((s) => (
            <motion.div key={s.l} variants={{ h: { opacity: 0, y: 30 }, s: { opacity: 1, y: 0, transition: soft } }}>
              <dt><Count to={s.v} suffix={s.s} /></dt>
              <dd>{s.l}</dd>
            </motion.div>
          ))}
        </motion.dl>
      </div>
    </section>
  )
}

export function BeforeAfter() {
  const { t } = useLang()
  const box = useRef<HTMLDivElement>(null)
  const raw = useMotionValue(50)
  const pos = useSpring(raw, stiff)
  const clip = useTransform(pos, (p) => `inset(0 ${100 - p}% 0 0)`)
  const left = useTransform(pos, (p) => `${p}%`)
  const [val, setVal] = useState(50)
  const dragging = useRef(false)
  const inView = useInView(box, { once: true, margin: '-20% 0px' })

  // a short hint sweep the first time it is seen
  useEffect(() => {
    if (!inView || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const a = animate(raw, [50, 72, 30, 50], { duration: 2.2, ease: 'easeInOut', delay: 0.3 })
    return () => a.stop()
  }, [inView, raw])

  const set = (v: number) => {
    const c = Math.min(100, Math.max(0, v))
    raw.set(c)
    setVal(Math.round(c))
  }
  const fromX = (clientX: number) => {
    const r = box.current!.getBoundingClientRect()
    set(((clientX - r.left) / r.width) * 100)
  }

  return (
    <section className="sec ba">
      <div className="wrap">
        <Head title={t.ba.title} lead={t.ba.lead} />
        <motion.div
          ref={box}
          className="cmp"
          dir="ltr"
          initial={{ clipPath: 'inset(8% 8% 8% 8%)', opacity: 0 }}
          whileInView={{ clipPath: 'inset(0% 0% 0% 0%)', opacity: 1 }}
          viewport={{ once: true, margin: '-10% 0px' }}
          transition={{ duration: 1.1, ease }}
          onPointerDown={(e) => {
            dragging.current = true
            e.currentTarget.setPointerCapture(e.pointerId)
            fromX(e.clientX)
          }}
          onPointerMove={(e) => dragging.current && fromX(e.clientX)}
          onPointerUp={() => (dragging.current = false)}
        >
          <div className="layer"><Img name="after" alt={t.ba.after} sizes="90vw" /></div>
          <motion.div className="layer" style={{ clipPath: clip }}><Img name="before" alt={t.ba.before} sizes="90vw" /></motion.div>
          <span className="tag l">{t.ba.before}</span>
          <span className="tag r">{t.ba.after}</span>
          <motion.div className="bar" style={{ left }} aria-hidden="true">
            <i><svg viewBox="0 0 24 24"><path d="M9 6l-6 6 6 6M15 6l6 6-6 6" /></svg></i>
          </motion.div>
          <input type="range" min={0} max={100} value={val} aria-label={t.ba.aria} onChange={(e) => set(Number(e.target.value))} />
        </motion.div>
      </div>
    </section>
  )
}

export function Reviews() {
  const { t } = useLang()
  if (!t.reviews.items.length) return null
  return (
    <section className="sec">
      <div className="wrap">
        <Head title={t.reviews.title} />
        <div className="rev">
          {t.reviews.items.map((r) => (
            <motion.blockquote key={r.n} whileHover={{ y: -4 }} transition={soft}>
              <p>{r.q}</p>
              <footer>{r.n}<small>{r.p}</small></footer>
            </motion.blockquote>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Faq() {
  const { t } = useLang()
  const [open, setOpen] = useState<number | null>(0)
  return (
    <section id="faq" className="sec">
      <div className="wrap faq">
        <Head title={t.faq.title} />
        <motion.div initial="h" whileInView="s" viewport={{ once: true, margin: '-10% 0px' }} variants={{ s: { transition: { staggerChildren: 0.05 } } }}>
          {t.faq.items.map((f, n) => (
            <motion.div className={`qa${open === n ? ' open' : ''}`} key={f.q} variants={{ h: { opacity: 0, y: 20 }, s: { opacity: 1, y: 0, transition: soft } }}>
              <h3>
                <button aria-expanded={open === n} aria-controls={`a${n}`} id={`q${n}`} onClick={() => setOpen(open === n ? null : n)}>
                  <span>{f.q}</span>
                  <motion.i animate={{ rotate: open === n ? 45 : 0 }} transition={stiff} aria-hidden="true">
                    <svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" /></svg>
                  </motion.i>
                </button>
              </h3>
              <motion.div
                id={`a${n}`}
                role="region"
                aria-labelledby={`q${n}`}
                initial={false}
                animate={{ height: open === n ? 'auto' : 0, opacity: open === n ? 1 : 0 }}
                transition={soft}
                style={{ overflow: 'hidden' }}
              >
                <p>{f.a}</p>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
