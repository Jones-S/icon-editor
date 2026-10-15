import { computed, ref, shallowRef, watch } from 'vue'
import { readStorage, writeStorage } from '@/utils/storage'

export const SIZES = [16, 32, 64] as const
export type GridSize = (typeof SIZES)[number]

type Snapshot = { size: GridSize; pixels: boolean[] }

const STORAGE_KEY = 'icon-editor:drawing'
const MAX_HISTORY = 100

function loadDrawing(): Snapshot | null {
  try {
    const data = JSON.parse(readStorage(STORAGE_KEY) ?? 'null')
    if (SIZES.includes(data?.size) && data.pixels?.length === data.size * data.size) {
      return { size: data.size, pixels: [...(data.pixels as string)].map((c) => c === '1') }
    }
  } catch {
    // corrupt data – start fresh
  }
  return null
}

const saved = loadDrawing()
const size = ref<GridSize>(saved?.size ?? 32)
const pixels = ref<boolean[]>(saved?.pixels ?? Array(size.value * size.value).fill(false))

// Pixels are stored as a string of 0/1 to keep the entry small
watch(
  [size, pixels],
  () =>
    writeStorage(
      STORAGE_KEY,
      JSON.stringify({
        size: size.value,
        pixels: pixels.value.map((on) => (on ? '1' : '0')).join(''),
      }),
    ),
  { deep: true },
)

const undoStack = shallowRef<Snapshot[]>([])
const redoStack = shallowRef<Snapshot[]>([])
const canUndo = computed(() => undoStack.value.length > 0)
const canRedo = computed(() => redoStack.value.length > 0)

function snapshot(): Snapshot {
  return { size: size.value, pixels: [...pixels.value] }
}

function restore(s: Snapshot) {
  size.value = s.size
  pixels.value = s.pixels
}

// Call before every change that should be undoable as one step (a stroke, clear, resize)
function checkpoint() {
  undoStack.value = [...undoStack.value, snapshot()].slice(-MAX_HISTORY)
  redoStack.value = []
}

function undo() {
  const prev = undoStack.value.at(-1)
  if (!prev) return
  undoStack.value = undoStack.value.slice(0, -1)
  redoStack.value = [...redoStack.value, snapshot()]
  restore(prev)
}

function redo() {
  const next = redoStack.value.at(-1)
  if (!next) return
  redoStack.value = redoStack.value.slice(0, -1)
  undoStack.value = [...undoStack.value, snapshot()]
  restore(next)
}

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
  if (!pixels.value.some(Boolean)) return
  checkpoint()
  pixels.value = Array(size.value * size.value).fill(false)
}

// Rescale so the current drawing survives a size change. Each new pixel covers a block of
// old pixels (or sits inside one when growing); it's black if any of them is, so thin lines
// don't vanish when shrinking.
function setSize(next: GridSize) {
  const prev = size.value
  if (next === prev) return
  checkpoint()
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
  return {
    size,
    pixels,
    get,
    set,
    clear,
    inBounds,
    setSize,
    checkpoint,
    undo,
    redo,
    canUndo,
    canRedo,
  }
}
