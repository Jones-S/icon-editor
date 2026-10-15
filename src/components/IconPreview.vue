<script setup lang="ts">
import { computed } from 'vue'
import { useDevicePixelRatio } from '@/composables/useDevicePixelRatio'
import { usePixelGrid } from '@/composables/usePixelGrid'
import { useSettings } from '@/composables/useSettings'
import MacWindow from './MacWindow.vue'
import PreviewCanvas from './PreviewCanvas.vue'

defineProps<{ title?: string }>()

const { size } = usePixelGrid()
const { advanced } = useSettings()
const ratio = useDevicePixelRatio()

const round = (n: number) => +n.toFixed(2)
const ratioLabel = computed(() => round(ratio.value))
const isWholeRatio = computed(() => Number.isInteger(ratioLabel.value))
const isHighDensity = computed(() => ratio.value >= 1.5)

// Size of the drawing when shown pixel for pixel on your screen, and how many pixels
// a 1× screen has for that same size
const actualPt = computed(() => round(size.value / ratio.value))
const standardPx = computed(() => Math.max(1, Math.round(size.value / ratio.value)))

// window.screen is in pt; reading ratio makes this update on zoom or screen change
const screenSize = computed(() => {
  const r = ratio.value
  const { width, height } = window.screen
  return { pt: `${width} × ${height}`, px: `${Math.round(width * r)} × ${Math.round(height * r)}` }
})
</script>

<template>
  <MacWindow :title="title ?? 'Preview'">
    <div v-if="!advanced" class="preview">
      <PreviewCanvas :display-size="size" />
    </div>

    <div v-else class="advanced">
      <p class="screen">
        Your screen: <strong>{{ ratioLabel }}×</strong> · {{ screenSize.pt }} pt =
        {{ screenSize.px }} px
      </p>
      <p v-if="!isWholeRatio" class="note warning">
        ⚠ Not a whole number: browser zoom or display scaling. Press ⌘0 / Ctrl 0 to reset zoom.
      </p>

      <div class="tiles">
        <figure>
          <div class="stage" :style="{ height: `${size + 16}px` }">
            <PreviewCanvas :display-size="size" />
          </div>
          <figcaption>
            <strong>{{ size }} px at {{ size }} pt</strong>
            how a 1× screen shows it
          </figcaption>
        </figure>

        <template v-if="isHighDensity">
          <figure>
            <div class="stage" :style="{ height: `${size + 16}px` }">
              <PreviewCanvas :display-size="actualPt" />
            </div>
            <figcaption>
              <strong>{{ size }} px at {{ actualPt }} pt</strong>
              your screen, every pixel
            </figcaption>
          </figure>
          <figure>
            <div class="stage" :style="{ height: `${size + 16}px` }">
              <PreviewCanvas :display-size="actualPt" :resolution="standardPx" />
            </div>
            <figcaption>
              <strong>{{ standardPx }} px at {{ actualPt }} pt</strong>
              same size on a 1× screen
            </figcaption>
          </figure>
        </template>
      </div>

      <p v-if="isHighDensity" class="note">
        Your screen fits {{ size }} px into {{ actualPt }} pt, so fine details look good here. A 1×
        screen has only {{ standardPx }} px for that size, and they get lost. Judge your icon by the
        first view.
      </p>
      <p v-else class="note">
        This is exactly what 1× screens show. On a 2× (Retina) screen, the @2x export keeps it just
        as sharp.
      </p>
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

.advanced {
  display: grid;
  gap: 8px;
  padding: 12px;
  font-size: 12px;
}

p {
  margin: 0;
}

/* let notes wrap to the width of the tiles instead of widening the window */
.note {
  width: 0;
  min-width: 100%;
  line-height: 1.4;
}

.warning {
  font-weight: bold;
}

.tiles {
  display: flex;
  gap: 12px;
}

figure {
  margin: 0;
}

.stage {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 112px;
  padding: 8px;
  background: #e4e4e4;
}

figcaption {
  display: flex;
  flex-direction: column;
  margin-top: 4px;
  text-align: center;
  line-height: 1.3;
}
</style>
