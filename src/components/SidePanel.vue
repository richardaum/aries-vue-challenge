<template>
  <section class="text-left">
    <div class="bg-black/[0.04] border-solid border-2 rounded-xl w-[250px] p-2" data-testid="summary">
      <h2 class="text-xs font-bold">Summary</h2>

      <div class="grid grid-cols-2 gap-4">
        <h3 data-testid="max-profit"><span class="text-xs text-black/50">Max Profit</span><br />{{ maxProfit }}</h3>
        <h3 data-testid="max-loss"><span class="text-xs text-black/50">Max Loss</span><br />{{ maxLoss }}</h3>

        <div class="col-span-2" data-testid="break-evens">
          <h3 class="text-xs text-black/50">All break evens</h3>
          <ul class="flex flex-wrap gap-1 mt-1">
            <li v-for="(breakEven, index) in allBreakEvens" :key="index">
              <button
                :style="`border-color: ${colors[index]}; background-color: ${ligtenColors[index]}`"
                class="border-solid border-2 underline decoration-dashed underline-offset-2 decoration-from-font rounded-full px-2 py-1 text-xs"
                @click="$emit('select-break-even', breakEven, index)"
              >
                {{ toCurrency(breakEven) }}
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <ul class="gap-4 flex flex-col my-4 items-start" data-testid="options">
      <li
        v-for="(option, index) in options"
        :key="index"
        :style="`border-color: ${colors[index]}; background-color: ${ligtenColors[index]}`"
        class="border-solid border-2 rounded-xl min-w-[250px]"
      >
        <button class="p-2 w-full flex items-center" @click="open.index = index" :disabled="open.index === index">
          <h2 class="text-xs font-bold">{{ getLineLabel(option, index) }}</h2>
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
          <hr class="mb-2 border-gray-300" />
          <div class="text-sm grid grid-cols-3 gap-4">
            <div data-testid="bid">
              <h3 class="text-xs text-black/50">Bid</h3>
              {{ toCurrency(option.bid) }}
            </div>
            <h3 data-testid="ask">
              <div class="text-xs text-black/50">Ask</div>
              {{ toCurrency(option.ask) }}
            </h3>
            <div data-testid="strike-price">
              <h3 class="text-xs text-black/50">Strike Price</h3>
              <button
                class="underline decoration-dashed underline-offset-2 decoration-from-font"
                @click="$emit('select-strike-price', option.strike_price, index)"
              >
                {{ toCurrency(option.strike_price) }}
              </button>
            </div>
            <div data-testid="break-even">
              <h3 class="text-xs text-black/50">Break Even</h3>
              <button
                class="underline decoration-dashed underline-offset-2 decoration-from-font"
                @click="$emit('select-break-even', getBreakEven(option), index)"
              >
                {{ toCurrency(getBreakEven(option)) }}
              </button>
            </div>
            <div data-testid="max-profit">
              <h3 class="text-xs text-black/50">Max Profit</h3>
              {{ toCurrency(getMaxReward(option)) }}
            </div>
            <div data-testid="max-loss">
              <h3 class="text-xs text-black/50">Max Loss</h3>
              {{ toCurrency(getMinReward(option)) }}
            </div>
          </div>
        </div>
      </li>
    </ul>
  </section>
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
      maxProfit: this.options.reduce((acc, option) => acc + getMaxReward(option), 0),
      maxLoss: this.options.reduce((acc, option) => acc + getMinReward(option), 0),
      allBreakEvens: this.options.map((option) => getBreakEven(option)),
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
