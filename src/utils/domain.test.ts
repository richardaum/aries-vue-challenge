import { getBreakEven, getReward, getMaxReward, getMinReward } from "./domain";
import { describe, expect, it } from "vitest";

describe("Domain Utils", () => {
  describe("getBreakEven", () => {
    describe("for invalid option contract", () => {
      it("should throw an error", () => {
        expect(() =>
          getBreakEven({
            // @ts-expect-error Testing invalid input
            type: "Invalid",
            // @ts-expect-error Testing invalid input
            long_short: "Invalid",
            strike_price: 100,
            ask: 2,
            bid: 1,
            expiration_date: "2021-01-01",
          })
        ).toThrow("Invalid option contract");
      });
    });

    describe("for long call option", () => {
      it("should calculate break even price", () => {
        const breakEven = getBreakEven({
          type: "Call",
          long_short: "long",
          strike_price: 100,
          ask: 2,
          bid: 1,
          expiration_date: "2021-01-01",
        });
        expect(breakEven).toBe(102);
      });
    });

    describe("for short call option", () => {
      it("should calculate break even price", () => {
        const breakEven = getBreakEven({
          type: "Call",
          long_short: "short",
          strike_price: 100,
          ask: 2,
          bid: 1,
          expiration_date: "2021-01-01",
        });
        expect(breakEven).toBe(101);
      });
    });

    describe("for long put option", () => {
      it("should calculate break even price", () => {
        const breakEven = getBreakEven({
          type: "Put",
          long_short: "long",
          strike_price: 100,
          ask: 2,
          bid: 1,
          expiration_date: "2021-01-01",
        });
        expect(breakEven).toBe(98);
      });
    });

    describe("for short put option", () => {
      it("should calculate break even price", () => {
        const breakEven = getBreakEven({
          type: "Put",
          long_short: "short",
          strike_price: 100,
          ask: 2,
          bid: 1,
          expiration_date: "2021-01-01",
        });
        expect(breakEven).toBe(99);
      });
    });
  });

  describe("getReward", () => {
    describe("for invalid option contract", () => {
      it("should throw an error", () => {
        expect(() =>
          getReward(100, {
            // @ts-expect-error Testing invalid input
            type: "Invalid",
            // @ts-expect-error Testing invalid input
            long_short: "Invalid",
            strike_price: 100,
            ask: 2,
            bid: 1,
            expiration_date: "2021-01-01",
          })
        ).toThrow("Invalid option contract");
      });
    });

    describe("for long call option", () => {
      it("should calculate reward when price is greater than strike price", () => {
        const reward = getReward(110, {
          type: "Call",
          long_short: "long",
          strike_price: 100,
          ask: 2,
          bid: 1,
          expiration_date: "2021-01-01",
        });
        expect(reward).toBe(8);
      });

      it("should calculate reward when price is less than strike price", () => {
        const reward = getReward(90, {
          type: "Call",
          long_short: "long",
          strike_price: 100,
          ask: 2,
          bid: 1,
          expiration_date: "2021-01-01",
        });
        expect(reward).toBe(-2);
      });
    });

    describe("for long put option", () => {
      it("should calculate reward when price is less than strike price", () => {
        const reward = getReward(90, {
          type: "Put",
          long_short: "long",
          strike_price: 100,
          ask: 2,
          bid: 1,
          expiration_date: "2021-01-01",
        });
        expect(reward).toBe(8);
      });

      it("should calculate reward when price is greater than strike price", () => {
        const reward = getReward(110, {
          type: "Put",
          long_short: "long",
          strike_price: 100,
          ask: 2,
          bid: 1,
          expiration_date: "2021-01-01",
        });
        expect(reward).toBe(-2);
      });
    });

    describe("for short call option", () => {
      it("should calculate reward when price is greater than strike price", () => {
        const reward = getReward(110, {
          type: "Call",
          long_short: "short",
          strike_price: 100,
          ask: 2,
          bid: 1,
          expiration_date: "2021-01-01",
        });
        expect(reward).toBe(-9);
      });

      it("should calculate reward when price is less than strike price", () => {
        const reward = getReward(90, {
          type: "Call",
          long_short: "short",
          strike_price: 100,
          ask: 2,
          bid: 1,
          expiration_date: "2021-01-01",
        });
        expect(reward).toBe(1);
      });
    });

    describe("for short put option", () => {
      it("should calculate reward when price is less than strike price", () => {
        const reward = getReward(90, {
          type: "Put",
          long_short: "short",
          strike_price: 100,
          ask: 2,
          bid: 1,
          expiration_date: "2021-01-01",
        });
        expect(reward).toBe(-9);
      });

      it("should calculate reward when price is greater than strike price", () => {
        const reward = getReward(110, {
          type: "Put",
          long_short: "short",
          strike_price: 100,
          ask: 2,
          bid: 1,
          expiration_date: "2021-01-01",
        });
        expect(reward).toBe(1);
      });
    });
  });

  describe("getMaxReward", () => {
    describe("for invalid option contract", () => {
      it("should throw an error", () => {
        expect(() =>
          getMaxReward({
            // @ts-expect-error Testing invalid input
            type: "Invalid",
            // @ts-expect-error Testing invalid input
            long_short: "Invalid",
            strike_price: 100,
            ask: 2,
            bid: 1,
            expiration_date: "2021-01-01",
          })
        ).toThrow("Invalid option contract");
      });
    });

    describe("for long call option", () => {
      it("should return Infinity", () => {
        const maxReward = getMaxReward({
          type: "Call",
          long_short: "long",
          strike_price: 100,
          ask: 2,
          bid: 1,
          expiration_date: "2021-01-01",
        });
        expect(maxReward).toBe(Infinity);
      });
    });

    describe("for short call option", () => {
      it("should return bid price", () => {
        const maxReward = getMaxReward({
          type: "Call",
          long_short: "short",
          strike_price: 100,
          ask: 2,
          bid: 1,
          expiration_date: "2021-01-01",
        });
        expect(maxReward).toBe(1);
      });
    });

    describe("for long put option", () => {
      it("should return Infinity", () => {
        const maxReward = getMaxReward({
          type: "Put",
          long_short: "long",
          strike_price: 100,
          ask: 2,
          bid: 1,
          expiration_date: "2021-01-01",
        });
        expect(maxReward).toBe(Infinity);
      });
    });

    describe("for short put option", () => {
      it("should return bid price", () => {
        const maxReward = getMaxReward({
          type: "Put",
          long_short: "short",
          strike_price: 100,
          ask: 2,
          bid: 1,
          expiration_date: "2021-01-01",
        });
        expect(maxReward).toBe(1);
      });
    });
  });

  describe("getMinReward", () => {
    describe("for invalid option contract", () => {
      it("should throw an error", () => {
        expect(() =>
          getMinReward({
            // @ts-expect-error Testing invalid input
            type: "Invalid",
            // @ts-expect-error Testing invalid input
            long_short: "Invalid",
            strike_price: 100,
            ask: 2,
            bid: 1,
            expiration_date: "2021-01-01",
          })
        ).toThrow("Invalid option contract");
      });
    });

    describe("for long call option", () => {
      it("should return -ask price", () => {
        const minReward = getMinReward({
          type: "Call",
          long_short: "long",
          strike_price: 100,
          ask: 2,
          bid: 1,
          expiration_date: "2021-01-01",
        });
        expect(minReward).toBe(-2);
      });
    });

    describe("for short call option", () => {
      it("should return -Infinity", () => {
        const minReward = getMinReward({
          type: "Call",
          long_short: "short",
          strike_price: 100,
          ask: 2,
          bid: 1,
          expiration_date: "2021-01-01",
        });
        expect(minReward).toBe(-Infinity);
      });
    });

    describe("for long put option", () => {
      it("should return -ask price", () => {
        const minReward = getMinReward({
          type: "Put",
          long_short: "long",
          strike_price: 100,
          ask: 2,
          bid: 1,
          expiration_date: "2021-01-01",
        });
        expect(minReward).toBe(-2);
      });
    });

    describe("for short put option", () => {
      it("should return -Infinity", () => {
        const minReward = getMinReward({
          type: "Put",
          long_short: "short",
          strike_price: 100,
          ask: 2,
          bid: 1,
          expiration_date: "2021-01-01",
        });
        expect(minReward).toBe(-Infinity);
      });
    });
  });
});
