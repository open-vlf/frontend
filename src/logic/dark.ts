import { useDark as createDark, useToggle as createToggle } from "@vueuse/core";

export const isDark = createDark();
export const toggleDark = createToggle(isDark);
