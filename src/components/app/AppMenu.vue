<script setup lang='ts'>
import AppSubmenu from './AppSubmenu.vue'

const props = defineProps<{
  model: Array<any>
}>()

const emit = defineEmits(['menuItemClick'])

function onmenuItemClick(event: any) {
  emit('menuItemClick', event)
}
</script>

<template>
  <div class="layout-menu-container">
    <AppSubmenu :items="model" class="layout-menu" :root="true" @menu-item-click="onmenuItemClick" />
  </div>
</template>

<style scoped>

</style>
