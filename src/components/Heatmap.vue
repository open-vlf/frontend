<script setup lang='ts'>
import * as helpers from "chart.js/helpers";
import "chartjs-adapter-date-fns";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";
import { ref } from "vue";
import { noZoneDate } from "@/utils";

type MatrixDatum = {
  d: string;
  fullDate: Date;
  v: number;
};

type MatrixDataset = {
  data: Array<MatrixDatum | undefined>;
};

type MatrixContext = {
  chart: {
    chartArea?: {
      right: number;
      left: number;
      top: number;
      bottom: number;
    };
  };
  dataset: MatrixDataset;
  dataIndex: number;
};

type TooltipContextItem = {
  raw: {
    fullDate: Date;
  };
  dataset: MatrixDataset;
  dataIndex: number;
};

type ClickContext = {
  chart: {
    tooltip: {
      dataPoints: Array<{
        raw: {
          d: string;
          fullDate: Date;
          v: number;
        };
      }>;
    };
  };
};

const props = defineProps({
  data: {
    type: Array<object>,
    required: true,
  },
});

const emit =
  defineEmits<(e: "onSelectDate", date: Date, records: number) => void>();

const data = ref({
  datasets: [
    {
      label: "Matrix",
      data: props.data,
      borderWidth: 1,
      hoverBackgroundColor: "red",
      hoverBorderColor: "white",
      width(c: MatrixContext) {
        const a = c.chart.chartArea || {};
        return (a.right - a.left) / 53 - 1;
      },
      height(c: MatrixContext) {
        const a = c.chart.chartArea || {};
        return (a.bottom - a.top) / 7 - 1;
      },
      backgroundColor(c: MatrixContext) {
        if (c.dataset.data[c.dataIndex]) {
          const value = c.dataset.data[c.dataIndex].v;
          const alpha = value ? (10 + value) / 60 : 0;

          return helpers.color("green").alpha(alpha).rgbString();
        }

        return helpers.color("transparent").rgbString();
      },
      borderColor(c: MatrixContext) {
        if (c.dataset.data[c.dataIndex]) {
          const value = c.dataset.data[c.dataIndex].v;
          const alpha = (10 + value) / 60;
          return helpers.color("green").alpha(alpha).darken(0.3).rgbString();
        }

        return helpers.color("transparent").rgbString();
      },
    },
  ],
});

const options = ref({
  aspectRatio: 6.5,
  onClick: (e: ClickContext) => {
    const date = noZoneDate(e.chart.tooltip.dataPoints[0].raw.d);

    emit("onSelectDate", date, e.chart.tooltip.dataPoints[0].raw.v);
  },
  plugins: {
    legend: false,
    tooltip: {
      displayColors: false,
      callbacks: {
        title(context: TooltipContextItem[]) {
          return format(context[0].raw.fullDate, "MMMM dd, yyyy");
        },
        label(context: TooltipContextItem) {
          const v = context.dataset.data[context.dataIndex];
          return [`Records: ${v.v}`];
        },
      },
    },
  },
  scales: {
    y: {
      type: "time",
      offset: true,
      adapters: {
        date: {
          locale: enUS,
        },
      },
      time: {
        unit: "day",
        round: "day",
        isoWeekday: 1,
        parser: "i",
        displayFormats: {
          day: "iiiiii",
        },
      },
      reverse: true,
      position: "right",
      ticks: {
        maxRotation: 0,
        autoSkip: true,
        padding: 1,
        font: {
          size: 9,
        },
      },
      grid: {
        display: false,
        drawBorder: false,
        tickLength: 0,
      },
    },
    x: {
      type: "time",
      position: "bottom",
      offset: true,
      adapters: {
        date: {
          locale: enUS,
        },
      },
      time: {
        unit: "month",
        round: "week",
        isoWeekday: 1,
        displayFormats: {
          month: "MMM",
        },
      },
      ticks: {
        maxRotation: 0,
        autoSkip: true,
        font: {
          size: 9,
        },
      },
      grid: {
        display: false,
        drawBorder: false,
        tickLength: 0,
      },
    },
  },
  layout: {
    padding: {
      top: 10,
    },
  },
});

void data;
void options;
</script>

<template>
  <Chart type="matrix" :data="data" :options="options" />
</template>

<style scoped lang="scss">
</style>
