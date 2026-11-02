import { useEffect, useMemo, useState } from 'react'
import { motion } from 'motion/react'
import { useLang } from '../i18n'
import { ABtn, WaIcon, stiff } from './ui'
import { Choice, Progress, Slide, useTools, waLink } from './Tools'

const SLOTS = ['10:00', '12:00', '14:00', '16:00', '18:00', '20:00']

export default function Booking() {
  const tt = useTools()
  const b = tt.book
  const { lang } = useLang()
  const locale = lang === 'ar' ? 'ar-EG' : 'en-GB'
  const [kind, setKind] = useState<number | null>(0)
  const [day, setDay] = useState<number | null>(null)
  const [slot, setSlot] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [place, setPlace] = useState('')
  const [step, setStep] = useState(0)
  const [dir, setDir] = useState(1)
  const [phone, setPhone] = useState(() => window.matchMedia('(max-width: 600px)').matches)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 600px)')
    const on = () => setPhone(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])

  const go = (d: number) => {
    setDir(d)
    setStep((v) => Math.min(2, Math.max(0, v + d)))
  }

  // the next 14 days, starting tomorrow
  const days = useMemo(() => {
    const today = new Date()
    return Array.from({ length: 14 }, (_, n) => new Date(today.getFullYear(), today.getMonth(), today.getDate() + n + 1))
  }, [])
  const fmt = (d: Date, o: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat(locale, o).format(d)
  const timeLabel = (s: string) => {
    const [h] = s.split(':').map(Number)
    return fmt(new Date(2000, 0, 1, h), { hour: 'numeric', minute: '2-digit' })
  }

  const ready = kind !== null && day !== null && slot && name.trim()
  const when = day !== null && slot ? `${fmt(days[day], { weekday: 'long', day: 'numeric', month: 'long' })} · ${timeLabel(slot)}` : b.pick
  const message = [
    b.msgHead,
    `${b.name}: ${name}`,
    `${b.kind}: ${kind !== null ? b.kinds[kind] : ''}`,
    `${b.selected}: ${when}`,
    kind === 0 && place && `${b.place}: ${place}`,
  ]
    .filter(Boolean)
    .join('\n')

  const kindBlock = (
    <>
        <h3 className="tool-q">{b.kind}</h3>
        <Choice label={b.kind} options={b.kinds} value={kind} onChange={setKind} cols={3} />
    </>
  )
  const dayTimeBlock = (
    <>
        <h3 className="tool-q">{b.day}</h3>
        <div className="days" role="radiogroup" aria-label={b.day}>
          {days.map((d, n) => (
            <motion.button
              key={n}
              type="button"
              role="radio"
              aria-checked={day === n}
              className={`day${day === n ? ' on' : ''}`}
              onClick={() => setDay(n)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={stiff}
            >
              <small>{fmt(d, { weekday: 'short' })}</small>
              <b>{fmt(d, { day: 'numeric' })}</b>
              <small>{fmt(d, { month: 'short' })}</small>
            </motion.button>
          ))}
        </div>

        <h3 className="tool-q">{b.time}</h3>
        <div className="slots" role="radiogroup" aria-label={b.time}>
          {SLOTS.map((s) => (
            <motion.button
              key={s}
              type="button"
              role="radio"
              aria-checked={slot === s}
              className={`slot${slot === s ? ' on' : ''}`}
              onClick={() => setSlot(s)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={stiff}
            >
              {timeLabel(s)}
            </motion.button>
          ))}
        </div>
    </>
  )
  const summary = (
      <aside className="summary">
        <h4>{b.selected}</h4>
        <motion.p key={when} className="when" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>{when}</motion.p>
        <label className="fld">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder=" " autoComplete="name" required />
          <span>{b.name}</span>
        </label>
        {kind === 0 && (
          <label className="fld">
            <input value={place} onChange={(e) => setPlace(e.target.value)} placeholder=" " autoComplete="street-address" />
            <span>{b.place}</span>
          </label>
        )}
        <ABtn gold className={`send${ready ? '' : ' off'}`} href={ready ? waLink(message) : undefined} target="_blank" rel="noopener noreferrer" aria-disabled={!ready}>
          <WaIcon /> {b.send}
        </ABtn>
        <small className="hint">{b.note}</small>
      </aside>
  )

  // phones get three short steps so the panel stays as compact as the other tools
  if (phone) {
    const canNext = step === 0 ? kind !== null : day !== null && !!slot
    return (
      <div className="tool">
        <Progress step={step} total={3} />
        <Slide k={step} dir={dir}>
          {step === 0 && kindBlock}
          {step === 1 && dayTimeBlock}
          {step === 2 && summary}
        </Slide>
        <div className="tool-nav">
          <motion.button type="button" className="btn sm" onClick={() => go(-1)} disabled={step === 0} whileTap={{ scale: 0.98 }} transition={stiff}>
            {tt.back}
          </motion.button>
          {step < 2 && (
            <motion.button type="button" className="btn sm gold" onClick={() => go(1)} disabled={!canNext} title={canNext ? undefined : tt.required} whileTap={{ scale: 0.98 }} transition={stiff}>
              {tt.next}
            </motion.button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="tool book">
      <div className="book-main">
        {kindBlock}
        {dayTimeBlock}
      </div>
      {summary}
    </div>
  )
}
