<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { SIZE, usePixelGrid } from '@/composables/usePixelGrid'
import MacWindow from './MacWindow.vue'

defineProps<{ title?: string }>()

const { pixels } = usePixelGrid()
const canvas = ref<HTMLCanvasElement | null>(null)

function draw() {
  const ctx = canvas.value?.getContext('2d')
  if (!ctx) return
  ctx.fillStyle = '#fff'
  ctx.fillRect(0, 0, SIZE, SIZE)
  ctx.fillStyle = '#000'
  pixels.value.forEach((on, i) => {
    if (on) ctx.fillRect(i % SIZE, Math.floor(i / SIZE), 1, 1)
  })
}

onMounted(draw)
watch(pixels, draw, { deep: true })
</script>

<template>
  <MacWindow :title="title ?? 'Preview'">
    <div class="preview">
      <canvas ref="canvas" :width="SIZE" :height="SIZE" />
    </div>
  </MacWindow>
</template>

<style scoped>
.preview {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 160px;
  height: 120px;
  background: #e4e4e4;
}

canvas {
  width: 32px;
  height: 32px;
  image-rendering: pixelated;
}
</style>
