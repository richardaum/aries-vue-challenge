<template>
  <ul class="gap-4 text-left flex flex-col my-4 items-start" data-testid="side-panel">
    <li
      v-for="(option, index) in options"
      :key="index"
      :style="`border-color: ${colors[index]}; background-color: ${ligtenColors[index]}`"
      class="border-solid border-2 rounded-xl min-w-[250px]"
    >
      <button
        class="p-2 w-full text-left flex items-center"
        @click="open.index = index"
        :disabled="open.index === index"
      >
        <div class="text-xs font-bold">{{ getLineLabel(option, index) }}</div>

        <svg
          v-if="open.index !== index"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class="ml-auto"
        >
          <path
            d="M8.86615 12.8053C8.48125 13.472 7.519 13.472 7.1341 12.8053L3.4056 6.34735C3.0207 5.68069 3.50182 4.84735 4.27163 4.84735L11.7286 4.84735C12.4984 4.84735 12.9795 5.68068 12.5946 6.34735L8.86615 12.8053Z"
            class="fill-black"
          />
        </svg>
      </button>

      <div class="px-2 pb-2" v-if="open.index === index" data-testid="details">
        <hr class="my-2 border-gray-300" />
        <div class="text-sm grid grid-cols-3 gap-4">
          <div data-testid="bid">
            <div class="text-xs text-black/50">Bid</div>
            {{ toCurrency(option.bid) }}
          </div>

          <div data-testid="ask">
            <div class="text-xs text-black/50">Ask</div>
            {{ toCurrency(option.ask) }}
          </div>

          <div data-testid="strike-price">
            <div class="text-xs text-black/50">Strike Price</div>
            <button
              class="underline decoration-dashed underline-offset-2 decoration-from-font"
              @click="$emit('select-strike-price', option.strike_price, index)"
            >
              {{ toCurrency(option.strike_price) }}
            </button>
          </div>

          <div data-testid="break-even">
            <div class="text-xs text-black/50">Break Even</div>
            <button
              class="underline decoration-dashed underline-offset-2 decoration-from-font"
              @click="$emit('select-break-even', getBreakEven(option), index)"
            >
              {{ toCurrency(getBreakEven(option)) }}
            </button>
          </div>

          <div data-testid="max-profit">
            <div class="text-xs text-black/50">Max Profit</div>
            {{ getMaxReward(option) }}
          </div>

          <div data-testid="max-loss">
            <div class="text-xs text-black/50">Max Loss</div>
            {{ getMinReward(option) }}
          </div>
        </div>
      </div>
    </li>
  </ul>
</template>

<script lang="ts">
import { toCurrency } from "@/utils/currency";
import Vue, { reactive } from "vue";
import { getBreakEven, getReward, getMaxReward, getMinReward } from "@/utils/domain";
import { colors, getLineLabel } from "@/utils/chart";
import { OptionContract } from "@/types/domain";

export default Vue.extend({
  name: "TooltipFormatter",
  props: {
    options: {
      type: Array as Vue.PropType<OptionContract[]>,
      required: true,
    },
  },
  data() {
    return {
      open: reactive({ index: 0 }),
      colors: colors,
      ligtenColors: colors.map((color) => `${color}1a`),
    };
  },
  methods: {
    toCurrency,
    getBreakEven,
    getReward,
    getMaxReward,
    getMinReward,
    getLineLabel,
  },
});
</script>

<style scoped>
.tooltip-content {
  padding: 5px;
  border-radius: 3px;
  background-color: #fff;
  color: #333;
  font-size: 14px;
}
.tooltip-item {
  display: flex;
  align-items: center;
}
.tooltip-color {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 5px;
}
</style>
