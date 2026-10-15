<script setup lang="ts">
import { ref } from 'vue'
import { usePixelGrid } from '@/composables/usePixelGrid'

const { size, pixels, get, set } = usePixelGrid()

const gridEl = ref<HTMLElement | null>(null)
let painting = false
let paintValue = true
let last: { x: number; y: number } | null = null

function cellAt(e: PointerEvent) {
  const rect = gridEl.value!.getBoundingClientRect()
  return {
    x: Math.floor(((e.clientX - rect.left) / rect.width) * size.value),
    y: Math.floor(((e.clientY - rect.top) / rect.height) * size.value),
  }
}

// Bresenham line so fast drags don't leave gaps
function paintLine(x0: number, y0: number, x1: number, y1: number) {
  const dx = Math.abs(x1 - x0)
  const dy = -Math.abs(y1 - y0)
  const sx = x0 < x1 ? 1 : -1
  const sy = y0 < y1 ? 1 : -1
  let err = dx + dy
  for (;;) {
    set(x0, y0, paintValue)
    if (x0 === x1 && y0 === y1) break
    const e2 = 2 * err
    if (e2 >= dy) {
      err += dy
      x0 += sx
    }
    if (e2 <= dx) {
      err += dx
      y0 += sy
    }
  }
}

function onPointerDown(e: PointerEvent) {
  if (e.button !== 0) return
  const { x, y } = cellAt(e)
  paintValue = !get(x, y)
  painting = true
  last = { x, y }
  set(x, y, paintValue)
  gridEl.value!.setPointerCapture(e.pointerId)
}

function onPointerMove(e: PointerEvent) {
  if (!painting || !last) return
  const { x, y } = cellAt(e)
  if (x === last.x && y === last.y) return
  paintLine(last.x, last.y, x, y)
  last = { x, y }
}

function stop() {
  painting = false
  last = null
}
</script>

<template>
  <div
    ref="gridEl"
    class="grid"
    :style="{ gridTemplateColumns: `repeat(${size}, 1fr)` }"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="stop"
    @pointercancel="stop"
    @lostpointercapture="stop"
  >
    <div v-for="(on, i) in pixels" :key="i" class="cell" :class="{ on }" />
  </div>
</template>

<style scoped>
.grid {
  display: grid;
  width: min(70vh, calc(100vw - 32px));
  aspect-ratio: 1;
  border-top: 1px solid #b8b8b8;
  border-left: 1px solid #b8b8b8;
  touch-action: none;
  user-select: none;
  cursor: crosshair;
}

.cell {
  background: #fff;
  box-shadow: inset -1px -1px 0 #b8b8b8;
}

.cell.on {
  background: #000;
  box-shadow: inset -1px -1px 0 #2a2a2a;
}
</style>
