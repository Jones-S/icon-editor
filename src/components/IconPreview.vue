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

// Pixel ratios your screen can show exactly: every ratio that divides yours evenly.
// On 2×: 1× and 2×. On 3×: 1× and 3×. When zoomed or scaled, only 1× (approximately).
const densities = computed(() => {
  const r = isWholeRatio.value ? ratioLabel.value : 1
  return Array.from({ length: r }, (_, i) => i + 1).filter((d) => r % d === 0)
})

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
        <figure v-for="d in densities" :key="d">
          <div class="stage" :style="{ height: `${size + 16}px` }">
            <PreviewCanvas :display-size="size / d" />
          </div>
          <figcaption>
            <strong>{{ size }} px at {{ round(size / d) }} pt</strong>
            on a {{ d }}× screen
            <em v-if="d === ratioLabel">your screen</em>
          </figcaption>
        </figure>
      </div>

      <p class="note">
        Every view shows all {{ size }} px, one screen pixel each. Pixel art stays sharp on every
        screen – only its size changes.
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
  align-items: center;
  margin-top: 4px;
  text-align: center;
  line-height: 1.3;
}

figcaption em {
  margin-top: 2px;
  padding: 0 4px;
  font-style: normal;
  background: #000;
  color: #fff;
}
</style>
