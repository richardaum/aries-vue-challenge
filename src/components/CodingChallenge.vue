<template>
  <div class="container">
    <h1 class="text-2xl font-bold mb-3">Options Profit Calculator</h1>

    <div class="flex">
      <div ref="echarts" style="width: 600px; height: 500px"></div>
      <ul class="gap-4 text-left flex flex-col my-4 items-start">
        <li
          v-for="(option, index) in options"
          :key="index"
          :style="`border-color: ${colors[index]}; background-color: ${ligtenColors[index]}`"
          class="border-solid border-2 rounded-xl min-w-[250px]"
        >
          <button class="p-2 w-full text-left" @click="open.index = index">
            <div class="text-xs font-bold">{{ getLineLabel(option, index) }}</div>
          </button>

          <div class="px-2 pb-2" v-if="open.index === index">
            <hr class="my-2 border-gray-300" />
            <div class="text-sm grid grid-cols-3 gap-4">
              <div>
                <div class="text-xs text-black/50">Bid</div>
                {{ toCurrency(option.bid) }}
              </div>
              <div>
                <div class="text-xs text-black/50">Ask</div>
                {{ toCurrency(option.ask) }}
              </div>
              <div>
                <div class="text-xs text-black/50">Strike Price</div>
                {{ toCurrency(option.strike_price) }}
              </div>
              <div>
                <div class="text-xs text-black/50">Break Even</div>
                {{ toCurrency(getBreakEven(option)) }}
              </div>
              <div>
                <div class="text-xs text-black/50">Max Profit</div>
                {{ getMaxReward(option) }}
              </div>
              <div>
                <div class="text-xs text-black/50">Max Loss</div>
                {{ getMinReward(option) }}
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
/* eslint-disable */
import * as echarts from "echarts";
import { capitalize, get, range } from "lodash";
import Vue, { reactive } from "vue";
import TooltipFormatter from "./TooltipFormatter.vue";
import { toCurrency } from "@/utils/currency";

type OptionContract = {
  strike_price: number;
  type: "Call" | "Put";
  bid: number;
  ask: number;
  long_short: "long" | "short";
  /**
   * ISO format
   */
  expiration_date: string;
};

type Price = {
  value: number;
  label: string;
};

function getBreakEven(option: OptionContract) {
  if (option.type === "Call" && option.long_short === "long") return option.strike_price + option.ask;
  if (option.type === "Call" && option.long_short === "short") return option.strike_price + option.bid;
  if (option.type === "Put" && option.long_short === "long") return option.strike_price - option.ask;
  if (option.type === "Put" && option.long_short === "short") return option.strike_price - option.bid;
  throw new Error("Invalid option contract");
}

function getReward(price: number, option: OptionContract) {
  if (option.type === "Call" && option.long_short === "long") {
    return Math.max(price - option.strike_price, 0) - option.ask;
  } else if (option.type === "Put" && option.long_short === "long") {
    return Math.max(option.strike_price - price, 0) - option.ask;
  } else if (option.type === "Call" && option.long_short === "short") {
    return option.bid - Math.max(price - option.strike_price, 0);
  } else if (option.type === "Put" && option.long_short === "short") {
    return option.bid - Math.max(option.strike_price - price, 0);
  }
  throw new Error("Invalid option contract");
}

function getLineLabel(option: OptionContract, index: number) {
  return `#${index + 1} (${capitalize(option.type)}&${capitalize(option.long_short)})`;
}

function getMaxReward(option: OptionContract) {
  if (option.type === "Call" && option.long_short === "long") return "Infinity";
  if (option.type === "Call" && option.long_short === "short") return toCurrency(option.bid);
  if (option.type === "Put" && option.long_short === "long") return "Infinity";
  if (option.type === "Put" && option.long_short === "short") return toCurrency(option.bid);
  throw new Error("Invalid option contract");
}

function getMinReward(option: OptionContract) {
  if (option.type === "Call" && option.long_short === "long") return toCurrency(-option.ask);
  if (option.type === "Call" && option.long_short === "short") return "-Infinity";
  if (option.type === "Put" && option.long_short === "long") return toCurrency(-option.ask);
  if (option.type === "Put" && option.long_short === "short") return "-Infinity";
  throw new Error("Invalid option contract");
}

export default Vue.extend({
  name: "CodingChallenge",
  props: {
    optionsData: {
      type: Array as Vue.PropType<OptionContract[]>,
      required: true,
    },
  },
  components: {},
  data() {
    return {
      open: reactive({ index: 0 }),
      options: this.optionsData,
      echarts: null as echarts.ECharts | null,
      colors: ["#4bc0c0", "#9966ff", "#ff9f40", "#ff6384"],
      ligtenColors: ["#e6f7f7", "#f0eaff", "#fff2e6", "#ffe6ea"],
    };
  },
  mounted() {
    this.initChart();
  },
  beforeDestroy() {
    this.echarts?.dispose();
  },
  methods: {
    toCurrency,
    getLineLabel,
    getBreakEven,
    getMinReward,
    getMaxReward,
    initChart() {
      const step = 1;
      const offset = 50;
      const minValue = Math.min(...this.options.map((o) => Math.min(o.strike_price, getBreakEven(o)))) - offset;
      const maxValue = Math.max(...this.options.map((o) => Math.max(o.strike_price, getBreakEven(o)))) + offset;

      const chart = echarts.init(this.$refs.echarts as HTMLElement);
      const settings = {
        tooltip: {
          formatter: function (
            params: { axisValue: number; value: [number, number]; color: string; seriesName: string }[]
          ) {
            const TooltipConstructor = Vue.extend(TooltipFormatter);
            const instance = new TooltipConstructor({
              propsData: {
                price: params[0].axisValue,
                visible: true,
                rewards: params.map((param) => ({
                  value: param.value[1],
                  optionLabel: param.seriesName,
                  optionColor: param.color,
                })),
              },
            });
            instance.$mount();
            return instance.$el.outerHTML;
          },
          trigger: "axis",
        },
        legend: {
          data: this.options.map((option, index) => getLineLabel(option, index)),
        },
        toolbox: {
          feature: {
            dataZoom: { icon: null },
          },
        },
        dataZoom: [
          { type: "inside", start: 0, end: 100 },
          { start: 0, end: 100 },
        ],
        xAxis: {
          type: "value",
          axisLabel: { formatter: "${value}" },
          name: "Underlying Price ($)",
          nameLocation: "middle",
          nameGap: 40,
        },
        yAxis: {
          type: "value",
          axisLabel: {
            formatter: "${value}",
          },
          name: "Profit & Loss ($)",
          nameLocation: "middle",
          nameGap: 40,
        },
        series: [
          ...this.options.map((option, index) => {
            return {
              data: range(minValue, maxValue, step).map((value) => ({
                value: [value, getReward(value, option).toFixed(2)],
              })),
              type: "line",
              name: getLineLabel(option, index),
              showSymbol: false,
              itemStyle: { color: this.colors[index] },
            };
          }),
        ],
      };

      chart.setOption(settings);

      this.echarts = chart;
    },
  },
});
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
