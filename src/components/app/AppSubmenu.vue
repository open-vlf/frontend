<script setup lang='ts'>
type MenuItem = {
  badge?: string | number;
  class?: unknown;
  command?: (args: { originalEvent: Event; item: MenuItem }) => void;
  disabled?: boolean;
  icon?: string;
  items?: MenuItem[];
  label?: string;
  separator?: boolean;
  style?: unknown;
  target?: string;
  to?: unknown;
  url?: string;
  visible?: boolean | (() => boolean);
};

interface Props {
  items?: Array<MenuItem>;
  root?: boolean;
}

const { items, root } = withDefaults(defineProps<Props>(), {
  root: false,
});
void items;
void root;

const emit = defineEmits(["menuItemClick"]);

const activeIndex = ref<number | null>(null);
function onmenuItemClick(event: MouseEvent, item: MenuItem, index: number) {
  if (item.disabled) {
    event.preventDefault();
    return;
  }

  if (!item.to && !item.url) event.preventDefault();

  // execute command
  if (item.command) item.command({ originalEvent: event, item });

  activeIndex.value = index === activeIndex.value ? null : index;

  emit("menuItemClick", {
    originalEvent: event,
    item,
  });
}
void onmenuItemClick;
void activeIndex;

function visible(item: MenuItem) {
  return typeof item.visible === "function"
    ? item.visible()
    : item.visible !== false;
}
void visible;
</script>

<template>
  <ul v-if="items">
    <template v-for="(item, i) of items">
      <li
        v-if="visible(item) && !item.separator" :key="item.label || i"
        :class="[{ 'layout-menuitem-category': root, 'active-menuitem': activeIndex === i && !item.to && !item.disabled }]"
        role="none"
      >
        <template v-if="root">
          <div class="layout-menuitem-root-text">
            {{ item.label }}
          </div>
          <AppSubmenu
            :items="visible(item) && item.items"
            @menu-item-click="$emit('menuItemClick', $event)"
          />
        </template>
        <template v-else>
          <router-link
            v-if="item.to" v-ripple :to="item.to"
            class="p-ripple" :class="[item.class, { 'p-disabled': item.disabled }]" :style="item.style" :target="item.target" exact
            role="menuitem" @click="onmenuItemClick($event, item, i)"
          >
            <i :class="item.icon" />
            <span>{{ item.label }}</span>
            <i v-if="item.items" class="pi pi-fw pi-angle-down menuitem-toggle-icon" />
            <span v-if="item.badge" class="menuitem-badge">{{ item.badge }}</span>
          </router-link>
          <a
            v-if="!item.to" v-ripple :href="item.url || '#'"
            :style="item.style" class="p-ripple" :class="[item.class, { 'p-disabled': item.disabled }]"
            :target="item.target" role="menuitem" @click="onmenuItemClick($event, item, i)"
          >
            <i :class="item.icon" />
            <span>{{ item.label }}</span>
            <i v-if="item.items" class="pi pi-fw pi-angle-down menuitem-toggle-icon" />
            <span v-if="item.badge" class="menuitem-badge">{{ item.badge }}</span>
          </a>
          <transition name="layout-submenu-wrapper">
            <AppSubmenu
              v-show="activeIndex === i" :items="visible(item) && item.items"
              @menu-item-click="$emit('menuItemClick', $event)"
            />
          </transition>
        </template>
      </li>
      <li
        v-if="visible(item) && item.separator" :key="`separator${i}`" class="p-menu-separator" :style="item.style"
        role="separator"
      />
    </template>
  </ul>
</template>

<style scoped>

</style>
