import { useState } from 'react'
import { motion } from 'motion/react'
import { ABtn, WaIcon, soft, stiff } from './ui'
import { Choice, Counter, Progress, Slide, useTools, waLink } from './Tools'

type Key = 'type' | 'service' | 'state' | 'level' | 'when'

const icons: Record<string, string[]> = {
  type: [
    'M4 21V5h10v16M14 9h6v12M7 8h4M7 12h4M7 16h4',
    'M3 11l9-7 9 7M5 10v11h14V10M10 21v-6h4v6',
    'M4 21V8l8-5 8 5v13M4 13h16M9 21v-4h6v4',
    'M3 9h18l-2-5H5zM5 9v12h14V9M9 21v-6h6v6',
  ],
  service: [
    'M4 20l4-1 11-11-3-3L5 16zM14 6l3 3',
    'M3 21h18M5 21V10l7-5 7 5v11M9 21v-5h6v5',
    'M4 4h7v7H4zM13 13h7v7h-7zM13 7h7M7 13v7',
    'M12 5c5 0 9 7 9 7s-4 7-9 7-9-7-9-7 4-7 9-7zM12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6',
  ],
}

export default function Wizard() {
  const tt = useTools()
  const w = tt.wizard
  const [step, setStep] = useState(0)
  const [dir, setDir] = useState(1)
  const [a, setA] = useState<Record<Key, number | null>>({ type: null, service: null, state: null, level: null, when: null })
  const [area, setArea] = useState(120)
  const [rooms, setRooms] = useState(3)
  const [baths, setBaths] = useState(2)
  const [name, setName] = useState('')
  const [place, setPlace] = useState('')
  const [notes, setNotes] = useState('')

  const total = w.steps.length
  const cur = w.steps[step]
  const isChoice = 'opts' in cur && !!cur.opts
  const answered = !isChoice || a[cur.k as Key] !== null
  const go = (d: number) => {
    setDir(d)
    setStep((s) => Math.min(total - 1, Math.max(0, s + d)))
  }
  const pick = (i: number) => {
    setA((p) => ({ ...p, [cur.k]: i }))
    window.setTimeout(() => go(1), 280)
  }

  const optText = (k: Key) => {
    const s = w.steps.find((x) => x.k === k)!
    const v = a[k]
    return v === null || !s.opts ? '—' : s.opts[v]
  }
  const sizeText = `${area} ${w.sqm} · ${w.rooms}: ${rooms} · ${w.baths}: ${baths}`
  const rows: [string, string][] = [
    [w.labels.type, optText('type')],
    [w.labels.service, optText('service')],
    [w.labels.size, sizeText],
    [w.labels.state, optText('state')],
    [w.labels.level, optText('level')],
    [w.labels.when, optText('when')],
  ]
  const message = [
    w.msgHead,
    `${w.name}: ${name}`,
    place && `${w.place}: ${place}`,
    ...rows.map(([k, v]) => `${k}: ${v}`),
    notes && `${w.notes}: ${notes}`,
  ]
    .filter(Boolean)
    .join('\n')

  return (
    <div className="tool">
      <Progress step={step} total={total} />
      <Slide k={step} dir={dir}>
        <h3 className="tool-q">{cur.q}</h3>

        {isChoice && (
          <Choice
            label={cur.q}
            options={cur.opts!}
            value={a[cur.k as Key]}
            onChange={pick}
            cols={cur.opts!.length === 3 ? 3 : 4}
            render={(i) =>
              icons[cur.k] ? (
                <svg className="opt-ic" viewBox="0 0 24 24" aria-hidden="true"><path d={icons[cur.k][i]} /></svg>
              ) : 'desc' in cur && cur.desc ? (
                <>
                  <span className="lvl" aria-hidden="true">{Array.from({ length: 4 }, (_, n) => <i key={n} className={n <= i ? 'on' : ''} />)}</span>
                  <span className="opt-d">{cur.desc[i]}</span>
                </>
              ) : null
            }
          />
        )}

        {cur.k === 'size' && (
          <div className="size">
            <label className="range">
              <span>{w.area}</span>
              <output dir="ltr">{area} {w.sqm}</output>
              <input type="range" min={40} max={500} step={10} value={area} onChange={(e) => setArea(Number(e.target.value))} style={{ ['--p' as string]: `${((area - 40) / 460) * 100}%` }} />
            </label>
            <div className="counters">
              <Counter label={w.rooms} value={rooms} set={setRooms} min={0} max={8} />
              <Counter label={w.baths} value={baths} set={setBaths} min={1} max={6} />
            </div>
          </div>
        )}

        {cur.k === 'contact' && (
          <div className="final">
            <div className="final-form">
              <label className="fld">
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder=" " autoComplete="name" required />
                <span>{w.name}</span>
              </label>
              <label className="fld">
                <input value={place} onChange={(e) => setPlace(e.target.value)} placeholder=" " />
                <span>{w.place}</span>
              </label>
              <label className="fld">
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder=" " />
                <span>{w.notes}</span>
              </label>
            </div>
            <aside className="summary" aria-label={w.summary}>
              <h4>{w.summary}</h4>
              <dl>
                {rows.map(([k, v], n) => (
                  <motion.div key={k} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ ...soft, delay: n * 0.05 }}>
                    <dt>{k}</dt>
                    <dd>{v}</dd>
                  </motion.div>
                ))}
              </dl>
              <ABtn gold className={`send${name.trim() ? '' : ' off'}`} href={name.trim() ? waLink(message) : undefined} target="_blank" rel="noopener noreferrer" aria-disabled={!name.trim()}>
                <WaIcon /> {tt.sendWa}
              </ABtn>
              {!name.trim() && <small className="hint">{w.name} *</small>}
            </aside>
          </div>
        )}
      </Slide>

      <div className="tool-nav">
        <motion.button type="button" className="btn sm" onClick={() => go(-1)} disabled={step === 0} whileTap={{ scale: 0.98 }} transition={stiff}>
          {tt.back}
        </motion.button>
        {step < total - 1 && (
          <motion.button
            type="button"
            className="btn sm gold"
            onClick={() => go(1)}
            disabled={!answered}
            title={answered ? undefined : tt.required}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={stiff}
          >
            {tt.next}
          </motion.button>
        )}
      </div>
    </div>
  )
}
