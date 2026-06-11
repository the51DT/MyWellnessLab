<script>
import BasePopup from '../BasePopup.vue'
import BaseTooltip from '../BaseTooltip.vue'
import AnalyzeCheckupData from './AnalyzeCheckupData.vue'
import AnalyzeHealthLocation from './AnalyzeHealthLocation.vue'
import AnalyzeAgingInhibitionAnalyzeIndex from './AnalyzeAgingInhibitionAnalyzeIndex.vue'
import AnalyzeChronicDiseaseControlAnalyzeIndex from '@/views/publishing/analyze/AnalyzeChronicDiseaseControlAnalyzeIndex.vue'
import AnalyzeAgingSpeed from '@/views/publishing/analyze/AnalyzeAgingSpeed.vue'
import AnalyzeHealthLight from '@/views/publishing/analyze/AnalyzeHealthLight.vue'
import AnalyzeMajorHealthRisk from '@/views/publishing/analyze/AnalyzeMajorHealthRisk.vue'
import AnalyzeABCHealthGrade from '@/views/publishing/analyze/AnalyzeABCHealthGrade.vue'
import AnalyzeDownload from '@/views/publishing/analyze/AnalyzeDownload.vue'

export default {
  name: 'AnalyzeDetail',
  components: {
    AnalyzeDownload,
    AnalyzeABCHealthGrade,
    AnalyzeMajorHealthRisk,
    AnalyzeHealthLight,
    AnalyzeAgingSpeed,
    AnalyzeChronicDiseaseControlAnalyzeIndex,
    AnalyzeAgingInhibitionAnalyzeIndex,
    AnalyzeHealthLocation,
    AnalyzeCheckupData,
    BaseTooltip,
    BasePopup
  },
  data() {
    return {
      popupReportDown: true, /* 일회성 분석결과 진입 시 뜨는 팝업 오프너, 일회성인지 개발 적용 요망 */
      menu: ['건강 위치', '노화 속도', '노화 억제 분석 지수', '만성질환 억제 분석 지수', '건강 신호등', '주요 건강 위험 요인', 'ABC 건강 등급'], /* 231219 속도를 건강위치 밑으로 이동 */

      // 상단 메뉴 드래그 관련
      isDragging: false,
      startX: 0,
      startScroll: 0,

      isPc: false, /* 231211 pc 인지 모바일인지 변수 */
      stickyTop: 110 /* 231211 상단 네비게이션 상단 마진 값 */
    }
  },
  methods: {

    reportDown(val) { /* 다운로드 */
      if (val === 'ok') {
        // 다운로드 처리 요망
      }
      this.popupReportDown = false
    },

    // 상단 메뉴 드래그 관련
    dragStart(event) {
      this.isDragging = true
      this.startX = event.clientX
      this.startScroll = this.$refs.scrollContainer.scrollLeft
    },
    drag(event) {
      if (!this.isDragging) return
      const x = event.clientX
      const delta = (this.startX - x)
      this.$refs.scrollContainer.scrollLeft = this.startScroll + delta
    },
    dragEnd() {
      this.isDragging = false
    },
    winWidth() { /* 231211 브라우저 가로 사이즈 체크 */
      this.isPc = window.innerWidth > 920
    },
    move(event, tg) {
      const target = document.getElementById('g' + tg)
      // const tgTop = [-110, -110, -110, -110, -110, -110, -110, -110]

      if (this.isPc) { /* 231207 반응형에서 pc일 때 윗 높이가 달라 추가 */
        this.stickyTop = 150
      } else {
        this.stickyTop = 110
      }

      window.scrollBy({ top: target.getBoundingClientRect().top - this.stickyTop, behavior: 'smooth' })

      const btns = document.querySelectorAll('.AnalyzeDetail--menu-btn')
      for (let i = 0; i < btns.length; i++) {
        btns[i].classList.remove('active')
      }
      event.target.classList.add('active')
    }

  },
  mounted() { /* 231211 함수 적용 */
    this.winWidth()
    window.addEventListener('resize', () => { /* 브라우저 가로 사이즈 체크 */
      this.winWidth()
    })
  }
}

</script>

<template>
  <section class="container AnalyzeDetail">

    <div class="AnalyzeDetail--menu--cover">
      <div class="AnalyzeDetail--menu" @mousedown="dragStart" @mousemove="drag" @mouseup="dragEnd" ref="scrollContainer">
        <button v-for="(item, index) in menu" @click="move($event, index)" type="button"
          class="AnalyzeDetail--menu-btn">{{ item }}</button>
      </div>
    </div>
    <AnalyzeCheckupData /> <!--홍길동님의 마이웰니스랩 분석결과입니다, 머리말-->
    <AnalyzeHealthLocation id="g0" /> <!--건강 위치-->
    <AnalyzeAgingSpeed id="g1" /> <!--노화 속도--> <!--231219 속도 여기로 이동 id값 변경-->
    <AnalyzeAgingInhibitionAnalyzeIndex id="g2" /> <!--노화 억제 분석 지수--> <!--231219 id 변경-->
    <AnalyzeChronicDiseaseControlAnalyzeIndex id="g3" /> <!--만성질환 억제 분석 지수--> <!--231219 순서 변경, id변경-->
    <AnalyzeHealthLight id="g4" /> <!--건강 신호등-->
    <AnalyzeMajorHealthRisk id="g5" /> <!--주요 건강 위험 요인-->
    <AnalyzeABCHealthGrade id="g6" /> <!--ABC 건강 등급-->
    <AnalyzeDownload /> <!--다운로드 버튼 등-->

  </section>

  <base-popup v-if="popupReportDown">
    <template v-slot:contents>
      <p class="AnalyzeDetail--pop--txt">마이웰니스 랩 분석 결과</p>
      <p class="AnalyzeDetail--pop--txt2">리포트 파일을 다운로드 해주세요</p>
      <div class="align--between AnalyzeDetail--pop--btn-wrap">
        <div class="AnalyzeDetail--pop--l">
          <button @click="reportDown('no')" type="button" class="AnalyzeDetail--pop--cancel">취소</button>
        </div>
        <div class="AnalyzeDetail--pop--r">
          <button @click="reportDown('ok')" type="button" class="AnalyzeDetail--pop--confirm">확인</button>
        </div>
      </div>
    </template>
  </base-popup>
</template>

<style lang="scss"></style>
