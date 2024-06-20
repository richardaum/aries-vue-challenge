export function toCurrency(value: string | number): string {
  if (value === Infinity || value === -Infinity) return `${value}`;
  if (isNaN(Number(value))) throw new Error("Invalid input");
  return Number(value).toLocaleString("en-US", { style: "currency", currency: "USD" });
}
