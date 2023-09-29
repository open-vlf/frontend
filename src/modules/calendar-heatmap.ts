import VueCalendarHeatmap from 'vue3-calendar-heatmap'

import type { UserModule } from '@/types'

export const install: UserModule = ({ app }) => {
  app.use(VueCalendarHeatmap)
}
