<script setup lang="ts">
import {
  useAuthStore as createAuthStore,
  useThemeStore as createThemeStore,
} from "@/store";

const emit = defineEmits(["menuToggle", "topbarMenuToggle"]);

const themeStore = createThemeStore();
const authStore = createAuthStore();
void authStore;

type OverlayToggle = { toggle: (event: Event) => void };

const op = ref<OverlayToggle | null>(null);
const userMenu = ref<OverlayToggle | null>(null);
const downloadVisible = ref<boolean>(false);
void downloadVisible;

function toggle(event: Event) {
  op.value?.toggle(event);
}
void toggle;

function toggleUserMenu(event: Event) {
  userMenu.value?.toggle(event);
}
void toggleUserMenu;

function redirectToGithub() {
  window.open("https://github.com/open-vlf", "_blank");
}
void redirectToGithub;

function onChangeTheme(theme: string) {
  localStorage.setItem("theme", theme);
}
void onChangeTheme;

function onMenuToggle(event: Event) {
  emit("menuToggle", event);
}
void onMenuToggle;

function onTopbarMenuToggle(event: Event) {
  emit("topbarMenuToggle", event);
}
void onTopbarMenuToggle;

onBeforeMount(() => {
  if (localStorage.getItem("theme") === "theme-light") themeStore.setLight();
  else themeStore.setDark();
});
</script>

<template>
  <DownloadDialog v-model="downloadVisible" editable />

  <div class="layout-topbar">
    <router-link to="/" class="layout-topbar-logo">
      <img
        alt="Mackenzie logo"
        src="https://logodownload.org/wp-content/uploads/2017/09/mackenzie-logo-3.png"
      />
      <span>Open VLF</span>
    </router-link>

    <button
      class="p-link layout-menu-button layout-topbar-button"
      @click="onMenuToggle"
    >
      <i class="pi pi-bars" />
    </button>

    <button
      v-styleclass="{
        selector: '@next',
        enterClass: 'hidden',
        enterActiveClass: 'scalein',
        toggleClass: 'hidden',
        leaveActiveClass: 'fadeout',
        hideOnOutsideClick: true,
      }"
      class="p-link layout-topbar-menu-button layout-topbar-button"
    >
      <i class="pi pi-ellipsis-v" />
    </button>

    <ul class="layout-topbar-menu hidden lg:flex origin-top">
      <li v-if="authStore.name">
        <Avatar
          class="button p-link layout-topbar-button2"
          shape="circle"
          :label="authStore.getUserLabel()"
          @click="toggleUserMenu"
        />
      </li>

      <li>
        <button class="p-link layout-topbar-button" @click="redirectToGithub">
          <i class="pi pi-github" />
          <span>Github</span>
        </button>
      </li>

      <li>
        <button class="p-link layout-topbar-button" @click="toggle">
          <i class="pi pi-cog" />
          <span>Settings</span>
        </button>
      </li>
    </ul>

    <OverlayPanel
      id="user_overlay_panel"
      ref="userMenu"
      append-to="body"
      style="width: 300px"
    >
      <h4>Hello, {{ authStore.name?.split(" ")[0] }}</h4>

      <p>You can manage your download information here!</p>

      <Button
        label="Manage"
        icon="pi pi-lock"
        class="w-full mt-4"
        @click="downloadVisible = true"
      />
    </OverlayPanel>

    <OverlayPanel
      id="overlay_panel"
      ref="op"
      append-to="body"
      style="width: 200px"
    >
      <h6>Theme mode</h6>
      <div class="field-radiobutton">
        <RadioButton
          id="saga"
          v-model="themeStore.themeName"
          name="layoutColorMode"
          value="theme-light"
          @change="themeStore.setLight()"
          @click="onChangeTheme('theme-light')"
        />
        <label>Light</label>
      </div>
      <div class="field-radiobutton">
        <RadioButton
          id="arya"
          v-model="themeStore.themeName"
          name="layoutColorMode"
          value="theme-dark"
          @change="themeStore.setDark()"
          @click="onChangeTheme('theme-dark')"
        />
        <label>Dark</label>
      </div>
    </OverlayPanel>
  </div>
</template>

<style scoped>
.hidden {
  display: none !important;
}

.layout-topbar-button2 {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 3rem;
  height: 3rem;
}

@media (min-width: 1024px) {
  .lg\:flex {
    display: flex !important;
  }
}
</style>
