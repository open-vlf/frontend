<script setup lang='ts'>
const version = ref(import.meta.env.VITE_APP_VERSION)
</script>

<template>
  <div class="mt-4 layout-footer">
    <img
      alt="Mackenzie logo"
      height="40"
      src="https://logodownload.org/wp-content/uploads/2017/09/mackenzie-logo.png"
    >
    <span class="font-medium ml-2">© Copyright 2023 - Instituto Presbiteriano Mackenzie - v{{ version }}</span>
  </div>
</template>

<style scoped>

</style>
