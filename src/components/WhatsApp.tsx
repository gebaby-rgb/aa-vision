import { useEffect, useRef, useState, type FormEvent } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useLang, WA } from '../i18n'
import { WaIcon, soft, stiff, asset } from './ui'

const link = (text: string) => `https://wa.me/${WA}?text=${encodeURIComponent(text)}`

/** Floating WhatsApp launcher with a mini chat card: greeting, quick replies and a free-text message. */
export default function WhatsApp() {
  const { t } = useLang()
  const [open, setOpen] = useState(false)
  const [tip, setTip] = useState(false)
  const [typing, setTyping] = useState(true)
  const [msg, setMsg] = useState('')
  const btn = useRef<HTMLButtonElement>(null)

  // one gentle nudge, only if the visitor has not opened the chat
  useEffect(() => {
    const show = window.setTimeout(() => setTip(true), 9000)
    const hide = window.setTimeout(() => setTip(false), 16000)
    return () => {
      window.clearTimeout(show)
      window.clearTimeout(hide)
    }
  }, [])

  useEffect(() => {
    if (!open) return
    setTip(false)
    setTyping(true)
    const id = window.setTimeout(() => setTyping(false), 1100)
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        btn.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.clearTimeout(id)
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  const send = (e: FormEvent) => {
    e.preventDefault()
    window.open(link(msg.trim() || t.waw.hello), '_blank', 'noopener')
  }

  return (
    <div className="waw">
      <AnimatePresence>
        {open && (
          <motion.div
            className="waw-card"
            role="dialog"
            aria-label="WhatsApp"
            initial={{ opacity: 0, y: 24, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={soft}
          >
            <header>
              <span className="waw-av"><img src={asset('logo.jpeg')} alt="" /><i /></span>
              <div>
                <strong>AA Vision</strong>
                <small>{t.waw.status}</small>
              </div>
              <button className="waw-x" onClick={() => setOpen(false)} aria-label={t.waw.close}>
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
              </button>
            </header>
            <div className="waw-body">
              <AnimatePresence mode="wait">
                {typing ? (
                  <motion.div key="dots" className="bubble dots3" exit={{ opacity: 0 }} aria-hidden="true">
                    {[0, 1, 2].map((d) => (
                      <motion.i key={d} animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.9, delay: d * 0.15 }} />
                    ))}
                  </motion.div>
                ) : (
                  <motion.p key="msg" className="bubble" initial={{ opacity: 0, y: 8, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={soft}>
                    {t.waw.hello}
                  </motion.p>
                )}
              </AnimatePresence>
              {!typing && (
                <motion.div className="quick" initial="h" animate="s" variants={{ s: { transition: { staggerChildren: 0.05, delayChildren: 0.15 } } }}>
                  {t.waw.quick.map((q) => (
                    <motion.a
                      key={q}
                      href={link(q)}
                      target="_blank"
                      rel="noopener noreferrer"
                      variants={{ h: { opacity: 0, y: 10 }, s: { opacity: 1, y: 0, transition: soft } }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {q}
                    </motion.a>
                  ))}
                </motion.div>
              )}
            </div>
            <form className="waw-form" onSubmit={send}>
              <label className="sr">{t.waw.ph}</label>
              <input value={msg} onChange={(e) => setMsg(e.target.value)} placeholder={t.waw.ph} aria-label={t.waw.ph} autoFocus />
              <motion.button type="submit" aria-label={t.waw.send} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={stiff}>
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12l16-8-6 16-3-7z" /></svg>
              </motion.button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {tip && !open && (
          <motion.button
            className="waw-tip"
            onClick={() => setOpen(true)}
            initial={{ opacity: 0, x: 12, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={soft}
          >
            {t.waw.tip}
          </motion.button>
        )}
      </AnimatePresence>

      <motion.button
        ref={btn}
        className="waw-btn"
        aria-label={open ? t.waw.close : t.waw.open}
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ ...stiff, delay: 0.6 }}
      >
        {!open && (
          <motion.span
            className="pulse"
            aria-hidden="true"
            animate={{ scale: [1, 1.7], opacity: [0.45, 0] }}
            transition={{ repeat: Infinity, duration: 2.2, ease: 'easeOut', repeatDelay: 0.8 }}
          />
        )}
        <AnimatePresence mode="wait" initial={false}>
          <motion.span key={open ? 'x' : 'wa'} className="ic" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={stiff}>
            {open ? <svg viewBox="0 0 24 24" aria-hidden="true" className="wa-ic x"><path d="M6 6l12 12M18 6L6 18" /></svg> : <WaIcon />}
          </motion.span>
        </AnimatePresence>
      </motion.button>
    </div>
  )
}
