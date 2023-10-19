<script setup lang="ts">
import { useAuthStore, useThemeStore } from "@/store";

const emit = defineEmits(["menuToggle", "topbarMenuToggle"]);

const themeStore = useThemeStore();
const authStore = useAuthStore();

const op = ref<any>(null);
const userMenu = ref<any>(null);
const downloadVisible = ref<boolean>(false);

function toggle(event: any) {
  op.value.toggle(event);
}

function toggleUserMenu(event: any) {
  userMenu.value.toggle(event);
}

function redirectToGithub(event: any) {
  window.open("https://github.com/vlf-craam", "_blank");
}

function onChangeTheme(theme: string) {
  localStorage.setItem("theme", theme);
}

function onMenuToggle(event: any) {
  emit("menuToggle", event);
}

function onTopbarMenuToggle(event: any) {
  emit("topbarMenuToggle", event);
}

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
