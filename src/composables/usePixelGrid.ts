import { ref } from 'vue'

export const SIZE = 32

const pixels = ref<boolean[]>(Array(SIZE * SIZE).fill(false))

function inBounds(x: number, y: number) {
  return x >= 0 && x < SIZE && y >= 0 && y < SIZE
}

function get(x: number, y: number) {
  return pixels.value[y * SIZE + x] ?? false
}

function set(x: number, y: number, value: boolean) {
  if (!inBounds(x, y)) return
  const i = y * SIZE + x
  if (pixels.value[i] !== value) pixels.value[i] = value
}

function clear() {
  pixels.value = Array(SIZE * SIZE).fill(false)
}

export function usePixelGrid() {
  return { pixels, get, set, clear, inBounds }
}
