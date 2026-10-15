import { ref } from 'vue'

// devicePixelRatio changes with browser zoom or when the window moves to another screen.
// A resolution media query for the current value fires once it no longer matches.
const ratio = ref(window.devicePixelRatio || 1)
let query: MediaQueryList | null = null

function listen() {
  query?.removeEventListener('change', update)
  query = window.matchMedia(`(resolution: ${ratio.value}dppx)`)
  query.addEventListener('change', update)
}

function update() {
  ratio.value = window.devicePixelRatio || 1
  listen()
}

listen()

export function useDevicePixelRatio() {
  return ratio
}
