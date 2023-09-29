<script setup lang='ts'>
const { t } = useI18n()
</script>

<template>
  <div class="text-red">
    {{ t('not_found') }}
  </div>
</template>

<route lang='yaml'>
meta:
  layout: 404
</route>
