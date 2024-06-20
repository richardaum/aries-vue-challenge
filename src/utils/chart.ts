import { OptionContract } from "@/types/domain";
import { capitalize, range } from "lodash-es";
import * as echarts from "echarts";
import Vue from "vue";
import TooltipFormatter from "@/components/TooltipFormatter.vue";
import { TooltipFormatterParams } from "@/types/chart";

export const colors = ["#4bc0c0", "#9966ff", "#ff9f40", "#ff6384"];

export function getLineLabel(option: OptionContract, index: number): string {
  return `#${index + 1} (${capitalize(option.type)}&${capitalize(option.long_short)})`;
}

export class ProfitLossChart<T> {
  echarts?: echarts.ECharts;

  constructor(
    element: HTMLElement,
    public data: T[],
    options: {
      lineLabelBuilder: (option: T, index: number) => string;
      yAxisBuilder: (x: number, option: T) => number;
      xMinValue: number;
      xMaxValue: number;
      xStep: number;
      colorBuilder: (index: number) => string;
    }
  ) {
    this.echarts = echarts.init(element);

    this.echarts.setOption({
      tooltip: {
        formatter: function (params: TooltipFormatterParams[]) {
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
        data: this.data.map((option, index) => options.lineLabelBuilder(option, index)),
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
        ...this.data.map((option, index) => {
          return {
            data: range(options.xMinValue, options.xMaxValue, options.xStep).map((value) => ({
              value: [value, options.yAxisBuilder(value, option)],
            })),
            type: "line",
            name: options.lineLabelBuilder(option, index),
            showSymbol: false,
            itemStyle: { color: options.colorBuilder(index) },
          };
        }),
      ],
    });

    this.echarts.on("click", function (params) {
      if (params.componentType === "markLine") {
        this.setOption({
          series: [{ markLine: { data: [] } }],
        });
      }
    });
  }

  dispose(): void {
    this.echarts?.dispose();
  }

  setMarkLine(params: { value: number; label: string; color: string }): void {
    this.echarts?.setOption({
      series: [
        {
          markLine: {
            data: [
              {
                xAxis: params.value,
                label: { formatter: `${params.label}` },
                lineStyle: { color: params.color },
              },
            ],
          },
        },
      ],
    });
  }
}
