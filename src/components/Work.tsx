import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useLang, WA } from '../i18n'
import { Head } from './Sections'
import { ABtn, Img, ease, soft, stiff, type Cat } from './ui'

const projects: { cat: Cat; name: string }[] = [
  { cat: 'living', name: 'living-1' },
  { cat: 'bed', name: 'bed-1' },
  { cat: 'kitchen', name: 'kitchen-1' },
  { cat: 'bath', name: 'bath-1' },
  { cat: 'living', name: 'living-2' },
  { cat: 'bed', name: 'bed-2' },
]
const cats: Cat[] = ['living', 'bed', 'kitchen', 'bath']

export default function Work() {
  const { t } = useLang()
  const [filter, setFilter] = useState<Cat | 'all'>('all')
  const [open, setOpen] = useState<number | null>(null)
  const lastFocus = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (open === null) {
      lastFocus.current?.focus()
      return
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(null)
    window.addEventListener('keydown', onKey)
    document.documentElement.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.documentElement.style.overflow = ''
    }
  }, [open])

  const shown = projects.map((p, i) => ({ ...p, i })).filter((p) => filter === 'all' || p.cat === filter)
  const cur = open !== null ? { ...projects[open], i: open } : null

  return (
    <section id="work" className="sec work">
      <div className="wrap">
        <div className="work-top">
          <Head title={t.work.title} lead={t.work.lead} />
          <div className="tabs" role="group" aria-label={t.work.title}>
            {(['all', ...cats] as const).map((c) => (
              <motion.button
                key={c}
                className="tab"
                aria-pressed={filter === c}
                onClick={() => setFilter(c)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={stiff}
              >
                {filter === c && <motion.i className="pill" layoutId="pill" transition={stiff} />}
                <span>{c === 'all' ? t.work.all : t.work.cats[c]}</span>
              </motion.button>
            ))}
          </div>
        </div>
        <motion.div className="grid" layout transition={soft}>
          <AnimatePresence mode="popLayout">
            {shown.map((p, n) => (
              <motion.button
                key={p.i}
                layout
                layoutId={`card-${p.i}`}
                className={`card c${n % 6}`}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ ...soft, delay: n * 0.05 }}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={(e) => {
                  lastFocus.current = e.currentTarget
                  setOpen(p.i)
                }}
                aria-label={`${t.work.open}: ${t.work.names[p.i]}`}
              >
                <span className="card-img">
                  <Img name={p.name} alt="" sizes="(max-width: 900px) 100vw, 40vw" />
                </span>
                <span className="cap">
                  <small>{t.work.cats[p.cat]}</small>
                  <span className="cap-t">{t.work.names[p.i]}</span>
                </span>
              </motion.button>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      <AnimatePresence>
        {cur && (
          <motion.div className="scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(null)}>
            <motion.div
              className="modal"
              layoutId={`card-${cur.i}`}
              transition={soft}
              role="dialog"
              aria-modal="true"
              aria-label={t.work.names[cur.i]}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="x" onClick={() => setOpen(null)} aria-label={t.work.close} autoFocus>
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
              </button>
              <div className="pic"><Img name={cur.name} alt={t.work.names[cur.i]} sizes="60vw" /></div>
              <motion.div className="txt" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease, delay: 0.2 }}>
                <small>{t.work.cats[cur.cat]}</small>
                <h3>{t.work.names[cur.i]}</h3>
                <p>{t.work.desc}</p>
                <ABtn gold href={`https://wa.me/${WA}?text=${encodeURIComponent(t.work.names[cur.i])}`} target="_blank" rel="noopener noreferrer">
                  {t.work.ask}
                </ABtn>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
