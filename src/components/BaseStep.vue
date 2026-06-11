<script setup>
/**
 * 웰니스 분석 단계를 표시하는 상단 ui 콤포넌트
 */
// const props = defineProps({
//   step: String /* 몇번째 단계인지 */
// })

const props = defineProps({
  progressbar: {
    type: Array,
    required: true
  },
  current: Number,
  interest: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['clickStep'])
</script>

<template>
  <div class="BaseStep" :class="`step${props.current}`">
    <button
      type="button"
      class="BaseStep__start-circle"
      :class="{
          'is-current': props.current === 1,
      }"
      @click="$emit('clickStep', 1)"
  >
    </button>

    <div
        v-for="(item, idx) in props.progressbar"
        :key="item.hthType"
        class="BaseStep--step"
        :class="{
          'is-completed-line': item.inputYn === 'Y', // 선이 완료된 경우 (현재 단계 이전)
          'is-current-line': (idx +2) === props.current, // 선이 현재 단계인 경우
          'is-last': idx === props.progressbar.length - 1, // 마지막 요소에 is-last 클래스 추가 (선 모양 조절용)
        }"
    >
      <button
          type="button"
          class="BaseStep--step__circle-button"
          :class="{
            'is-completed': item.inputYn === 'Y',  // 완료된 단계 원
            'is-current': (idx + 2) === props.current // 현재 단계 원
          }"
          @click="$emit('clickStep', idx + 2)"
      >
      </button>
    </div>
  </div>
</template>
