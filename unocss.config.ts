import { presetTypography } from "@unocss/preset-typography";
import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetUno,
} from "unocss";

export function createConfig({ strict = true, dev = true } = {}) {
  return defineConfig({
    envMode: dev ? "dev" : "build",
    theme: {
      fontFamily: {
        sans: "'Inter', sans-serif",
        mono: "'Fira Code', monospace",
      },
    },
    presets: [
      presetAttributify({ strict }),
      presetUno(),
      presetIcons({
        collections: {
          mdi: () =>
            import("@iconify/json/json/mdi.json").then(
              (i) => i.default as unknown,
            ),
          twemoji: () =>
            import("@iconify/json/json/twemoji.json").then(
              (i) => i.default as unknown,
            ),
        },
      }),
      presetTypography(),
    ],
  });
}

export default createConfig();
