<script setup lang="ts">
import { SIZES, usePixelGrid } from '@/composables/usePixelGrid'
import MenuBarMenu from './MenuBarMenu.vue'

const { size, setSize } = usePixelGrid()
</script>

<template>
  <MenuBarMenu title="Size">
    <li v-for="s in SIZES" :key="s">
      <button :class="{ checked: s === size }" @click="setSize(s)">{{ s }} × {{ s }}</button>
    </li>
  </MenuBarMenu>
</template>
