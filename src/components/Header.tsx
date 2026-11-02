import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react'
import { useLang, WA } from '../i18n'
import { ABtn, ease, soft, stiff, asset } from './ui'

const keys = ['services', 'work', 'process', 'start', 'faq', 'contact'] as const

export default function Header() {
  const { t, toggle, lang } = useLang()
  const { scrollY } = useScroll()
  const [solid, setSolid] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [open, setOpen] = useState(false)
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme ?? 'light')

  const flip = () => {
    const next = theme === 'light' ? 'dark' : 'light'
    const root = document.documentElement
    root.classList.add('theme-anim')
    root.dataset.theme = next
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', next === 'dark' ? '#141210' : '#F7F2EA')
    try {
      localStorage.setItem('theme', next)
    } catch {
      /* storage unavailable */
    }
    window.setTimeout(() => root.classList.remove('theme-anim'), 600)
    setTheme(next)
  }

  useMotionValueEvent(scrollY, 'change', (v) => {
    const prev = scrollY.getPrevious() ?? 0
    setSolid(v > 40)
    setHidden(v > 600 && v > prev && !open)
  })

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    document.documentElement.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.documentElement.style.overflow = ''
    }
  }, [open])

  return (
    <>
      <motion.header
        className={`hdr${solid || open ? ' solid' : ''}`}
        animate={{ y: hidden ? '-100%' : '0%' }}
        transition={{ duration: 0.45, ease }}
      >
        <div className="wrap">
          <a className="brand" href="#top" aria-label="AA Vision">
            <span className="mark"><img src={asset('logo.jpeg')} alt="" /></span>
            <span>AA Vision</span>
          </a>
          <nav aria-label="Main">
            <ul>
              {keys.map((k) => (
                <li key={k}><a className="ul" href={`#${k}`}>{t.nav[k]}</a></li>
              ))}
            </ul>
          </nav>
          <div className="hdr-act">
            <motion.button
              className="lang"
              onClick={flip}
              aria-label={theme === 'light' ? t.theme.dark : t.theme.light}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={stiff}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.svg
                  key={theme}
                  viewBox="0 0 24 24"
                  className="th-ic"
                  aria-hidden="true"
                  initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
                  transition={stiff}
                >
                  {theme === 'light' ? (
                    <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />
                  ) : (
                    <>
                      <circle cx="12" cy="12" r="4" />
                      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
                    </>
                  )}
                </motion.svg>
              </AnimatePresence>
            </motion.button>
            <motion.button
              className="lang"
              onClick={toggle}
              lang={lang === 'ar' ? 'en' : 'ar'}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={stiff}
            >
              {lang === 'ar' ? 'EN' : 'ع'}
            </motion.button>
            <ABtn small gold className="hide-sm" href={`https://wa.me/${WA}`} target="_blank" rel="noopener noreferrer">
              {t.wa}
            </ABtn>
            <motion.button
              className="burger"
              aria-expanded={open}
              aria-controls="menu"
              aria-label={t.menu}
              onClick={() => setOpen(!open)}
              whileTap={{ scale: 0.98 }}
              transition={stiff}
            >
              <motion.i animate={open ? { rotate: 45, y: 4 } : { rotate: 0, y: 0 }} transition={stiff} />
              <motion.i animate={open ? { rotate: -45, y: -4 } : { rotate: 0, y: 0 }} transition={stiff} />
            </motion.button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="menu"
            className="menu"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.7, ease }}
          >
            <motion.ul initial="h" animate="s" variants={{ s: { transition: { staggerChildren: 0.05, delayChildren: 0.25 } } }}>
              {keys.map((k) => (
                <motion.li key={k} variants={{ h: { opacity: 0, y: 30 }, s: { opacity: 1, y: 0, transition: soft } }}>
                  <a href={`#${k}`} onClick={() => setOpen(false)}>{t.nav[k]}</a>
                </motion.li>
              ))}
            </motion.ul>
            <ABtn gold href={`https://wa.me/${WA}`} target="_blank" rel="noopener noreferrer">{t.wa}</ABtn>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
