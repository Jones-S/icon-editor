<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

defineProps<{ title: string }>()

const open = ref(false)
const root = ref<HTMLElement | null>(null)

function close() {
  open.value = false
}

function onDocumentClick(e: MouseEvent) {
  if (!root.value?.contains(e.target as Node)) close()
}

onMounted(() => document.addEventListener('click', onDocumentClick))
onBeforeUnmount(() => document.removeEventListener('click', onDocumentClick))
</script>

<template>
  <div ref="root" class="menu">
    <button class="menu-title" :class="{ active: open }" @click="open = !open">{{ title }}</button>
    <ul v-if="open" class="dropdown" @click="close">
      <slot />
    </ul>
  </div>
</template>

<style scoped>
.menu {
  position: relative;
}

button,
.dropdown :slotted(button) {
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
.dropdown :slotted(button:not(:disabled):hover) {
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

.dropdown :slotted(li) {
  margin: 0;
}

.dropdown :slotted(button) {
  display: flex;
  justify-content: space-between;
  gap: 24px;
  width: 100%;
  padding: 2px 14px 2px 26px;
  text-align: left;
}

.dropdown :slotted(button:disabled) {
  color: #999;
  cursor: default;
}

.dropdown :slotted(.separator) {
  margin: 2px 0;
  border-top: 1px dotted #000;
}

.dropdown :slotted(.checked)::before {
  content: '✓';
  position: absolute;
  margin-left: -18px;
}
</style>
