<template>
  <div class="tooltip-content">
    <strong>Price:</strong> {{ toCurrency(price) }}
    <br />
    <div v-for="reward in rewards" :key="reward.optionLabel" class="tooltip-item">
      <span class="tooltip-color" :style="{ backgroundColor: reward.optionColor }"></span>
      <span>{{ reward.optionLabel }}:</span>
      &nbsp;
      <span :style="{ color: reward.value >= 0 ? 'green' : 'red' }">
        {{ toCurrency(reward.value) }}
      </span>
    </div>
  </div>
</template>

<script lang="ts">
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
    toCurrency(value: number | string): string {
      return Number(value).toLocaleString("en-US", { style: "currency", currency: "USD" });
    },
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
