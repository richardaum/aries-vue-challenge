/// <reference types="@testing-library/jest-dom" />

import { fireEvent, render, screen, within } from "@testing-library/vue";
import { describe, expect, it } from "vitest";
import SidePanel from "./SidePanel.vue";

const options = [
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
];

describe("SidePanel", () => {
  it("renders summary", () => {
    render(SidePanel, {
      props: {
        options,
      },
    });

    const summary = within(screen.getByTestId("summary"));

    expect(summary.getByTestId("max-profit")).toHaveTextContent(/Max Profit\s*Infinity/);
    expect(summary.getByTestId("max-loss")).toHaveTextContent(/Max Loss\s*-Infinity/);
    expect(summary.getByTestId("break-evens")).toHaveTextContent(/All break evens \$102.00 \$99.00/);
  });

  it("renders multiple options", () => {
    render(SidePanel, {
      props: {
        options: options,
      },
    });

    const [first, ...others] = within(screen.getByTestId("options")).getAllByRole("listitem");
    expect(within(first).getByTestId("bid").textContent).toMatchInlineSnapshot(`"Bid $1.00 "`);
    expect(within(first).getByTestId("ask").textContent).toMatchInlineSnapshot(`"Ask $2.00 "`);
    expect(within(first).getByTestId("strike-price").textContent).toMatchInlineSnapshot(`"Strike Price $100.00 "`);
    expect(within(first).getByTestId("break-even").textContent).toMatchInlineSnapshot(`"Break Even $102.00 "`);
    expect(within(first).getByTestId("max-profit").textContent).toMatchInlineSnapshot(`"Max Profit Infinity "`);
    expect(within(first).getByTestId("max-loss").textContent).toMatchInlineSnapshot(`"Max Loss -$2.00 "`);

    others.forEach((option) => {
      expect(within(option).queryByTestId("details")).not.toBeInTheDocument();
    });
  });

  it("expand and collapse options", async () => {
    render(SidePanel, {
      props: {
        options: [
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

    const [first, second] = within(screen.getByTestId("options")).getAllByRole("listitem");
    const expandButton = within(second).getAllByRole("button")[0];

    await fireEvent.click(expandButton);

    expect(within(second).getByTestId("bid").textContent).toMatchInlineSnapshot(`"Bid $1.00 "`);
    expect(within(second).getByTestId("ask").textContent).toMatchInlineSnapshot(`"Ask $2.00 "`);
    expect(within(second).getByTestId("strike-price").textContent).toMatchInlineSnapshot(`"Strike Price $100.00 "`);
    expect(within(second).getByTestId("break-even").textContent).toMatchInlineSnapshot(`"Break Even $99.00 "`);
    expect(within(second).getByTestId("max-profit").textContent).toMatchInlineSnapshot(`"Max Profit $1.00 "`);
    expect(within(second).getByTestId("max-loss").textContent).toMatchInlineSnapshot(`"Max Loss -Infinity "`);
    expect(within(first).queryByTestId("details")).not.toBeInTheDocument();
  });
});
