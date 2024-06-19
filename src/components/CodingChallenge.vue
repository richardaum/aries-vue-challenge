<template>
  <div class="container">
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
import { colors, getLineLabel } from "@/utils/chart";
import { toCurrency } from "@/utils/currency";
import { getBreakEven, getMaxReward, getMinReward, getReward } from "@/utils/domain";
import * as echarts from "echarts";
import { range } from "lodash";
import Vue from "vue";
import SidePanel from "./SidePanel.vue";
import TooltipFormatter from "./TooltipFormatter.vue";

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
      echarts: null as echarts.ECharts | null,
      colors,
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
    showMarkline(x: number, prefix: string, color: string) {
      this.echarts?.setOption({
        series: [
          {
            markLine: {
              data: [
                {
                  xAxis: x,
                  label: { formatter: `${prefix}: ${toCurrency(x)}` },
                  lineStyle: { color },
                },
              ],
            },
          },
        ],
      });
    },
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

      chart.on("click", function (params) {
        if (params.componentType === "markLine") {
          chart.setOption({
            series: [{ markLine: { data: [] } }],
          });
        }
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
