<script setup lang="ts">
import { usePixelGrid } from '@/composables/usePixelGrid'
import { exportPng, exportSvg } from '@/utils/exportIcon'
import MenuBarMenu from './MenuBarMenu.vue'

const { pixels, size } = usePixelGrid()
</script>

<template>
  <MenuBarMenu title="Export">
    <li>
      <button @click="exportPng(pixels, size)">PNG ({{ size }}×{{ size }})</button>
    </li>
    <li><button @click="exportSvg(pixels, size)">SVG</button></li>
  </MenuBarMenu>
</template>
