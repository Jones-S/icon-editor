<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'
import { usePixelGrid } from '@/composables/usePixelGrid'
import { useSettings } from '@/composables/useSettings'
import BlurPanel from '@/components/BlurPanel.vue'
import EditMenu from '@/components/EditMenu.vue'
import ExportMenu from '@/components/ExportMenu.vue'
import IconEditor from '@/components/IconEditor.vue'
import IconPreview from '@/components/IconPreview.vue'
import MacWindow from '@/components/MacWindow.vue'
import PixelsPointsContent from '@/components/PixelsPointsContent.vue'
import SizeMenu from '@/components/SizeMenu.vue'
import ViewMenu from '@/components/ViewMenu.vue'

const { undo, redo } = usePixelGrid()
const { advanced } = useSettings()

// ⌘Z / Ctrl+Z undo, ⇧⌘Z / Ctrl+Shift+Z / Ctrl+Y redo
function onKeydown(e: KeyboardEvent) {
  if (!(e.metaKey || e.ctrlKey) || e.altKey) return
  const key = e.key.toLowerCase()
  if (key === 'z') {
    e.preventDefault()
    if (e.shiftKey) redo()
    else undo()
  } else if (key === 'y' && e.ctrlKey) {
    e.preventDefault()
    redo()
  }
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <nav class="menu-bar">
    <span class="apple"></span>
    <EditMenu />
    <SizeMenu />
    <ViewMenu />
    <ExportMenu />
  </nav>
  <main class="desktop">
    <MacWindow title="Icon Editor">
      <IconEditor />
    </MacWindow>
    <div class="side">
      <IconPreview />
      <BlurPanel v-if="advanced" />
      <MacWindow v-if="advanced" title="Pixels & Points" class="info-window">
        <PixelsPointsContent />
      </MacWindow>
    </div>
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

.side {
  display: flex;
  flex: 1 1 300px;
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;
  min-width: 0;
  max-width: 480px;
}

.desktop {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 24px;
  padding: 24px 16px;
}
</style>
