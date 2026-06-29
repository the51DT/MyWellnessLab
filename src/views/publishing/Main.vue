<script>
import { ref } from 'vue'
import BasePopupTit from '@/views/publishing/BasePopupTit.vue'

export default {
  name: 'Main',
  components: {
    BasePopupTit,
  },
  data () {
    return {
      isAnalyze: false, /* 퍼블 확인용 분석했는지 */
      isScroll: false,
      isBottom: false,
      popup: ref(false), /* 퍼블 확인용 팝업 */
      selectMisson: ref(false), /* 퍼블 확인용 미션선택 */
    }
  },
  methods: {
    winWidth () { /* 브라우저 가로 사이즈 체크 */
      this.isScroll = window.scrollY > 200
      if (window.scrollY > 500) {
        this.isBottom = true
      } else {
        this.isBottom = false
      }
    },
    /*  팝업 열기 */
    popupOpen () {
      popup.value = true
    },
    /* 팝업 닫기 */
    popupClose () {
      popup.value = false
    }
  },
  mounted () {
    this.winWidth()
    window.addEventListener('scroll', () => {
      this.winWidth()
    })
  }
}
</script>

<template>
  <section class="main">
    <div class="main--analyze">
      <div v-if="!isAnalyze" class="main--analyze--before"> <!-- 건강수명분석 전 -->
        <video class="main--analyze--video" :src="'/img/video_main_graph.mp4'" autoplay muted playsinline></video>
        <p>나만의 추천 미션 확인을 위해,</p>
        <a @click="openTerms" href="javascript:void(0)" class="main--analyze--link">건강수면 분석<br>시작하기</a>
      </div>
      <div v-else class="main--analyze--after"> <!-- 건강수명분석 후 -->
        22
      </div>
      <div class="main--analyze--btm">
        <button @click="selectMisson = true">
          <span v-if="!isAnalyze">미션 선택하기</span> <!-- 건강수명분석 전 -->
          <span v-else>나의 추천 미션 보기</span> <!-- 건강수명분석 후 -->
        </button>
      </div>
    </div>
    <div class="main--misson">
      <div class="main--misson">
        
      </div>
    </div>
    <div class="main--team">
      123125
    </div>
  </section>
  
  <BasePopupTit v-if="selectMisson">
    <template v-slot:title>미션 선택하기</template>
    <template v-slot:contents>
      <div class="pop-btn-wrap">
        <button type="button" @click="selectMisson = false" class="pop-btn pop-btn--green">선택 완료</button>
      </div>
    </template>
  </BasePopupTit>
</template>

<style lang="scss" scoped>
</style>
