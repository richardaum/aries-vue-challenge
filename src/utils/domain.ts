import { OptionContract } from "@/types/domain";
import { toCurrency } from "./currency";

export function getBreakEven(option: OptionContract): number {
  if (option.type === "Call" && option.long_short === "long") return option.strike_price + option.ask;
  if (option.type === "Call" && option.long_short === "short") return option.strike_price + option.bid;
  if (option.type === "Put" && option.long_short === "long") return option.strike_price - option.ask;
  if (option.type === "Put" && option.long_short === "short") return option.strike_price - option.bid;
  throw new Error("Invalid option contract");
}

export function getReward(price: number, option: OptionContract): number {
  if (option.type === "Call" && option.long_short === "long") {
    return Math.max(price - option.strike_price, 0) - option.ask;
  } else if (option.type === "Put" && option.long_short === "long") {
    return Math.max(option.strike_price - price, 0) - option.ask;
  } else if (option.type === "Call" && option.long_short === "short") {
    return option.bid - Math.max(price - option.strike_price, 0);
  } else if (option.type === "Put" && option.long_short === "short") {
    return option.bid - Math.max(option.strike_price - price, 0);
  }
  throw new Error("Invalid option contract");
}

export function getMaxReward(option: OptionContract): number {
  if (option.type === "Call" && option.long_short === "long") return Infinity;
  if (option.type === "Call" && option.long_short === "short") return option.bid;
  if (option.type === "Put" && option.long_short === "long") return Infinity;
  if (option.type === "Put" && option.long_short === "short") return option.bid;
  throw new Error("Invalid option contract");
}

export function getMinReward(option: OptionContract): number {
  if (option.type === "Call" && option.long_short === "long") return -option.ask;
  if (option.type === "Call" && option.long_short === "short") return -Infinity;
  if (option.type === "Put" && option.long_short === "long") return -option.ask;
  if (option.type === "Put" && option.long_short === "short") return -Infinity;
  throw new Error("Invalid option contract");
}
