import { useState, type FormEvent } from 'react'
import { motion } from 'motion/react'
import { useLang, PHONE, WA, EMAIL, FB } from '../i18n'
import { toolsDict } from '../tools-i18n'
import { Head } from './Sections'
import { Img, Parallax, ease, soft, stiff, asset } from './ui'

export function About() {
  const { t } = useLang()
  return (
    <section id="about" className="sec about-sec">
      <div className="wrap about">
        <div className="about-pics">
          <motion.div
            className="about-a"
            initial={{ clipPath: 'inset(100% 0 0 0)' }}
            whileInView={{ clipPath: 'inset(0% 0 0 0)' }}
            viewport={{ once: true, margin: '-15% 0px' }}
            transition={{ duration: 1.2, ease }}
          >
            <Parallax amount={10}><Img name="living-2" alt="" sizes="40vw" /></Parallax>
          </motion.div>
          <motion.div
            className="about-b"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-15% 0px' }}
            transition={{ duration: 1.1, ease, delay: 0.25 }}
          >
            <img src={asset('logo.jpeg')} alt="AA Vision Construction" loading="lazy" />
          </motion.div>
        </div>
        <div>
          <Head title={t.about.title} />
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.9, ease, delay: 0.2 }}>
            <p>{t.about.p1}</p>
            <p>{t.about.p2}</p>
            <p className="tag">{t.about.tag}</p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

const ADDR = 'Hay El Nour, Sharm El Sheikh, South Sinai, Egypt'

function Map() {
  const { lang } = useLang()
  const tt = toolsDict[lang]
  return (
    <motion.div className="map" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.9, ease }}>
      <iframe
        title={tt.map.title}
        src={`https://maps.google.com/maps?q=${encodeURIComponent(ADDR)}&z=15&hl=${lang}&output=embed`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
      <a className="btn sm map-btn" href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(ADDR)}`} target="_blank" rel="noopener noreferrer">
        {tt.map.dir}
      </a>
    </motion.div>
  )
}

export function Contact() {
  const { t } = useLang()
  const [name, setName] = useState('')
  const [service, setService] = useState(0)
  const [msg, setMsg] = useState('')

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const text = `${t.contact.msgPre} ${name}.\n${t.contact.service}: ${t.contact.services[service]}\n${msg}`
    window.open(`https://wa.me/${WA}?text=${encodeURIComponent(text)}`, '_blank', 'noopener')
  }

  const rows = [
    { k: t.nav.contact, v: <span dir="ltr">{PHONE}</span>, href: `tel:+2${PHONE}` },
    { k: 'Email', v: EMAIL, href: `mailto:${EMAIL}` },
    { k: 'Facebook', v: 'AA Vision', href: FB, ext: true },
    { k: t.contact.hours, v: t.contact.address },
  ]

  return (
    <section id="contact" className="sec contact-sec">
      <div className="wrap contact">
        <div>
          <Head title={t.contact.title} lead={t.contact.lead} />
          <motion.address className="info" initial="h" whileInView="s" viewport={{ once: true }} variants={{ s: { transition: { staggerChildren: 0.05 } } }}>
            {rows.map((r) => {
              const inner = (<><small>{r.k}</small><span>{r.v}</span></>)
              return (
                <motion.div key={r.k} variants={{ h: { opacity: 0, y: 16 }, s: { opacity: 1, y: 0, transition: soft } }}>
                  {r.href ? <a className="ul" href={r.href} {...(r.ext ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>{inner}</a> : <div>{inner}</div>}
                </motion.div>
              )
            })}
          </motion.address>
          <Map />
        </div>
        <motion.form
          onSubmit={submit}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10% 0px' }}
          transition={{ duration: 1, ease }}
        >
          <label className="fld">
            <input value={name} onChange={(e) => setName(e.target.value)} required autoComplete="name" placeholder=" " />
            <span>{t.contact.name}</span>
          </label>
          <label className="fld">
            <select value={service} onChange={(e) => setService(Number(e.target.value))}>
              {t.contact.services.map((s, i) => <option key={s} value={i}>{s}</option>)}
            </select>
            <span className="up">{t.contact.service}</span>
          </label>
          <label className="fld">
            <textarea value={msg} onChange={(e) => setMsg(e.target.value)} placeholder=" " />
            <span>{t.contact.msgPh}</span>
          </label>
          <motion.button className="btn gold" type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={stiff}>
            {t.contact.send}
          </motion.button>
        </motion.form>
      </div>
    </section>
  )
}

export function Footer() {
  const { t } = useLang()
  return (
    <footer className="foot">
      <div className="wrap">
        <motion.p
          className="foot-word"
          initial={{ y: '40%', opacity: 0 }}
          whileInView={{ y: '0%', opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease }}
          aria-hidden="true"
        >
          AA Vision
        </motion.p>
        <div className="foot-row">
          <span>© {new Date().getFullYear()} AA Vision. {t.footer}</span>
          <span>{t.about.tag}</span>
          <a className="ul" href="#top">↑</a>
        </div>
      </div>
    </footer>
  )
}
