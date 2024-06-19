export type OptionContract = {
  strike_price: number;
  type: "Call" | "Put";
  bid: number;
  ask: number;
  long_short: "long" | "short";
  /**
   * ISO format
   */
  expiration_date: string;
};

export type Price = {
  value: number;
  label: string;
};
