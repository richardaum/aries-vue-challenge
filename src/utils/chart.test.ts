import { describe, expect, it, vi } from "vitest";
import { ProfitLossChart, getLineLabel } from "./chart";
import { TooltipFormatterParams } from "@/types/chart";
import { JSDOM } from "jsdom";

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

    const tooltip = new JSDOM(
      tooltipConfig.formatter([{ axisValue: 100, value: [100, 200], color: "red", seriesName: "Call&Long" }])
    ).window.document.body;

    expect(tooltip).toHaveTextContent(/Price:\s*\$100\.00/i);
    expect(tooltip).toHaveTextContent(/Call&Long:\s*\$200\.00/i);
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
