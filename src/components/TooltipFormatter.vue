<template>
  <div class="p-2 rounded bg-white text-gray-800 text-sm">
    <span data-testid="price">
      <strong>Price:&nbsp;</strong>
      <span>{{ toCurrency(price) }}</span>
    </span>
    <br />
    <div v-for="reward in rewards" :key="reward.optionLabel" class="flex items-center" data-testid="reward">
      <span class="w-2 h-2 rounded-full inline-block mr-2" :style="{ backgroundColor: reward.optionColor }"></span>
      <span>{{ reward.optionLabel }}:&nbsp;</span>
      <span :class="reward.value >= 0 ? 'text-green-500' : 'text-red-500'" class="flex items-center">
        {{ toCurrency(reward.value) }}
      </span>
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        :class="reward.value >= 0 ? 'text-green-500' : 'rotate-180 text-red-500'"
      >
        <path
          d="M7.1341 4.88941C7.519 4.22274 8.48125 4.22274 8.86615 4.8894L12.5946 11.3473C12.9795 12.014 12.4984 12.8474 11.7286 12.8474H4.27163C3.50183 12.8474 3.0207 12.014 3.4056 11.3474L7.1341 4.88941Z"
          fill="currentColor"
        />
      </svg>
    </div>
  </div>
</template>

<script lang="ts">
import { toCurrency } from "@/utils/currency";
import Vue from "vue";

export default Vue.extend({
  name: "TooltipFormatter",
  props: {
    price: {
      type: Number,
      required: true,
    },
    rewards: {
      type: Array as Vue.PropType<{ value: number; optionLabel: string; optionColor: string }[]>,
      required: true,
    },
  },
  methods: {
    toCurrency,
  },
});
</script>
