import { ref } from 'vue'

export const SIZES = [16, 32, 64] as const
export type GridSize = (typeof SIZES)[number]

const size = ref<GridSize>(32)
const pixels = ref<boolean[]>(Array(size.value * size.value).fill(false))

function inBounds(x: number, y: number) {
  return x >= 0 && x < size.value && y >= 0 && y < size.value
}

function get(x: number, y: number) {
  return pixels.value[y * size.value + x] ?? false
}

function set(x: number, y: number, value: boolean) {
  if (!inBounds(x, y)) return
  const i = y * size.value + x
  if (pixels.value[i] !== value) pixels.value[i] = value
}

function clear() {
  pixels.value = Array(size.value * size.value).fill(false)
}

// Rescale so the current drawing survives a size change. Each new pixel covers a block of
// old pixels (or sits inside one when growing); it's black if any of them is, so thin lines
// don't vanish when shrinking.
function setSize(next: GridSize) {
  const prev = size.value
  if (next === prev) return
  const old = pixels.value
  const scaled: boolean[] = Array(next * next).fill(false)
  const span = (i: number): [number, number] => {
    const start = Math.floor((i * prev) / next)
    return [start, Math.max(start + 1, Math.ceil(((i + 1) * prev) / next))]
  }
  for (let y = 0; y < next; y++) {
    const [y0, y1] = span(y)
    for (let x = 0; x < next; x++) {
      const [x0, x1] = span(x)
      for (let sy = y0; sy < y1 && !scaled[y * next + x]; sy++) {
        for (let sx = x0; sx < x1; sx++) {
          if (old[sy * prev + sx]) {
            scaled[y * next + x] = true
            break
          }
        }
      }
    }
  }
  size.value = next
  pixels.value = scaled
}

export function usePixelGrid() {
  return { size, pixels, get, set, clear, inBounds, setSize }
}
