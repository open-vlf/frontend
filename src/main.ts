// register vue composition api globally

import { setupLayouts } from "virtual:generated-layouts";
import generatedRoutes from "virtual:generated-pages";
import { ViteSSG } from "vite-ssg";
import App from "./App.vue";
import "uno.css";
import "@sfxcode/formkit-primevue/dist/sass/formkit-primevue.scss";
import "@sfxcode/formkit-primevue/dist/sass/formkit-prime-inputs.scss";

const routes = setupLayouts(generatedRoutes);

export const createApp = ViteSSG(App, { routes }, (ctx) => {
  // install all modules under `modules/`
  type Module = { install?: (context: unknown) => void };

  Object.values(import.meta.globEager("./modules/*.ts")).forEach((mod) => {
    (mod as Module).install?.(ctx);
  });
});
