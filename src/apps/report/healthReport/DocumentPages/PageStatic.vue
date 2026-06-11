<script setup>
import { onMounted } from 'vue';

const emit = defineEmits(['mounted'])

const props = defineProps({
  save: Boolean,
  page: Number,
  imgSrc: String,
  isInbodyData: Boolean
});
const needPageColor = [9, 10, 11, 14, 15]
const needPageColor2 = [23]
const needPageColor3 = [22, 25, 26]
const notNeedPageIndicator = [ 4, 7, 9, 10, 12, 16, 19, 30, 36]

onMounted(() => {
  // mounted 시 실행할 로직 추가
  emit('mounted')

});

</script>
<template>
  <div id="PageStatic" class="custom-page page a4" >
    <div class="page-inside">
      <div
        class="page-indicator"
        :class="{
          color: needPageColor.indexOf(props.page) >= 0,
          color2: needPageColor2.indexOf(props.page) >= 0,
          color3: needPageColor3.indexOf(props.page) >= 0
        }"
        v-if="notNeedPageIndicator.indexOf(props.page) < 0"
      >
      
        <b
          class="stretch-text"
          :style="{ 'margin-top': props.page === 35 ? '8px' : '0px' }"
          >{{ props.page >= 10 ? props.page : "0" + props.page }}</b
        >
      </div>
      <img :src="props.imgSrc"/>
    </div>
  </div>
  
</template>

<style lang="scss" scoped>
@import "@/assets/scss/_variables.scss";
@import "@/assets/scss/_mixin.scss";
// @import "@/assets/scss/_document.scss";
.page-inside {
  position: relative;
  text-align: left;
  letter-spacing: 1px;
  padding: 0;
}

.color {
  background-color: #f3f9f5;
}
.color2 {
  background-color: #dff0e2;
}
.color3 {
  background-color: #e7f3e7;
}

.p3 {
  top: calc(53px * $pdf-scale);
}
b {
  display: inline-block;
}
</style>