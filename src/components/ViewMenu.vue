<script setup lang="ts">
import { useSettings } from '@/composables/useSettings'
import MenuBarMenu from './MenuBarMenu.vue'

const { advanced } = useSettings()
</script>

<template>
  <MenuBarMenu title="View">
    <li>
      <button :class="{ checked: advanced }" @click="advanced = !advanced">Advanced Preview</button>
    </li>
  </MenuBarMenu>
</template>
