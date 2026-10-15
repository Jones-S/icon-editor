<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { usePixelGrid } from '@/composables/usePixelGrid'
import { drawPixels } from '@/utils/exportIcon'
import MacWindow from './MacWindow.vue'

defineProps<{ title?: string }>()

const { pixels, size } = usePixelGrid()
const canvas = ref<HTMLCanvasElement | null>(null)

function draw() {
  const ctx = canvas.value?.getContext('2d')
  if (ctx) drawPixels(ctx, pixels.value, size.value)
}

onMounted(draw)
// flush: 'post' so the canvas is resized before redrawing
watch([pixels, size], draw, { deep: true, flush: 'post' })
</script>

<template>
  <MacWindow :title="title ?? 'Preview'">
    <div class="preview">
      <canvas
        ref="canvas"
        :width="size"
        :height="size"
        :style="{ width: `${size}px`, height: `${size}px` }"
      />
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
  image-rendering: pixelated;
}
</style>
