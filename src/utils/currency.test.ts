import { describe, it, expect } from "vitest";
import { toCurrency } from "./currency";

describe("toCurrency", () => {
  it("converts number to USD currency format", () => {
    const result = toCurrency(1234);
    expect(result).toBe("$1,234.00");
  });

  it("converts string number to USD currency format", () => {
    const result = toCurrency("1234");
    expect(result).toBe("$1,234.00");
  });

  it("handles decimal numbers correctly", () => {
    const result = toCurrency(1234.56);
    expect(result).toBe("$1,234.56");
  });

  it("handles decimal string numbers correctly", () => {
    const result = toCurrency("1234.56");
    expect(result).toBe("$1,234.56");
  });

  it("throws an error for invalid input", () => {
    expect(() => toCurrency("abc")).toThrow("Invalid input");
  });
});
