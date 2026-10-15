<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { usePixelGrid } from '@/composables/usePixelGrid'
import { exportPng, exportSvg } from '@/utils/exportIcon'

const { pixels } = usePixelGrid()
const open = ref(false)
const root = ref<HTMLElement | null>(null)

function choose(kind: 'png' | 'svg') {
  open.value = false
  if (kind === 'png') exportPng(pixels.value)
  else exportSvg(pixels.value)
}

function onDocumentClick(e: MouseEvent) {
  if (!root.value?.contains(e.target as Node)) open.value = false
}

onMounted(() => document.addEventListener('click', onDocumentClick))
onBeforeUnmount(() => document.removeEventListener('click', onDocumentClick))
</script>

<template>
  <div ref="root" class="menu">
    <button class="menu-title" :class="{ active: open }" @click="open = !open">Export</button>
    <ul v-if="open" class="dropdown">
      <li><button @click="choose('png')">PNG (32×32)</button></li>
      <li><button @click="choose('svg')">SVG</button></li>
    </ul>
  </div>
</template>

<style scoped>
.menu {
  position: relative;
}

button {
  font: inherit;
  border: 0;
  background: none;
  color: inherit;
  cursor: pointer;
}

.menu-title {
  padding: 2px 10px;
}

.menu-title.active,
.dropdown button:hover {
  background: #000;
  color: #fff;
}

.dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 10;
  min-width: 140px;
  margin: 0;
  padding: 2px 0;
  list-style: none;
  background: #fff;
  border: 1px solid #000;
  box-shadow: 2px 2px 0 #000;
}

.dropdown button {
  display: block;
  width: 100%;
  padding: 2px 14px;
  text-align: left;
}
</style>
