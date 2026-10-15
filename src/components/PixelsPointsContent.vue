<script setup lang="ts">
import { usePixelGrid } from '@/composables/usePixelGrid'

const { size } = usePixelGrid()
</script>

<template>
  <article class="pixels-points">
    <dl class="terms">
      <dt>px (pixel)</dt>
      <dd>One dot: of your image, or of a screen. Your icon is {{ size }} × {{ size }} px.</dd>
      <dt>pt (point)</dt>
      <dd>
        A unit of size on screen. Apps and web pages lay out everything in pt, so an icon looks
        about the same size on every screen. Also called device-independent pixel: “effective pixel”
        on Windows, “dp” on Android, “px” in CSS.
      </dd>
      <dt>Pixel ratio</dt>
      <dd>How many px a screen uses per pt: 1× on standard screens, 2× on Retina / HiDPI.</dd>
    </dl>

    <div class="diagram">
      <figure>
        <svg viewBox="0 0 61 61" width="61" height="61" aria-hidden="true">
          <rect x="0.5" y="0.5" width="60" height="60" />
        </svg>
        <figcaption><strong>1×</strong>1 pt = 1 px</figcaption>
      </figure>
      <figure>
        <svg viewBox="0 0 61 61" width="61" height="61" aria-hidden="true">
          <rect x="0.5" y="0.5" width="60" height="60" />
          <path d="M30.5 0.5v60M0.5 30.5h60" />
        </svg>
        <figcaption><strong>2×</strong>1 pt = 2 × 2 px</figcaption>
      </figure>
    </div>

    <h3>Why icons come in @1x and @2x</h3>
    <p>
      Your {{ size }} px drawing is a {{ size }} pt icon. It covers {{ size }} × {{ size }} px on a
      1× screen and {{ size * 2 }} × {{ size * 2 }} px on a 2× screen. Export both files: @1x ({{
        size
      }}
      px) and @2x ({{ size * 2 }} px). Without the @2x file, a 2× screen stretches the @1x file
      smoothly and it looks blurry. That's why the same app looks crisp on a laptop's Retina screen
      and softer on a standard external monitor.
    </p>
    <p>
      In vector tools @2x also adds detail. In pixel art it only doubles the pixels: for more
      detail, draw a separate {{ size * 2 }} px version.
    </p>

    <h3>Designing on a Retina screen</h3>
    <p>
      Your screen squeezes 2 px into every pt, so tiny details still look good when the icon is
      small. A 1× screen has half the pixels in each direction for the same size, and those details
      disappear. Check the advanced preview before you trust a small icon.
    </p>

    <h3>Display scaling</h3>
    <p>
      Many displays are set to a scaled size. Then 1 pt is no longer a whole number of px, and icons
      may look slightly soft. The system still picks the closest version, so @1x and @2x remain what
      you design.
    </p>
  </article>
</template>

<style scoped>
.pixels-points {
  padding: 12px 20px 16px;
  font-size: 13px;
  line-height: 1.45;
}

.terms {
  display: grid;
  grid-template-columns: max-content 1fr;
  gap: 6px 12px;
  margin: 0 0 16px;
}

dt {
  font-weight: bold;
}

dd {
  margin: 0;
}

.diagram {
  display: flex;
  justify-content: center;
  gap: 24px;
}

figure {
  margin: 0;
  text-align: center;
}

figcaption {
  display: flex;
  flex-direction: column;
  font-size: 11px;
}

svg {
  shape-rendering: crispEdges;
}

svg rect,
svg path {
  fill: none;
  stroke: #000;
}

h3 {
  margin: 16px 0 4px;
  font-size: 13px;
}

p {
  margin: 0;
}

p + p {
  margin-top: 6px;
}
</style>
