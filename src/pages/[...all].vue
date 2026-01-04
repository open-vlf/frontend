<script setup lang='ts'>
import { useI18n as createI18n } from "vue-i18n";

const { t } = createI18n();
void t;
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
