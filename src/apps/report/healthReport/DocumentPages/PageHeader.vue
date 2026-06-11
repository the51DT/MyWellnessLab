
<script setup>
import { computed } from "vue";

// Props 정의
const props = defineProps({
  page: Number,
});

// Computed property for formatted page number
const formattedPage = computed(() => {
  return props.page < 10 ? "0" + props.page : props.page;
});
</script>
<template>
  <div class="page-header" id="PageHeader">
    <span class="stretch-text">myWellness LAB Report</span>
    <div class="right">
      <div class="vertical"></div>
      <span class="stretch-text">{{ formattedPage }}</span>
    </div>
  </div>
</template>
