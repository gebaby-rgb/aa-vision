import type Lenis from 'lenis'

let instance: Lenis | null = null

export const setLenis = (l: Lenis | null) => {
  instance = l
}

/** Smooth-scrolls through Lenis when it runs, so native scrolling does not fight it. */
export function scrollToId(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  if (instance) instance.scrollTo(el, { offset: -70 })
  else el.scrollIntoView()
}
