import { useEffect, useState } from 'react'
import { AnimatePresence, animate, motion, useMotionValue, useTransform } from 'motion/react'
import { useLang } from '../i18n'
import { ease, asset } from './ui'

/** Logo intro with a counter; lifts like a curtain once the hero image is ready. Shown once per session. */
export default function Preloader({ onDone }: { onDone: () => void }) {
  const { t } = useLang()
  const [show, setShow] = useState(() => {
    try {
      return !sessionStorage.getItem('intro') && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    } catch {
      return false
    }
  })
  const n = useMotionValue(0)
  const label = useTransform(n, (v) => Math.round(v).toString().padStart(2, '0'))
  const progress = useTransform(n, [0, 100], [0, 1])

  useEffect(() => {
    if (!show) {
      onDone()
      return
    }
    document.documentElement.style.overflow = 'hidden'
    const img = new Image()
    img.src = asset('projects/hero-1.webp')
    const loaded = img.decode().catch(() => undefined)
    const count = animate(n, 100, { duration: 1.8, ease: [0.65, 0, 0.35, 1] })
    let alive = true
    Promise.all([loaded, count.then(() => undefined)]).then(() => {
      if (!alive) return
      try {
        sessionStorage.setItem('intro', '1')
      } catch {
        /* storage unavailable */
      }
      setShow(false)
    })
    return () => {
      alive = false
      count.stop()
      document.documentElement.style.overflow = ''
    }
  }, [show, n, onDone])

  return (
    <AnimatePresence
      onExitComplete={() => {
        document.documentElement.style.overflow = ''
        onDone()
      }}
    >
      {show && (
        <motion.div
          className="loader"
          role="status"
          aria-label={t.loader}
          initial={{ clipPath: 'inset(0 0 0% 0)' }}
          exit={{ clipPath: 'inset(0 0 100% 0)' }}
          transition={{ duration: 1.1, ease }}
        >
          <motion.div
            className="loader-mark"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.9, ease }}
          >
            <img src={asset('logo.jpeg')} alt="" />
          </motion.div>
          <motion.p className="loader-name" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.8, ease }}>
            AA Vision
          </motion.p>
          <div className="loader-foot">
            <span>{t.about.tag}</span>
            <motion.span dir="ltr">{label}</motion.span>
          </div>
          <motion.i className="loader-line" style={{ scaleX: progress }} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
