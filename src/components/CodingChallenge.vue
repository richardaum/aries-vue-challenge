<template>
  <div class="container mx-auto">
    <h1 class="text-2xl font-bold mb-3">Options Profit Calculator</h1>

    <div class="flex">
      <div ref="echarts" style="width: 600px; height: 500px"></div>
      <SidePanel
        :options="options"
        @select-break-even="(price, index) => showMarkline(price, 'Break Even', colors[index])"
        @select-strike-price="(price, index) => showMarkline(price, 'Strike Price', colors[index])"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { OptionContract } from "@/types/domain";
import { colors, getLineLabel, ProfitLossChart } from "@/utils/chart";
import { toCurrency } from "@/utils/currency";
import { getBreakEven, getMaxReward, getMinReward, getReward } from "@/utils/domain";
import Vue from "vue";
import SidePanel from "./SidePanel.vue";

export default Vue.extend({
  name: "CodingChallenge",
  props: {
    optionsData: {
      type: Array as Vue.PropType<OptionContract[]>,
      required: true,
    },
  },
  components: {
    SidePanel,
  },
  data() {
    return {
      options: this.optionsData,
      chart: null as ProfitLossChart<OptionContract> | null,
      colors,
    };
  },
  mounted() {
    this.initChart();
  },
  beforeDestroy() {
    this.chart?.dispose();
  },
  methods: {
    toCurrency,
    getLineLabel,
    getBreakEven,
    getMinReward,
    getMaxReward,
    showMarkline(x: number, prefix: string, color: string) {
      this.chart?.setMarkLine({
        value: x,
        label: `${prefix}: ${toCurrency(x)}`,
        color,
      });
    },
    initChart() {
      const offset = 50;
      const minValue = Math.min(...this.options.map((o) => Math.min(o.strike_price, getBreakEven(o)))) - offset;
      const maxValue = Math.max(...this.options.map((o) => Math.max(o.strike_price, getBreakEven(o)))) + offset;

      this.chart = new ProfitLossChart(this.$refs.echarts as HTMLElement, this.options, {
        lineLabelBuilder: (option, index) => getLineLabel(option, index),
        yAxisBuilder: (x, option) => getReward(x, option),
        xMinValue: minValue,
        xMaxValue: maxValue,
        xStep: 1,
        colorBuilder: (index) => this.colors[index],
      });
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
