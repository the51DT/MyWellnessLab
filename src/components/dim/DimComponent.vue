<script setup>

// Props 정의
const props = defineProps({
  htmlText: String,
  // dim 스타일 타입 (1인 경우, 두 줄로 가운데에 위치. 2인 경우 한 줄로 위치)
  styleType: { 
    type: Number,
    default: 1,
  }, 
  iconSize: {
    type: String,
    default: 'large',
  },
  paddingFlag: {
    type: Boolean,
    default: false,
  }
});

</script>
<template>
  <div class="dim-container" :class="props.paddingFlag==true ? 'padding' : 'no-padding'" v-if="props.styleType === 1">
    <div class="dim"></div>
    <div class="dim-content center"> 
      <img class="dim-img" :class="props.iconSize" src="@/assets/images/icons/i-rock.png" />
      <div class="notice" v-html="props.htmlText" />
    </div>
  </div>
  <div class="dim-container" :class="props.paddingFlag==true ? 'padding' : 'no-padding'" v-if="props.styleType === 2">
    <div class="dim">
      <div class="dim-content left"> 
        <img class="dim-img" :class="props.iconSize" src="@/assets/images/icons/i-rock.png" />
        <div class="notice" v-html="props.htmlText" />
      </div>
    </div>
  </div>
</template>