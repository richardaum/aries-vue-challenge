/// <reference types="@testing-library/jest-dom" />

import { fireEvent, render, screen, within } from "@testing-library/vue";
import { describe, expect, it, vi } from "vitest";
import CodingChallenge from "./CodingChallenge.vue";

const setOption = vi.fn();

// Mock echarts
vi.mock("echarts", async () => {
  const mod = await import("echarts");
  return {
    ...mod,
    init: vi.fn(() => {
      return { setOption, on: vi.fn(), dispose: vi.fn() };
    }),
  };
});

describe("CodingChallenge", () => {
  it("renders", () => {
    render(CodingChallenge, {
      props: {
        optionsData: [
          {
            type: "Call",
            long_short: "long",
            strike_price: 100,
            ask: 2,
            bid: 1,
            expiration_date: "2021-01-01",
          },
          {
            type: "Put",
            long_short: "short",
            strike_price: 100,
            ask: 2,
            bid: 1,
            expiration_date: "2021-01-01",
          },
        ],
        price: 100,
      },
    });
  });

  it("shows a markline on the chart", async () => {
    render(CodingChallenge, {
      props: {
        optionsData: [
          {
            type: "Call",
            long_short: "long",
            strike_price: 100,
            ask: 2,
            bid: 1,
            expiration_date: "2021-01-01",
          },
          {
            type: "Put",
            long_short: "short",
            strike_price: 100,
            ask: 2,
            bid: 1,
            expiration_date: "2021-01-01",
          },
        ],
        price: 100,
      },
    });

    const breakEvenContainer = within(screen.getByTestId("options")).getByTestId("break-even");
    await fireEvent.click(within(breakEvenContainer).getByRole("button"));

    const setOptionLastCall = setOption.mock.lastCall;
    const [settings] = setOptionLastCall;

    expect(settings.series[0].markLine.data[0].label.formatter).toMatchInlineSnapshot(`"Break Even: $102.00"`);
  });
});
