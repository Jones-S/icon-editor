<script setup lang="ts">
import { usePixelGrid } from '@/composables/usePixelGrid'
import ExportMenu from '@/components/ExportMenu.vue'
import IconEditor from '@/components/IconEditor.vue'
import IconPreview from '@/components/IconPreview.vue'
import MacWindow from '@/components/MacWindow.vue'
import SizeMenu from '@/components/SizeMenu.vue'

const { clear } = usePixelGrid()
</script>

<template>
  <nav class="menu-bar">
    <span class="apple"></span>
    <SizeMenu />
    <ExportMenu />
    <button class="menu-item" @click="clear">Clear</button>
  </nav>
  <main class="desktop">
    <MacWindow title="Icon Editor">
      <IconEditor />
    </MacWindow>
    <IconPreview title="icon" />
  </main>
</template>

<style>
* {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  min-height: 100%;
}

body {
  font-family:
    Chicago,
    Charcoal,
    'Geneva',
    -apple-system,
    system-ui,
    sans-serif;
  color: #000;
  /* 50% dither desktop pattern */
  background-color: #fff;
  background-image: conic-gradient(#888 25%, #fff 0 50%, #888 0 75%, #fff 0);
  background-size: 2px 2px;
}
</style>

<style scoped>
.menu-bar {
  display: flex;
  align-items: center;
  gap: 4px;
  height: 24px;
  padding: 0 12px;
  background: #fff;
  border-bottom: 1px solid #000;
  font-size: 14px;
  font-weight: bold;
}

.apple {
  padding: 0 10px;
}

.menu-item {
  font: inherit;
  border: 0;
  background: none;
  padding: 2px 10px;
  cursor: pointer;
}

.menu-item:active {
  background: #000;
  color: #fff;
}

.desktop {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 24px;
  padding: 24px 16px;
}
</style>
