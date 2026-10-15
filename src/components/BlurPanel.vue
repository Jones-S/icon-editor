<script setup lang="ts">
import { computed } from 'vue'
import { useDevicePixelRatio } from '@/composables/useDevicePixelRatio'
import { usePixelGrid } from '@/composables/usePixelGrid'
import MacWindow from './MacWindow.vue'
import PreviewCanvas from './PreviewCanvas.vue'

const { size } = usePixelGrid()
const ratio = useDevicePixelRatio()

const round = (n: number) => +n.toFixed(2)

// Both views fill the same `size` pt on a 2× screen, so both have size × 2 screen pixels.
// While designing, every pixel becomes a crisp 2 × 2 block; the shipped @1x file gets
// stretched with smoothing.
const views = computed(() => [
  { label: 'While designing', screenPx: size.value * 2, smooth: false },
  { label: 'Shipped as @1x only', screenPx: size.value * 2, smooth: true },
])

const zoom = computed(() => Math.max(1, Math.floor(160 / (size.value * 2))))
const magnifiedStage = computed(() => size.value * 2 * zoom.value + 16)

// The true-size views need 2 screen pixels per pt to be exact
const needsRetina = computed(() => ratio.value < 2)
</script>

<template>
  <MacWindow title="When Icons Get Blurry">
    <div class="blur">
      <p class="text">
        You design a {{ size }} px icon, e.g. a {{ size }} × {{ size }} frame in Figma. On a Retina
        screen you actually see {{ size }} pt = {{ size * 2 }} px, so it looks crisp. Export the
        {{ size }} px PNG and ship only that, and on the same screen it suddenly looks different:
        {{ size }} px can't fill {{ size * 2 }} px crisply, so the screen stretches it and it gets
        blurry. On a standard 1× screen it looks fine, which is why it's easy to miss.
      </p>

      <div class="views">
        <figure v-for="view in views" :key="view.label">
          <span class="who">{{ view.label }}</span>
          <div class="stage" :style="{ height: `${size + 16}px` }">
            <PreviewCanvas :display-size="size" :resolution="view.screenPx" :smooth="view.smooth" />
          </div>
          <div
            class="stage"
            :style="{ width: `${magnifiedStage}px`, height: `${magnifiedStage}px` }"
          >
            <PreviewCanvas
              :display-size="view.screenPx * zoom"
              :resolution="view.screenPx"
              :smooth="view.smooth"
            />
          </div>
          <figcaption>
            <strong>Seen on a Retina (2×) screen</strong>
            {{ size }} pt = {{ view.screenPx }} px
          </figcaption>
        </figure>
      </div>

      <p class="note">
        Top: true size ({{ size }} pt). Bottom: screen pixels magnified ×{{ zoom }}.
        <template v-if="needsRetina">
          Your screen is {{ round(ratio) }}×, so the true-size views are only approximate here.
        </template>
      </p>

      <p class="text">
        <strong>Fix:</strong> also export @2x ({{ size * 2 }} px) from the Export menu. Then Retina
        screens get real pixels instead of stretched ones.
      </p>
    </div>
  </MacWindow>
</template>

<style scoped>
.blur {
  display: grid;
  gap: 10px;
  padding: 12px;
  font-size: 12px;
}

/* let text wrap to the width of the views instead of widening the window */
.text,
.note {
  width: 0;
  min-width: 100%;
  margin: 0;
  line-height: 1.4;
}

.note {
  color: #555;
}

.views {
  display: flex;
  gap: 12px;
}

figure {
  display: grid;
  gap: 6px;
  margin: 0;
}

.who {
  font-weight: bold;
  text-align: center;
}

.stage {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  background: #e4e4e4;
}

figcaption {
  display: flex;
  flex-direction: column;
  text-align: center;
  line-height: 1.3;
}
</style>
