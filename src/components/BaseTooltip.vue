<script>
/**
 * 툴팁 콤포넌트
 */
export default {
  name: 'BaseTooltip',
  props: {
    leftLoca: { /* 툴팁 위 꼬다리 위치 받기 */
      type: Number,
      default: 10
    }
  },
  methods: {
    close () {
      this.$emit('tooltipClose')
    }
  }
}
</script>

<template>
  <div class="tooltip--wrap"> <!--툴팁-->
    <div class="tooltip--contents">
      <div class="tooltip--edge" /> <!--231227 툴팁 화살표 위치 조정, 스타일 삭제-->
      <slot name="contents" />
    </div>
    <div class="tooltip--close">
      <button @click="close" type="button" :aria-label="$t('BaseTooltip.close')" />
    </div>
  </div>
</template>

<style scoped>

</style>
