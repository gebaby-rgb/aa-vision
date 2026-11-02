import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useLang } from '../i18n'
import { openTool } from './Tools'
import { ABtn, Img, Words, ease, stiff } from './ui'

const slides = ['hero-1', 'hero-2', 'hero-3']
const DUR = 7

export default function Hero({ ready }: { ready: boolean }) {
  const { t, lang } = useLang()
  const reduce = useReducedMotion()
  const root = useRef<HTMLElement>(null)
  const [i, setI] = useState(0)
  const [z, setZ] = useState(1)
  const [paused, setPaused] = useState(false)

  const { scrollYProgress } = useScroll({ target: root, offset: ['start start', 'end start'] })
  const copyY = useTransform(scrollYProgress, [0, 1], ['0%', '35%'])
  const copyO = useTransform(scrollYProgress, [0, 0.6], [1, 0])
  const stageY = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])

  const go = (n: number) => {
    setI((n + slides.length) % slides.length)
    setZ((v) => v + 1)
  }

  useEffect(() => {
    if (!ready || paused || reduce) return
    const id = window.setTimeout(() => go(i + 1), DUR * 1000)
    return () => window.clearTimeout(id)
  }, [i, ready, paused, reduce])

  // the wipe travels in reading direction
  const from = lang === 'ar' ? 'inset(0 0 0 100%)' : 'inset(0 100% 0 0)'

  return (
    <section
      id="top"
      ref={root}
      className="hero"
      aria-roledescription="carousel"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
    >
      <motion.div className="stage" style={reduce ? undefined : { y: stageY }}>
        <AnimatePresence initial={false}>
          <motion.div
            key={z}
            className="slide"
            style={{ zIndex: z }}
            initial={{ clipPath: from }}
            animate={{ clipPath: 'inset(0 0 0 0)' }}
            exit={{ opacity: 1, transition: { duration: 1.3 } }}
            transition={{ duration: 1.25, ease: [0.77, 0, 0.18, 1] }}
          >
            <motion.div className="kb" initial={{ scale: 1.18 }} animate={{ scale: ready ? 1.02 : 1.18 }} transition={{ duration: DUR + 2, ease: 'linear' }}>
              <Img name={slides[i]} alt={t.slides[i].t} eager />
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
      <div className="shade" />

      <motion.div className="hero-copy wrap" style={reduce ? undefined : { y: copyY, opacity: copyO }}>
        <h1><Words text={t.hero.title} play={ready} delay={0.15} /></h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={ready ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1, ease, delay: 0.55 }}>
          {t.hero.sub}
        </motion.p>
        <motion.div className="row" initial={{ opacity: 0, y: 20 }} animate={ready ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1, ease, delay: 0.7 }}>
          <ABtn gold magnetic href="#start" onClick={(e) => { e.preventDefault(); openTool('wizard') }}>{t.hero.cta}</ABtn>
          <ABtn className="ghost" magnetic href="#work">{t.hero.cta2}</ABtn>
        </motion.div>
      </motion.div>

      <motion.div className="hero-ctl wrap" initial={{ opacity: 0 }} animate={ready ? { opacity: 1 } : {}} transition={{ delay: 0.9, duration: 0.8 }}>
        <div className="cap" aria-live="polite">
          <span className="num" dir="ltr">0{i + 1} / 0{slides.length}</span>
          <span className="wmask">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span key={i} className="w" initial={{ y: '110%' }} animate={{ y: '0%' }} exit={{ y: '-110%' }} transition={{ duration: 0.6, ease }}>
                {t.slides[i].t}
              </motion.span>
            </AnimatePresence>
          </span>
        </div>
        <div className="dots" role="group" aria-label="Slides">
          {slides.map((_, n) => (
            <button key={n} aria-label={`${n + 1} / ${slides.length}`} aria-current={n === i} onClick={() => go(n)}>
              <span className="track">
                {n === i && (
                  <motion.i
                    key={`${z}-${paused}`}
                    initial={{ scaleX: paused || reduce ? 1 : 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: paused || reduce ? 0 : DUR, ease: 'linear' }}
                  />
                )}
              </span>
            </button>
          ))}
        </div>
        <div className="arrows">
          <motion.button aria-label={t.prev} onClick={() => go(i - 1)} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={stiff}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg>
          </motion.button>
          <motion.button aria-label={t.next} onClick={() => go(i + 1)} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={stiff}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg>
          </motion.button>
        </div>
      </motion.div>
    </section>
  )
}
