<script>
import BasePopupTit from '@/views/publishing/BasePopupTit.vue'

export default {
  name: 'AnalyzeHealthLightPopup',
  components: { BasePopupTit },

  data () {
    return {
      isPopup: false /* 팝업 오프너 */
    }
  },
  methods: {
    popupClose () { /* 팝업 닫기 */
      this.isPopup = false
    }
  }
}
</script>

<template>
  <base-popup-tit v-if="isPopup" @popupClose="popupClose" class="AnalyzeHealthLight--popup">
    <template v-slot:title>
      인체 생리 네트워크
    </template>
    <template v-slot:contents>
      <ul class="AnalyzeHealthLight--net-txt">
        <li>인체 생리 네트워크(Physiological Phenotypic Map)는 나의 건강 위험요소와 건강 사이의 관련성을 고려하여 복잡한 관계를 연결한 생리적 네트워크입니다</li>
        <li>인체 생리 네트워크는 식품의약품안전처 건강기능식품 평가 가이드, 한국식품연구원 건강 기능식품 플랫폼, 세계적으로 공인된 설문지 등의 과학적인 근거 자료를 바탕으로 설계되었습니다</li>
        <li>인체 생리 네트워크에 기반한 나의 건강신호등을 통해 종합적인 생활습관 성형을 시작할 수 있습니다</li>
      </ul>
      <div class="AnalyzeHealthLight--net-img-wrap">
        <img src="/img/human.png" alt="인체 생리 네트워크" class="AnalyzeHealthLight--net-img" />
      </div>
    </template>
  </base-popup-tit>
</template>

<style scoped></style>
