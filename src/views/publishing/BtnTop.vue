<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const isVisible = ref(false)

function goTop(){ /*231227 상단 스크롤 추가*/
  window.scrollBy({top: document.getElementById("app").getBoundingClientRect().top, behavior: "smooth"});
}

/**
 * 스크롤 핸들러
 * 맨 위에서는 숨김, 스크롤 시 항상 표시
 */
const handleScroll = () => {
  const currentScrollY = window.scrollY
  
  if (currentScrollY > 100) {
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
      <button @click="goTop" type="button" aria-label="위로 이동"></button> <!--231227 상단 스크롤 클릭추가-->
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