import { useRef, useState } from 'react'
import { motion } from 'motion/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { useLang } from '../i18n'
import { Img, Words, ease, soft } from './ui'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const svcImg = ['living-1', 'kitchen-1', 'bed-2', 'bath-1']

/** Section heading that reveals word by word when it enters the viewport. */
export function Head({ title, lead, light }: { title: string; lead?: string; light?: boolean }) {
  const [seen, setSeen] = useState(false)
  return (
    <motion.div className={`head${light ? ' light' : ''}`} onViewportEnter={() => setSeen(true)} viewport={{ once: true, margin: '-12% 0px' }}>
      <h2><Words text={title} play={seen} /></h2>
      {lead && (
        <motion.p initial={{ opacity: 0, y: 12 }} animate={seen ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, ease, delay: 0.25 }}>
          {lead}
        </motion.p>
      )}
    </motion.div>
  )
}

export function Services() {
  const { t } = useLang()
  return (
    <section id="services" className="sec">
      <div className="wrap">
        <Head title={t.services.title} lead={t.services.lead} />
        <motion.ul
          className="svc"
          initial="h"
          whileInView="s"
          viewport={{ once: true, margin: '-8% 0px' }}
          variants={{ s: { transition: { staggerChildren: 0.05 } } }}
        >
          {t.services.items.map((s, n) => (
            <motion.li
              key={s.t}
              className="svc-card"
              variants={{ h: { opacity: 0, y: 28 }, s: { opacity: 1, y: 0, transition: soft } }}
            >
              <div className="svc-img"><Img name={svcImg[n]} alt="" sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 25vw" /></div>
              <div className="svc-txt">
                <h3>{s.t}</h3>
                <p>{s.d}</p>
              </div>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  )
}

export function Process() {
  const { t } = useLang()
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo('.proc-fill', { scaleY: 0 }, {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: { trigger: '.proc-list', start: 'top 65%', end: 'bottom 55%', scrub: 0.6 },
        })
        gsap.utils.toArray<HTMLElement>('.proc-item').forEach((el) => {
          ScrollTrigger.create({
            trigger: el,
            start: 'top 70%',
            onEnter: () => el.classList.add('on'),
            onLeaveBack: () => el.classList.remove('on'),
          })
        })
      })
      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set('.proc-fill', { scaleY: 1 })
        gsap.utils.toArray<HTMLElement>('.proc-item').forEach((el) => el.classList.add('on'))
      })
    },
    { scope: root, dependencies: [t] },
  )

  return (
    <section id="process" ref={root} className="sec proc">
      <div className="wrap proc-grid">
        <div className="proc-side">
          <Head title={t.process.title} />
          <div className="proc-img"><Img name="bed-1" alt="" sizes="40vw" /></div>
        </div>
        <ol className="proc-list">
          <span className="proc-line" aria-hidden="true"><i className="proc-fill" /></span>
          {t.process.steps.map((s, n) => (
            <li className="proc-item" key={s.t}>
              <span className="proc-n" dir="ltr">0{n + 1}</span>
              <div>
                <h3>{s.t}</h3>
                <p>{s.d}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
