<script setup lang='ts'>
import { usePrimeVue as createPrimeVue } from "primevue/config";
import { useToast as createToast } from "primevue/usetoast";
import { useRoute as createRoute } from "vue-router";
import { navigationMenu } from "@/logic";
import AppFooter from "../components/app/AppFooter.vue";
import AppMenu from "../components/app/AppMenu.vue";
import AppTopBar from "../components/app/AppTopbar.vue";

void navigationMenu;
void AppFooter;
void AppMenu;
void AppTopBar;

const layoutMode = ref("static");
const layoutColorMode = ref("light");
const staticMenuInactive = ref(false);
const overlayMenuActive = ref(false);
const mobileMenuActive = ref(false);
const menuClick = ref(false);
const menuActive = ref(false);

const toast = createToast();
const primeVue = createPrimeVue();
const route = createRoute();

watch(
  () => route,
  () => {
    menuActive.value = false;
    toast.removeAllGroups();
  },
);

function onWrapperClick() {
  if (!menuClick.value) {
    overlayMenuActive.value = false;
    mobileMenuActive.value = false;
  }
  menuClick.value = false;
}
void onWrapperClick;

function onMenuToggle() {
  menuClick.value = true;

  if (isDesktop()) {
    if (layoutMode.value === "overlay") {
      if (mobileMenuActive.value === true) overlayMenuActive.value = true;

      overlayMenuActive.value = !overlayMenuActive.value;
      mobileMenuActive.value = false;
    } else if (layoutMode.value === "static") {
      staticMenuInactive.value = !staticMenuInactive.value;
    }
  } else {
    mobileMenuActive.value = !mobileMenuActive.value;
  }
}
void onMenuToggle;

function onSidebarClick() {
  menuClick.value = true;
}
void onSidebarClick;

function onMenuItemClick(event: { item?: { items?: unknown[] } }) {
  if (event.item && !event.item.items) {
    overlayMenuActive.value = false;
    mobileMenuActive.value = false;
  }
}
void onMenuItemClick;

function onLayoutChange(mode: string) {
  layoutMode.value = mode;
}
void onLayoutChange;

function onLayoutColorChange(mode: string) {
  layoutColorMode.value = mode;
}
void onLayoutColorChange;

function addClass(element: HTMLElement, className: string) {
  if (element.classList) element.classList.add(className);
  else element.className += ` ${className}`;
}

function removeClass(element: HTMLElement, className: string) {
  if (element.classList) element.classList.remove(className);
  else
    element.className = element.className.replace(
      new RegExp(`(^|\\b)${className.split(" ").join("|")}(\\b|$)`, "gi"),
      " ",
    );
}

function isDesktop() {
  return window.innerWidth >= 992;
}

function isSidebarVisible() {
  if (isDesktop()) {
    if (layoutMode.value === "static") return !staticMenuInactive.value;
    else if (layoutMode.value === "overlay") return overlayMenuActive.value;
  }

  return true;
}
void isSidebarVisible;

const containerClass = computed(() => [
  "layout-wrapper",
  {
    "layout-overlay": layoutMode.value === "overlay",
    "layout-static": layoutMode.value === "static",
    "layout-static-sidebar-inactive":
      staticMenuInactive.value && layoutMode.value === "static",
    "layout-overlay-sidebar-active":
      overlayMenuActive.value && layoutMode.value === "overlay",
    "layout-mobile-sidebar-active": mobileMenuActive.value,
    "p-input-filled": primeVue.config.inputStyle === "filled",
    "p-ripple-disabled": primeVue.config.ripple === false,
    "layout-theme-light": false,
  },
]);
void containerClass;

function logo() {
  return layoutColorMode.value === "dark"
    ? "images/logo-white.svg"
    : "images/logo.svg";
}
void logo;

onBeforeUpdate(() => {
  if (mobileMenuActive.value) addClass(document.body, "body-overflow-hidden");
  else removeClass(document.body, "body-overflow-hidden");
});
</script>

<template>
  <div :class="containerClass" @click="onWrapperClick">
    <AppTopBar @menu-toggle="onMenuToggle" />
    <div class="layout-sidebar" @click="onSidebarClick">
      <AppMenu :model="navigationMenu" @menu-item-click="onMenuItemClick" />
    </div>

    <div class="layout-main-container">
      <div class="layout-main">
        <router-view />
      </div>
      <AppFooter />
    </div>
  </div>
</template>
