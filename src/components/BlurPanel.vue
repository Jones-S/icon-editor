<script setup lang="ts">
import { computed, ref } from 'vue'
import { useDevicePixelRatio } from '@/composables/useDevicePixelRatio'
import { usePixelGrid } from '@/composables/usePixelGrid'
import MacWindow from './MacWindow.vue'
import PreviewCanvas from './PreviewCanvas.vue'

type ScenarioId = 'retina-to-1x' | 'missing-2x' | 'scaled-125' | 'scaled-150'

const SCENARIOS: { id: ScenarioId; label: string }[] = [
  { id: 'retina-to-1x', label: 'Retina design' },
  { id: 'missing-2x', label: 'No @2x' },
  { id: 'scaled-125', label: '125 % display' },
  { id: 'scaled-150', label: '150 % display' },
]

const { size } = usePixelGrid()
const ratio = useDevicePixelRatio()

const scenario = ref<ScenarioId>('retina-to-1x')
const isScaled = computed(() => scenario.value.startsWith('scaled'))
const factor = computed(() => (scenario.value === 'scaled-125' ? 1.25 : 1.5))

const round = (n: number) => +n.toFixed(2)

// Each view: how many pixels the image has (resolution) and how big it is in pt.
// "theirs" is resized with smoothing, like systems and browsers do.
const views = computed(() => {
  const s = size.value
  if (scenario.value === 'retina-to-1x') {
    return {
      yours: {
        resolution: s,
        pt: s / 2,
        caption: `${s} px at ${s / 2} pt`,
        where: 'your Retina screen',
      },
      theirs: {
        resolution: s / 2,
        pt: s / 2,
        caption: `${s / 2} px at ${s / 2} pt`,
        where: 'a 1× screen',
      },
    }
  }
  if (scenario.value === 'missing-2x') {
    return {
      yours: { resolution: s, pt: s, caption: `${s} px at ${s} pt`, where: 'as designed' },
      theirs: {
        resolution: s * 2,
        pt: s,
        caption: `stretched to ${s * 2} px`,
        where: 'a 2× screen',
      },
    }
  }
  const stretched = Math.round(s * factor.value)
  return {
    yours: { resolution: s, pt: s, caption: `${s} px at ${s} pt`, where: 'as designed' },
    theirs: {
      resolution: stretched,
      pt: s,
      caption: `stretched to ${stretched} px`,
      where: `a ${factor.value * 100} % screen`,
    },
  }
})

// One zoom for every scenario so the magnified views never change size when switching
const zoom = computed(() => Math.max(1, Math.floor(160 / (size.value * 2))))
const magnifiedStage = computed(() => size.value * 2 * zoom.value + 16)

// The true-size views of the first two scenarios need 2 screen pixels per pt to be exact
const needsRetina = computed(() => !isScaled.value && ratio.value < 2)
</script>

<template>
  <MacWindow title="When Icons Get Blurry">
    <div class="blur">
      <div class="segmented" role="group" aria-label="Scenario">
        <button
          v-for="s in SCENARIOS"
          :key="s.id"
          :class="{ selected: s.id === scenario }"
          :aria-pressed="s.id === scenario"
          @click="scenario = s.id"
        >
          {{ s.label }}
        </button>
      </div>

      <div class="intro">
        <p v-if="scenario === 'retina-to-1x'" class="text">
          You design a {{ size / 2 }} pt icon in Figma on a Retina screen. Your screen draws it with
          {{ size }} px, so curves and diagonals look smooth. Exported as a {{ size / 2 }} px PNG
          for a standard monitor, the same shapes get only {{ size / 2 }} px and turn soft.
        </p>
        <p v-else-if="scenario === 'missing-2x'" class="text">
          An app or website ships only the {{ size }} px file. A 2× screen needs {{ size * 2 }} px
          for the same {{ size }} pt, so it stretches the file and smooths it.
        </p>
        <p v-else class="text">
          Windows at 125 % or 150 %, or a non-default display size on a Mac: 1 pt is no longer a
          whole number of px, so every icon gets resized by an odd factor.
        </p>
      </div>

      <div class="views">
        <figure v-for="(view, key) in views" :key="key">
          <span class="who">{{ key === 'yours' ? 'You see' : 'They see' }}</span>
          <div class="stage" :style="{ height: `${size + 16}px` }">
            <PreviewCanvas
              :display-size="view.pt"
              :resolution="view.resolution"
              :smooth="key === 'theirs'"
            />
          </div>
          <div
            class="stage"
            :style="{ width: `${magnifiedStage}px`, height: `${magnifiedStage}px` }"
          >
            <PreviewCanvas
              :display-size="view.resolution * zoom"
              :resolution="view.resolution"
              :smooth="key === 'theirs'"
            />
          </div>
          <figcaption>
            <strong>{{ view.caption }}</strong>
            {{ view.where }}
          </figcaption>
        </figure>
      </div>

      <p class="note">
        Top: true size ({{ round(views.theirs.pt) }} pt). Bottom: screen pixels magnified ×{{
          zoom
        }}.
        <template v-if="needsRetina">
          Your screen is {{ round(ratio) }}×, so the true-size views are only approximate here.
        </template>
      </p>

      <p class="text fix">
        <strong>Fix: </strong>
        <template v-if="scenario === 'retina-to-1x'">
          check icons at their real pixel size. In a pixel editor like this one every pixel you draw
          is a real one, so nothing gets lost.
        </template>
        <template v-else-if="scenario === 'missing-2x'">
          also export @2x – the Export menu has it.
        </template>
        <template v-else>
          you can't fully avoid it. Bold shapes survive best, 1 px hairlines suffer most.
        </template>
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

.segmented {
  display: flex;
  justify-self: start;
  border: 1px solid #000;
}

.segmented button {
  padding: 2px 6px;
  white-space: nowrap;
  border: 0;
  border-left: 1px solid #000;
  background: #fff;
  font: inherit;
  cursor: pointer;
}

.segmented button:first-child {
  border-left: 0;
}

.segmented button.selected {
  background: #000;
  color: #fff;
}

/* reserve room for the longest text so the window doesn't jump between scenarios */
.intro {
  min-height: 5.6em;
}

.fix,
.note {
  min-height: 4.2em;
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
