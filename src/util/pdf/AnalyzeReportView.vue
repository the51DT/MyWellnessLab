<script setup>
import BasePopup from "../../BasePopup.vue";
import AnalyzeCheckupData from "../AnalyzeCheckupData.vue";
import AnalyzeHealthLocation from "../AnalyzeHealthLocation.vue";
import AnalyzeScorecomAnalyzeIndex from "@/components/analyze/AnalyzeScorecomAnalyzeIndex.vue";
import AnalyzeAgingSpeed from "@/components/analyze/AnalyzeAgingSpeed.vue";
import AnalyzeHealthLight from "@/components/analyze/AnalyzeHealthLight.vue";
import AnalyzeMajorHealthRisk from "@/components/analyze/AnalyzeMajorHealthRisk.vue";
import AnalyzeABCHealthGrade from "@/components/analyze/AnalyzeABCHealthGrade.vue";

import router from "@/router";
import {useStore} from 'vuex';
import { ref, inject, computed, watch, onBeforeMount, onMounted, toRaw  } from 'vue';

const store = useStore();
const axios = inject('$axios');
const token = store.getters.getToken;
const api = import.meta.env.VITE_GLOB_BASE_API_URL + "/v1/api/user/analysis/complete/";

console.log(history.state)

const header = {
  Authorization: token,
};
console.log('############## bbb')
const popupLoading = ref(false); //로딩

const echartAgingInhibitionAnalyze = ref(null); //노화억제
const echartChronicDiseaseControlAnalyze = ref(null); //만성질환

//실제 데이터
const isDownload = ref(history.state.isDownload);
const oriData = ref(history.state.oriData);

const analyzeData = computed(() => {
  let obj = {};

  if(oriData.value.analyzeData !== undefined) {
    obj.analyzeData = oriData.value.analyzeData;
  }

  return obj;
});

const detailId = computed(() => {
  let idx = 0;
  if(oriData.value.analyzeData !== undefined) {
    idx = oriData.value.analyzeData.id;
  }
  return idx;
});

const sendData = computed(() => {
  let obj = {};

  if(oriData.value.analyzeData !== undefined) {
    obj.analyzeAge = oriData.value.analyzeData.age;
    obj.hqData = oriData.value.analyzeData.hqData;
    obj.hqDataList = oriData.value.analyzeData.hqDataList;
    obj.heStatus = oriData.value.analyzeData.heStatus;
    obj.hqReference = oriData.value.analyzeData.hqReference;
    obj.hcrData = oriData.value.analyzeData.hcrData;
    obj.hcrReference = oriData.value.analyzeData.hcrReference;
    obj.commonInfo = oriData.value.surveyData.commonInfo;
    obj.basics = oriData.value.surveyData.basics;

    obj.comphckData = oriData.value.analyzeData.comphckData; //생활습관 판정
    obj.ariData = oriData.value.analyzeData.ariData;         //노화속도 영향요인 데이터
    obj.ariStatus = oriData.value.analyzeData.ariStatus;     //노화속도 영향요인 판정
    obj.ariMean = oriData.value.analyzeData.ariMean;         //노화속도 영향요인 평균
    obj.ariMax = oriData.value.analyzeData.ariMax; 
    obj.ariRisk = oriData.value.analyzeData.ariRisk;
  }

  return obj;
});

console.log(toRaw(sendData.value))


onMounted(() => {
  console.log('############## aaa')
});

</script>

<template>
  <section class="container AnalyzeDetail">
    <!-- 표지 -->
    <!-- INTRODUCTIOn -->

    <!-- Ch.1 결과요약 -->
    <!-- 검진이력 -->

    <!-- Ch.2 건강 점수 -->
    <!-- 건강위치 예시 -->
    <!-- 건강점수 예시 -->
    <!-- 나의 건강 위치 -->
    <!-- 나의 노화억제분석지수 -->
    <!-- 나의 만성질환 억제 분석 지수 -->
    <!-- 노화 속도 예시 -->
    <!-- 나의 노화 속도 -->
    <!-- Ch.3 건강 내비게이션 -->
    <!-- 나의 노화 속도에 영향을 미치는 요인 -->
    <!-- 건강 위험 요인  -->
    <!-- 인체생리네트워크 -->
    <!-- 나의 건강신호등 -->
    <!-- 건강관심분야 -->
    <!-- ABC 건강 등급 및 변화패턴 예시 -->
    <!-- 나의 ABC 건강 등급 변화 -->
    <!-- 참고문헌 -->


    
    <AnalyzeCheckupData :isReport="true" :sendData="sendData"/> <!--홍길동님의 마이웰니스랩 분석결과입니다, 머리말-->
    
    <AnalyzeHealthLocation id="g0" :isReport="true" :sendData="sendData"/> <!--건강 위치-->
    
    <AnalyzeAgingSpeed id="g3" :isReport="true" :sendData="sendData" /> <!--노화 속도-->
    
    <AnalyzeScorecomAnalyzeIndex id="g1" ref="echartAgingInhibitionAnalyze" :isReport="true" :compId="`AnalyzeAgingInhibitionAnalyzeIndex`" :detailId="detailId" :title="`노화 억제 분석 지수`" :sendData="sendData" /> 
    
    <AnalyzeScorecomAnalyzeIndex id="g2" ref="echartChronicDiseaseControlAnalyze" :isReport="true" :compId="`AnalyzeChronicDiseaseControlAnalyzeIndex`" :detailId="detailId" :title="`만성질환 억제 분석 지수`" :sendData="sendData"/>
    
    <AnalyzeHealthLight id="g4" :clusterList="analyzeData.clusterList" :isReport="true" :detailId="analyzeData.id" /> <!--건강 신호등-->
    
    <AnalyzeMajorHealthRisk id="g5" :isReport="true" :sendData="sendData"/> <!--주요 건강 위험 요인-->
    
    <AnalyzeABCHealthGrade id="g6" :isReport="true" :sendData="sendData" /> <!--ABC 건강 등급-->

  </section>

  <base-popup v-if="popupLoading"> <!--aos, pc 파일다운로드 시 나타나는 팝업-->
    <template v-slot:contents>

      <div class="AnalyzeDownload--down-pop--aos"> <!--aos, pc-->
        <div class="AnalyzeDownload--down-pop--aos-txt">
          {{ $t('popup.loading.text') }} 
          <div class="AnalyzeDownload--down-pop--load">{{ $t('popup.loading.image') }} </div>
        </div>
        <div class="AnalyzeDownload--down-pop--cancel-wrap">
          <button @click="downCancel()" type="button" class="AnalyzeDownload--down-pop--cancel">{{ $t('Common.cancle') }} </button>
        </div>
      </div>
      
    </template>
  </base-popup>

</template>

<style lang="scss">

</style>