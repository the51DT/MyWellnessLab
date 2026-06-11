<script>
import BasePopupTit from '../BasePopupTit.vue'
import AnalyzeChronicDiseaseControlAnalyzeIndexDetailPopup from '@/views/analyze/AnalyzeChronicDiseaseControlAnalyzeIndexDetailPopup.vue'

export default {
  name: 'AnalyzeChronicDiseaseControlAnalyzeIndexDetail',
  components: {
    AnalyzeChronicDiseaseControlAnalyzeIndexDetailPopup,
    BasePopupTit
  },
  data () {
    return {
      myIndex: 75, /* 나의 지수 */
      ages: '40~44세 여성', /* 나이대, 개발 시 적용 요망 */
      popup: false, /* 나의 변화 팝업 오프너 */
      isOneTime: true /* 일회성 분석일 경우 false, 개발 시 적용 요망 */
    }
  },
  methods: {
    /**
     * 팝업 오픈
     */
    popupOpen () {
      this.popup = true
    },
    /**
     * 팝업 종료
     */
    popupClose () {
      this.popup = false
    }
  }
}
</script>

<template>
  <div class="AnalyzeChronicDiseaseControlAnalyzeIndexDetail">
    <div class="AnalyzeChronicDiseaseControlAnalyzeIndexDetail--my">
      <h2 class="AnalyzeChronicDiseaseControlAnalyzeIndexDetail--tit">{{ $t('AnalyzeChronicDiseaseControlAnalyzeIndexDetail.text1')}}</h2>
      <div class="AnalyzeChronicDiseaseControlAnalyzeIndexDetail--index-wrap">
        <strong class="AnalyzeChronicDiseaseControlAnalyzeIndexDetail--index">{{myIndex}}</strong>{{ $t('Common.score')}} <!--231208 점수에 따라 good, normal, bad 중에 하나 클래스로 넣어 주세요-->
      </div>
      <div class="AnalyzeChronicDiseaseControlAnalyzeIndexDetail--btn-wrap">
        <button
          @click="popupOpen"
          v-if="isOneTime"
          type="button"
          class="AnalyzeChronicDiseaseControlAnalyzeIndexDetail--btn">{{ $t('AnalyzeChronicDiseaseControlAnalyzeIndexDetail.text2')}}</button>
      </div>
    </div>

    <div class="AnalyzeChronicDiseaseControlAnalyzeIndexDetail--graph-wrap">
      <p class="AnalyzeChronicDiseaseControlAnalyzeIndexDetail--age-wrap">
        <strong class="AnalyzeChronicDiseaseControlAnalyzeIndexDetail--age" >{{ages}}</strong>{{ $t('AnalyzeChronicDiseaseControlAnalyzeIndexDetail.text3')}}</p>
      <div class="AnalyzeChronicDiseaseControlAnalyzeIndexDetail--graph"> <!--그래프-->

      </div>
    </div>

    <AnalyzeChronicDiseaseControlAnalyzeIndexDetailPopup v-if="popup" @popupClose="popupClose" class="AnalyzeChronicDiseaseControlAnalyzeIndexDetail--popup" />

  </div>
</template>

<style scoped>

</style>
