<script setup lang="ts">
import { usePixelGrid } from '@/composables/usePixelGrid'
import MenuBarMenu from './MenuBarMenu.vue'

const { undo, redo, clear, canUndo, canRedo } = usePixelGrid()
</script>

<template>
  <MenuBarMenu title="Edit">
    <li>
      <button :disabled="!canUndo" @click="undo">Undo <span>⌘Z</span></button>
    </li>
    <li>
      <button :disabled="!canRedo" @click="redo">Redo <span>⇧⌘Z</span></button>
    </li>
    <li class="separator" />
    <li><button @click="clear">Clear</button></li>
  </MenuBarMenu>
</template>
