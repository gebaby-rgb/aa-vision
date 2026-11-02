import { useCallback, useEffect, useState } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLang } from './i18n'
import { setLenis } from './scroll'
import Preloader from './components/Preloader'
import Header from './components/Header'
import Hero from './components/Hero'
import { Services, Process } from './components/Sections'
import Work from './components/Work'
import { About, Contact, Footer } from './components/About'
import { Stats, BeforeAfter, Reviews, Faq } from './components/Extras'
import WhatsApp from './components/WhatsApp'
import Tools from './components/Tools'

gsap.registerPlugin(ScrollTrigger)

export default function App() {
  const { t, lang } = useLang()
  const [ready, setReady] = useState(false)
  const done = useCallback(() => setReady(true), [])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const lenis = new Lenis({ lerp: 0.12, smoothWheel: true, wheelMultiplier: 1, anchors: { offset: -70 } })
    setLenis(lenis)
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    return () => {
      gsap.ticker.remove(tick)
      setLenis(null)
      lenis.destroy()
    }
  }, [])

  // layout shifts when the language (and direction) changes
  useEffect(() => {
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 100)
    return () => window.clearTimeout(id)
  }, [lang])

  return (
    <>
      <a className="skip" href="#main">{t.skip}</a>
      <Preloader onDone={done} />
      <Header />
      <main id="main">
        <Hero ready={ready} />
        <Services />
        <Work />
        <Process />
        <BeforeAfter />
        <Tools />
        <Stats />
        <About />
        <Reviews />
        <Faq />
        <Contact />
      </main>
      <Footer />
      <WhatsApp />
    </>
  )
}
