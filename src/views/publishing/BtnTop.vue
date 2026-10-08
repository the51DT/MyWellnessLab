<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { isScrolledToBottom, TOP_OFFSET } from '@/utils/scrollPosition'

const props = defineProps({
  /*
   * 같은 자리에 다른 플로팅 버튼(나의 팀 '팀 만들기')이 있는 화면용.
   * 켜면 페이지 맨 아래에 닿았을 때만 보인다. 그 화면도 같은 기준(isScrolledToBottom)으로 자기 버튼을 숨겨야 겹치지 않는다.
   */
  bottomOnly: { type: Boolean, default: false }
})

const isVisible = ref(false)

function goTop(){ /* 231227 상단 스크롤 추가 */
  window.scrollBy({top: document.getElementById("app").getBoundingClientRect().top, behavior: "smooth"});
}

/**
 * 스크롤 핸들러
 * 맨 위에서는 숨김, 스크롤 시 항상 표시
 */
const handleScroll = () => {
  if (props.bottomOnly) {
    isVisible.value = isScrolledToBottom()
    return
  }

  const currentScrollY = window.scrollY

  if (currentScrollY > TOP_OFFSET) {
    isVisible.value = true   // 스크롤이 100px 이상이면 버튼 표시
  } else {
    isVisible.value = false  // 맨 위에 가까우면 버튼 숨김
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  // 초기 상태 설정
  handleScroll()
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <Transition name="fade">
    <div v-show="isVisible" class="btn--top">
      <button @click="goTop" type="button" :aria-label="$t('BtnTop.text1')"></button> <!--231227 상단 스크롤 클릭추가-->
    </div>
  </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>