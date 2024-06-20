/// <reference types="@testing-library/jest-dom" />

import { render, screen } from "@testing-library/vue";
import { describe, expect, it } from "vitest";
import TooltipFormatter from "./TooltipFormatter.vue";

describe("TooltipFormatter", () => {
  it("renders tooltip with currency format", () => {
    render(TooltipFormatter, {
      props: { price: 100, rewards: [{ value: 1234, optionLabel: "Option 1", optionColor: "red" }] },
    });
    expect(screen.getByTestId("price")).toHaveTextContent(/price:\s*\$100.00/i);
    expect(screen.getByTestId("reward")).toHaveTextContent(/Option 1:\s*\$1,234.00/i);
  });
});
