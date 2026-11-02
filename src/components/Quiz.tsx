import { useState } from 'react'
import { motion } from 'motion/react'
import type { StyleKey } from '../tools-i18n'
import { ABtn, Img, WaIcon, ease, soft, stiff } from './ui'
import { Choice, Progress, Slide, useTools, waLink } from './Tools'

// option n of every question points to the same style
const order: StyleKey[] = ['warm', 'minimal', 'classic', 'natural']

const palettes: Record<StyleKey, string[]> = {
  warm: ['#6b4a32', '#b8894d', '#d9bf9b', '#efe4d4'],
  minimal: ['#2e2c29', '#9a958c', '#dcd8d1', '#f5f3ef'],
  classic: ['#1e1a16', '#8c6a3a', '#d4af6a', '#efe6d6'],
  natural: ['#7f7a52', '#c7ae86', '#e3d5bd', '#f6f0e5'],
}
const styleImg: Record<StyleKey, string> = { warm: 'living-1', minimal: 'bed-1', classic: 'hero-3', natural: 'bath-1' }

// visuals for each question: swatches, light gradients, room photos, furniture outlines
const lights = [
  'radial-gradient(circle at 50% 30%, #f3c98a, #6b4a32 75%)',
  'linear-gradient(180deg, #ffffff, #dcdcdc)',
  'radial-gradient(circle at 50% 20%, #ffe2a8 0 12%, #8c6a3a 13%, #1e1a16 80%)',
  'linear-gradient(160deg, #fff4dc, #bcd6dc 70%)',
]
const rooms = ['living-1', 'bed-1', 'hero-3', 'bath-1']
const furniture = [
  'M3 16c0-5 4-8 9-8s9 3 9 8v3H3zM6 19v2M18 19v2',
  'M3 12h18v6H3zM3 12V8h18v4M5 18v3M19 18v3',
  'M4 12c0-3 3-4 8-4s8 1 8 4v6H4zM4 12c-1 0-2 1-2 2v4h2M20 12c1 0 2 1 2 2v4h-2M6 18l-1 3M18 18l1 3M8 8c0-2 2-4 4-4s4 2 4 4',
  'M12 3c-4 4-6 8-6 11a6 6 0 0 0 12 0c0-3-2-7-6-11zM12 9v12M12 13l3-2M12 16l-3-2',
]

export default function Quiz() {
  const tt = useTools()
  const q = tt.quiz
  const [stage, setStage] = useState<number>(-1) // -1 intro, 0..4 questions, 5 result
  const [dir, setDir] = useState(1)
  const [ans, setAns] = useState<(number | null)[]>(Array(q.questions.length).fill(null))
  const total = q.questions.length

  const go = (n: number) => {
    setDir(n > stage ? 1 : -1)
    setStage(n)
  }
  const pick = (i: number) => {
    const next = [...ans]
    next[stage] = i
    setAns(next)
    window.setTimeout(() => go(stage + 1), 300)
  }

  // the most picked style wins; ties go to the earliest answer
  const score = order.map((_, n) => ans.filter((v) => v === n).length)
  const best = order[ans.reduce<number>((acc, v) => (v !== null && score[v] > score[acc] ? v : acc), ans[0] ?? 0)]
  const style = q.styles[best]

  const visual = (qi: number, i: number) => {
    if (qi === 0 || qi === 1) {
      const p = palettes[order[i]]
      return <span className="sw" aria-hidden="true">{(qi === 0 ? p : [...p].reverse()).map((c) => <i key={c} style={{ background: c }} />)}</span>
    }
    if (qi === 2) return <span className="lightbox" aria-hidden="true" style={{ background: lights[i] }} />
    if (qi === 3) return <span className="opt-img" aria-hidden="true"><Img name={rooms[i]} alt="" sizes="200px" /></span>
    return <svg className="opt-ic" viewBox="0 0 24 24" aria-hidden="true"><path d={furniture[i]} /></svg>
  }

  return (
    <div className="tool">
      {stage >= 0 && stage < total && <Progress step={stage} total={total} />}
      <Slide k={stage} dir={dir}>
        {stage === -1 && (
          <div className="quiz-intro">
            <div className="quiz-swatches" aria-hidden="true">
              {order.map((s, n) => (
                <motion.span key={s} initial={{ opacity: 0, y: 20, rotate: (n - 1.5) * 6 }} animate={{ opacity: 1, y: 0, rotate: (n - 1.5) * 6 }} transition={{ ...soft, delay: n * 0.05 }}>
                  <Img name={styleImg[s]} alt="" sizes="160px" />
                </motion.span>
              ))}
            </div>
            <p>{q.intro}</p>
            <motion.button type="button" className="btn gold" onClick={() => go(0)} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={stiff}>
              {q.start}
            </motion.button>
          </div>
        )}

        {stage >= 0 && stage < total && (
          <>
            <h3 className="tool-q">{q.questions[stage].q}</h3>
            <Choice label={q.questions[stage].q} options={q.questions[stage].opts} value={ans[stage]} onChange={pick} render={(i) => visual(stage, i)} />
          </>
        )}

        {stage === total && (
          <div className="result">
            <motion.div className="result-img" initial={{ clipPath: 'inset(0 0 100% 0)' }} animate={{ clipPath: 'inset(0 0 0% 0)' }} transition={{ duration: 0.9, ease }}>
              <Img name={styleImg[best]} alt={style.name} sizes="(max-width: 800px) 100vw, 45vw" />
            </motion.div>
            <div className="result-txt">
              <small>{q.result}</small>
              <h3>{style.name}</h3>
              <p>{style.d}</p>
              <h4>{q.palette}</h4>
              <div className="pal">
                {palettes[best].map((c, n) => (
                  <motion.span key={c} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ ...stiff, delay: 0.3 + n * 0.05 }}>
                    <i style={{ background: c }} />
                    <code dir="ltr">{c.toUpperCase()}</code>
                  </motion.span>
                ))}
              </div>
              <h4>{q.materials}</h4>
              <ul className="mats">{style.m.map((m) => <li key={m}>{m}</li>)}</ul>
              <div className="row">
                <ABtn gold href={waLink(`${q.msgHead}\n${q.result}: ${style.name}\n${q.materials}: ${style.m.join('، ')}`)} target="_blank" rel="noopener noreferrer">
                  <WaIcon /> {q.share}
                </ABtn>
                <motion.button
                  type="button"
                  className="btn sm"
                  onClick={() => {
                    setAns(Array(total).fill(null))
                    go(-1)
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  {tt.restart}
                </motion.button>
              </div>
            </div>
          </div>
        )}
      </Slide>

      {stage >= 0 && stage < total && (
        <div className="tool-nav">
          <motion.button type="button" className="btn sm" onClick={() => go(stage - 1)} whileTap={{ scale: 0.98 }} transition={stiff}>
            {tt.back}
          </motion.button>
        </div>
      )}
    </div>
  )
}
