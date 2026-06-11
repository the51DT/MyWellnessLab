<script>
export default {
  name: "BaseTooltip",
  props: {
    leftLoca: { /*툴팁 위 꼬다리 위치 받기*/
      type: Number,
      default: 10
    }
  },
  methods: {
    close(){
      this.$emit("tooltipClose");
    }
  },
}
</script>

<template>
  <div class="tooltip--wrap"> <!--툴팁--> <!--231208 내용과 닫기 위치 변경-->
    <div class="tooltip--contents">
      <div class="tooltip--edge"></div> <!--231227 툴팁 화살표 위치 조정, 스타일 삭제-->
      <slot name="contents"></slot>
    </div>
    <div class="tooltip--close">
      <button @click="close" type="button"></button>
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>