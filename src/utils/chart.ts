import { OptionContract } from "@/types/domain";
import { capitalize } from "lodash";

export function getLineLabel(option: OptionContract, index: number): string {
  return `#${index + 1} (${capitalize(option.type)}&${capitalize(option.long_short)})`;
}

export const colors = ["#4bc0c0", "#9966ff", "#ff9f40", "#ff6384"];
