import { defineStore } from "pinia";

export function updateTheme(name: string) {
  const relElements = Array.prototype.slice.call(
    document.getElementsByTagName("link"),
  );
  relElements.forEach((element: HTMLElement) => {
    const href = element.getAttribute("href");
    if (href?.includes("/assets/styles/"))
      element.setAttribute(
        "href",
        `https://open-vlf.web.app/assets/styles/${name}.css`,
      );
  });
}

export const useThemeStore = defineStore("theme", {
  state: () => ({
    themeName: localStorage.getItem("theme") ?? "theme-light",
  }),
  getters: {
    theme: (state) => {
      return `${state.themeName}`;
    },
    isDarkMode: (state) => state.themeName === "theme-dark",
  },
  actions: {
    setDark() {
      this.themeName = "theme-dark";
      updateTheme(this.themeName);
    },
    setLight() {
      this.themeName = "theme-light";
      updateTheme(this.themeName);
    },
  },
});
