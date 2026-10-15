<script setup lang="ts">
defineProps<{ title: string }>()
</script>

<template>
  <section class="mac-window">
    <header class="title-bar">
      <span class="title">{{ title }}</span>
    </header>
    <div class="content">
      <slot />
    </div>
  </section>
</template>

<style scoped>
.mac-window {
  background: #fff;
  border: 1px solid #000;
  box-shadow: 2px 2px 0 #000;
}

.title-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 22px;
  border-bottom: 1px solid #000;
  /* classic pinstripes */
  background: repeating-linear-gradient(#fff 0 1px, #000 1px 2px) content-box;
  padding: 4px 3px;
}

.title {
  background: #fff;
  padding: 0 10px;
  font-weight: bold;
  font-size: 13px;
  line-height: 14px;
}

.content {
  padding: 0;
}
</style>
