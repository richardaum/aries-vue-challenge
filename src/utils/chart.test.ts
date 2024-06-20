import { describe, expect, it, vi } from "vitest";
import { ProfitLossChart, getLineLabel } from "./chart";
import { TooltipFormatterParams } from "@/types/chart";

describe("getLineLabel", () => {
  it("returns label for line", () => {
    const label = getLineLabel(
      {
        type: "Call",
        long_short: "long",
        strike_price: 100,
        ask: 2,
        bid: 1,
        expiration_date: "2021-01-01",
      },
      0
    );
    expect(label).toBe("#1 (Call&Long)");
  });
});

// Mock echarts
vi.mock("echarts", async () => {
  const mod = await import("echarts");
  return {
    ...mod,
    init: () => {
      return { setOption: vi.fn(), on: vi.fn(), dispose: vi.fn() };
    },
  };
});

describe("ProfitLossChart", () => {
  it("initializes echarts", async () => {
    const chart = createProfitLossChart();
    expect(chart.echarts).toBeDefined();
  });

  it("destroys echarts instance", async () => {
    const chart = createProfitLossChart();
    chart.dispose();
    expect(chart.echarts?.dispose).toHaveBeenCalled();
  });

  it("build a tooltip formatter", async () => {
    const chart = createProfitLossChart();
    const tooltipConfig = vi.mocked(chart.echarts?.setOption)?.mock.calls[0][0].tooltip as {
      formatter: (params: TooltipFormatterParams[]) => string;
    };
    const tooltip = tooltipConfig.formatter([
      { axisValue: 100, value: [100, 200], color: "red", seriesName: "Call&Long" },
    ]);

    expect(tooltip).toMatchInlineSnapshot(`"<div data-v-8f582b69="" class="tooltip-content"><strong data-v-8f582b69="">Price:</strong> $100.00 <br data-v-8f582b69=""><div data-v-8f582b69="" class="tooltip-item"><span data-v-8f582b69="" class="tooltip-color" style="background-color: red;"></span><span data-v-8f582b69="">Call&amp;Long:</span> &nbsp; <span data-v-8f582b69="" class="flex items-center text-green-500"> $200.00 <svg data-v-8f582b69="" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" class=""><path data-v-8f582b69="" d="M7.1341 4.88941C7.519 4.22274 8.48125 4.22274 8.86615 4.8894L12.5946 11.3473C12.9795 12.014 12.4984 12.8474 11.7286 12.8474H4.27163C3.50183 12.8474 3.0207 12.014 3.4056 11.3474L7.1341 4.88941Z" fill="currentColor"></path></svg></span></div></div>"`);
  });

  describe("remove markLine", () => {
    it("on click event", async () => {
      const chart = createProfitLossChart();
      const chartClickHandler = (
        vi.mocked(chart.echarts?.on)?.mock.calls[0][1] as (params: { componentType: string }) => void
      ).bind(chart.echarts);
      chartClickHandler({ componentType: "markLine" });

      // Because 1st call is for initialization
      const secondSetOptionCall = vi.mocked(chart.echarts?.setOption)?.mock.calls[1][0];
      expect(secondSetOptionCall).toMatchInlineSnapshot(`
        {
          "series": [
            {
              "markLine": {
                "data": [],
              },
            },
          ],
        }
      `);
    });

    describe("setMarkLine", () => {
      it("sets markLine", async () => {
        const chart = createProfitLossChart();
        chart.setMarkLine({ value: 50, label: "Break-even", color: "red" });

        // Because 1st call is for initialization
        const secondSetOptionCall = vi.mocked(chart.echarts?.setOption)?.mock.calls[1][0];
        expect(secondSetOptionCall).toMatchInlineSnapshot(`
          {
            "series": [
              {
                "markLine": {
                  "data": [
                    {
                      "label": {
                        "formatter": "Break-even",
                      },
                      "lineStyle": {
                        "color": "red",
                      },
                      "xAxis": 50,
                    },
                  ],
                },
              },
            ],
          }
        `);
      });
    });
  });
});

function createProfitLossChart() {
  const element = document.createElement("div");
  const options = {
    lineLabelBuilder: vi.fn(),
    yAxisBuilder: vi.fn(),
    xMinValue: 0,
    xMaxValue: 100,
    xStep: 10,
    colorBuilder: vi.fn(),
  };
  return new ProfitLossChart(
    element,
    [
      {
        type: "Call",
        long_short: "long",
        strike_price: 150,
        ask: 20,
        bid: 12,
        expiration_date: "2021-01-01",
      },
    ],
    options
  );
}
