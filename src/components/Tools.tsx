import { useEffect, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useLang, WA } from '../i18n'
import { toolsDict } from '../tools-i18n'
import { scrollToId } from '../scroll'
import { Head } from './Sections'
import { ease, soft, stiff } from './ui'
import Wizard from './Wizard'
import Quiz from './Quiz'
import Booking from './Booking'

export type Tool = 'wizard' | 'quiz' | 'book'
const tools: Tool[] = ['wizard', 'quiz', 'book']

export const waLink = (text: string) => `https://wa.me/${WA}?text=${encodeURIComponent(text)}`

/** Opens a tool from anywhere on the page (hero, nav, menu). */
export const openTool = (tool: Tool) => window.dispatchEvent(new CustomEvent<Tool>('aa:tool', { detail: tool }))

export function useTools() {
  const { lang } = useLang()
  return toolsDict[lang]
}

/** Card-style radio group used by every tool. */
export function Choice({
  options,
  value,
  onChange,
  label,
  render,
  cols = 4,
}: {
  options: string[]
  value: number | null
  onChange: (i: number) => void
  label: string
  render?: (i: number) => ReactNode
  cols?: number
}) {
  return (
    <motion.div
      className={`choice cols-${cols}`}
      role="radiogroup"
      aria-label={label}
      initial="h"
      animate="s"
      variants={{ s: { transition: { staggerChildren: 0.05 } } }}
    >
      {options.map((o, i) => (
        <motion.button
          key={o}
          type="button"
          role="radio"
          aria-checked={value === i}
          className={`opt${value === i ? ' on' : ''}`}
          onClick={() => onChange(i)}
          variants={{ h: { opacity: 0, y: 14 }, s: { opacity: 1, y: 0, transition: soft } }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {render?.(i)}
          <span className="opt-t">{o}</span>
          <span className="opt-check" aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
          </span>
        </motion.button>
      ))}
    </motion.div>
  )
}

export function Progress({ step, total }: { step: number; total: number }) {
  const tt = useTools()
  return (
    <div className="prog">
      <span className="prog-txt">
        {tt.step} <b dir="ltr">{step + 1}</b> {tt.of} <b dir="ltr">{total}</b>
      </span>
      <span className="prog-bar"><motion.i animate={{ scaleX: (step + 1) / total }} transition={soft} /></span>
    </div>
  )
}

/** Slides each step in from the reading direction. */
export function Slide({ k, dir, children }: { k: string | number; dir: number; children: ReactNode }) {
  const { lang } = useLang()
  const sign = (lang === 'ar' ? -1 : 1) * dir
  return (
    // enter-only: a keyed remount never gets stuck behind an exit animation when answers come fast
    <motion.div key={k} initial={{ opacity: 0, x: 36 * sign }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45, ease }}>
      {children}
    </motion.div>
  )
}

export function Counter({ label, value, set, min, max }: { label: string; value: number; set: (n: number) => void; min: number; max: number }) {
  return (
    <div className="counter">
      <span>{label}</span>
      <div>
        <motion.button type="button" aria-label={`${label} -`} disabled={value <= min} onClick={() => set(value - 1)} whileTap={{ scale: 0.98 }} transition={stiff}>−</motion.button>
        <output dir="ltr" aria-live="polite">{value}</output>
        <motion.button type="button" aria-label={`${label} +`} disabled={value >= max} onClick={() => set(value + 1)} whileTap={{ scale: 0.98 }} transition={stiff}>+</motion.button>
      </div>
    </div>
  )
}

export default function Tools() {
  const tt = useTools()
  const [tab, setTab] = useState<Tool>('wizard')

  useEffect(() => {
    const on = (e: Event) => {
      setTab((e as CustomEvent<Tool>).detail)
      scrollToId('start')
    }
    window.addEventListener('aa:tool', on)
    return () => window.removeEventListener('aa:tool', on)
  }, [])

  return (
    <section id="start" className="sec tools">
      <div className="wrap">
        <Head title={tt.title} lead={tt.lead} />
        <div className="tool-tabs" role="tablist" aria-label={tt.title}>
          {tools.map((k) => (
            <motion.button
              key={k}
              role="tab"
              id={`tab-${k}`}
              aria-selected={tab === k}
              aria-controls="tool-panel"
              className="tool-tab"
              onClick={() => setTab(k)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={stiff}
            >
              {tab === k && <motion.i className="pill" layoutId="toolpill" transition={stiff} />}
              <span>{tt.tabs[k]}</span>
            </motion.button>
          ))}
        </div>
        <motion.div className="tool-panel" id="tool-panel" role="tabpanel" aria-labelledby={`tab-${tab}`} layout transition={soft}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={tab} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4, ease }}>
              {tab === 'wizard' && <Wizard />}
              {tab === 'quiz' && <Quiz />}
              {tab === 'book' && <Booking />}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}
