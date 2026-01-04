<script setup lang='ts'>
import AppSubmenu from "./AppSubmenu.vue";

void AppSubmenu;

const { model } = defineProps<{
  model: Array<unknown>;
}>();
void model;

const emit = defineEmits(["menuItemClick"]);

function onmenuItemClick(event: Event) {
  emit("menuItemClick", event);
}
void onmenuItemClick;
</script>

<template>
  <div class="layout-menu-container">
    <AppSubmenu :items="model" class="layout-menu" :root="true" @menu-item-click="onmenuItemClick" />
  </div>
</template>

<style scoped>

</style>
