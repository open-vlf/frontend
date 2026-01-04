<script setup lang="ts">
import { useHead as setHead } from "@vueuse/head";

setHead({
  title: "Open VLF",
  meta: [
    {
      name: "description",
      content: "Open VLF web application",
    },
  ],
});
</script>

<template>
  <div id="bar" />
  <router-view />
</template>

<style lang="scss">
@import "App.scss";

:deep(.prose) {
  max-width: 100% !important;
}
</style>
