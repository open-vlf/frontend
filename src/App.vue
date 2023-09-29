<script setup lang='ts'>
import consola from 'consola'

import { useDataStore } from '@/store/data'

const dataStore = useDataStore()

onMounted(async () => {
  await dataStore.$load({ name: 'app-data' }).catch((error: any) => consola.log(error))
})

useHead({
  title: 'VLF CRAAM',
  meta: [
    {
      name: 'description',
      content: 'VLF CRAAM web application',
    },
  ],
})
</script>

<template>
  <div id="bar" />
  <router-view />
</template>

<style lang='scss'>
@import 'App.scss';
</style>
