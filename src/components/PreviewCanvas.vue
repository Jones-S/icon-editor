<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { usePixelGrid } from '@/composables/usePixelGrid'
import { drawPixels, renderForScreen } from '@/utils/exportIcon'

// displaySize is in CSS pixels (points). resolution is how many pixels the image has;
// by default the drawing's own size, smaller values shrink it the way a 1× screen would.
const props = defineProps<{ displaySize: number; resolution?: number }>()

const { pixels, size } = usePixelGrid()
const canvas = ref<HTMLCanvasElement | null>(null)
const bitmapSize = computed(() => props.resolution ?? size.value)

function draw() {
  const ctx = canvas.value?.getContext('2d')
  if (!ctx) return
  if (bitmapSize.value === size.value) drawPixels(ctx, pixels.value, size.value)
  else ctx.drawImage(renderForScreen(pixels.value, size.value, bitmapSize.value), 0, 0)
}

onMounted(draw)
// flush: 'post' so the canvas is resized before redrawing
watch([pixels, size, bitmapSize], draw, { deep: true, flush: 'post' })
</script>

<template>
  <canvas
    ref="canvas"
    :width="bitmapSize"
    :height="bitmapSize"
    :style="{ width: `${displaySize}px`, height: `${displaySize}px` }"
  />
</template>

<style scoped>
canvas {
  display: block;
  image-rendering: pixelated;
}
</style>
