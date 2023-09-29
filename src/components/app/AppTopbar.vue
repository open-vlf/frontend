<script setup lang='ts'>
import { useThemeStore } from '@/store'

const emit = defineEmits(['menuToggle', 'topbarMenuToggle'])

const themeStore = useThemeStore()
const op = ref<any>(null)

function toggle(event: any) {
  op.value.toggle(event)
}

function redirectToGithub(event: any) {
  window.open('https://github.com/vlf-craam', '_blank')
}

function onChangeTheme(theme: string) {
  localStorage.setItem('theme', theme)
}

function onMenuToggle(event: any) {
  emit('menuToggle', event)
}

function onTopbarMenuToggle(event: any) {
  emit('topbarMenuToggle', event)
}

onBeforeMount(() => {
  if (localStorage.getItem('theme') === 'theme-light')
    themeStore.setLight()
  else
    themeStore.setDark()
})
</script>

<template>
  <div class="layout-topbar">
    <router-link to="/" class="layout-topbar-logo">
      <img
        alt="Mackenzie logo"
        src="https://logodownload.org/wp-content/uploads/2017/09/mackenzie-logo-3.png"
      >
      <span>Open VLF CRAAM</span>
    </router-link>
    <button class="p-link layout-menu-button layout-topbar-button" @click="onMenuToggle">
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
      <!--      <li> -->
      <!--        <button class="p-link layout-topbar-button"> -->
      <!--          <i class="pi pi-user"/> -->
      <!--          <span>Profile</span> -->
      <!--        </button> -->
      <!--      </li> -->
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

    <OverlayPanel id="overlay_panel" ref="op" append-to="body" style="width: 200px">
      <h6>Theme mode</h6>
      <div class="field-radiobutton">
        <RadioButton
          id="saga" v-model="themeStore.themeName" name="layoutColorMode" value="theme-light"
          @change="themeStore.setLight()"
          @click="onChangeTheme('theme-light')"
        />
        <label>Light</label>
      </div>
      <div class="field-radiobutton">
        <RadioButton
          id="arya" v-model="themeStore.themeName" name="layoutColorMode" value="theme-dark"
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

@media (min-width: 1024px) {
  .lg\:flex {
    display: flex !important;
  }
}
</style>
