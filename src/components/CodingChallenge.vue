<template>
  <div class="container">
    <h1>Options Profit Calculator</h1>
    <div ref="echarts" style="width: 800px; height: 500px"></div>
  </div>
</template>

<script lang="ts">
/* eslint-disable */
import * as echarts from "echarts";
import {capitalize, sortBy} from "lodash";
import Vue from "vue";

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
  throw new Error('Invalid option contract');
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
  throw new Error('Invalid option contract');
}

function getLineLabel(option: OptionContract, index: number) {
  return `#${index + 1} (${capitalize(option.type)}&${capitalize(option.long_short)})`;
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
      options: this.optionsData,
      echarts: null as echarts.ECharts | null,
    };
  },
  mounted() {
    this.initChart();
  },
  beforeDestroy() {
    this.echarts?.dispose();
  },
  methods: {
    initChart() {
      const colors = [
        "rgba(75, 192, 192, 1)",
        "rgba(153, 102, 255, 1)",
        "rgba(255, 159, 64, 1)",
        "rgba(255, 99, 132, 1)",
      ];

      const min = 0;
      const max = 190;

      const chart = echarts.init(this.$refs.echarts as HTMLElement);
      chart.setOption({
        xAxis: {},
        yAxis: {},
        legend: {
          data: this.options.map((option, index) => getLineLabel(option, index)),
        },
        tooltip: {
          trigger: "axis",
        },
        series: [
          ...this.options.map((option, index) => ({
            data: sortBy([min, option.strike_price, getBreakEven(option), max]).map((value) => [
              value,
              getReward(value, option).toFixed(2),
            ]),
            type: "line",
            name: getLineLabel(option, index),
            lineStyle: { color: colors[index] },
          })),
        ],
      });

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
