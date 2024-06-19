<template>
  <div class="container">
    <h1>Options Profit Calculator</h1>
    <div ref="echarts" style="width: 800px; height: 500px"></div>
  </div>
</template>

<script lang="ts">
/* eslint-disable */
import * as echarts from "echarts";
import capitalize from "lodash";
import sortBy from "lodash";
import Vue from "vue";

/**
 * @typedef {Object} OptionContract
 * @property {number} strike_price
 * @property {"Call" | "Put"} type
 * @property {number} bid
 * @property {number} ask
 * @property {"long" | "short"} long_short
 * @property {string} expiration_date - ISO format.
 */

/**
 * @typedef {Object} Price
 * @property {number} value - The value of the price.
 * @property {string} label - The label of the price.
 */

/**
 * @param {OptionContract} option
 */
function getBreakEven(option) {
  if (option.type === "Call" && option.long_short === "long") return option.strike_price + option.ask;
  if (option.type === "Call" && option.long_short === "short") return option.strike_price + option.bid;
  if (option.type === "Put" && option.long_short === "long") return option.strike_price - option.ask;
  if (option.type === "Put" && option.long_short === "short") return option.strike_price - option.bid;
}
/**
 * @param {number} price
 * @param {OptionContract} option
 */
function getReward(price, option) {
  if (option.type === "Call" && option.long_short === "long") {
    return Math.max(price - option.strike_price, 0) - option.ask;
  } else if (option.type === "Put" && option.long_short === "long") {
    return Math.max(option.strike_price - price, 0) - option.ask;
  } else if (option.type === "Call" && option.long_short === "short") {
    return option.bid - Math.max(price - option.strike_price, 0);
  } else if (option.type === "Put" && option.long_short === "short") {
    return option.bid - Math.max(option.strike_price - price, 0);
  }
}
/**
 * @param {OptionContract} option
 * @param {number} index
 */
function getLineLabel(option, index) {
  return `#${index + 1} (${capitalize(option.type)}&${capitalize(option.long_short)})`;
}

export default Vue.extend({
  name: "CodingChallenge",
  props: {
    optionsData: Array,
  },
  components: {},
  data() {
    return {
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
      /**
       * @type {OptionContract[]}
       */
      const options = this.$props.optionsData;

      const colors = [
        "rgba(75, 192, 192, 1)",
        "rgba(153, 102, 255, 1)",
        "rgba(255, 159, 64, 1)",
        "rgba(255, 99, 132, 1)",
      ];

      const min = 0;
      const max = 190;

      const chart = echarts.init(this.$refs.echarts);
      chart.setOption({
        xAxis: {},
        yAxis: {},
        legend: {
          data: options.map((option, index) => getLineLabel(option, index)),
        },
        tooltip: {
          trigger: "axis",
        },
        series: [
          ...options.map((option, index) => ({
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
