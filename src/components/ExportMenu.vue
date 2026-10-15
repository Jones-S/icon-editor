<script setup lang="ts">
import { usePixelGrid } from '@/composables/usePixelGrid'
import { exportPng, exportSvg } from '@/utils/exportIcon'
import MenuBarMenu from './MenuBarMenu.vue'

const { pixels, size } = usePixelGrid()
</script>

<template>
  <MenuBarMenu title="Export">
    <li>
      <button @click="exportPng(pixels, size)">PNG @1x ({{ size }}×{{ size }})</button>
    </li>
    <li>
      <button @click="exportPng(pixels, size, 2)">PNG @2x ({{ size * 2 }}×{{ size * 2 }})</button>
    </li>
    <li><button @click="exportSvg(pixels, size)">SVG</button></li>
  </MenuBarMenu>
</template>
