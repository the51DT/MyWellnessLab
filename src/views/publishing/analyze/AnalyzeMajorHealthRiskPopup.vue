<script setup>

import BasePopupTit from '@/views/publishing/BasePopupTit.vue'
import { getCurrentInstance, ref } from 'vue'

const props = defineProps({
  isPop: Boolean
})
const instance = getCurrentInstance()
const prefix = 'AnalyzeMajorHealthRiskPopup' /* 231211 클래스 접두어 */
const myStat = 'danger' /* 231211 내 체질량 지수 글씨 색상 변경위한 임시 변수 */
const data = ref([
  {
    name: '허리둘레',
    my: 28,
    unit: 'cm',
    normal: '남: 90 미만, 여: 85 미만',
    txt: '허리둘레는 복부비만을 판정할 수 있는 신체계측치입니다. 체질량지수로는 확인되지 않은 마른 비만도 확인할 수 있기 때문에 체질량지수와 함께 관심을 가지는 것이 좋습니다.\n' +
      '복부비만인 경우, 고혈압, 공복혈당장애, 고중성지방, 낮은HDL콜레스테롤을 주의해야 합니다. 이들 위험요인이 있으면 심뇌혈관의 질환 발생 위험이 커지고 다른 만성질환을 유발할 수 있어 주의해야 합니다.\n' +
      '허리둘레가 성인 남자 90cm 이상, 성인 여자 85cm 이상이면 복부 비만입니다.'
  },
  {
    name: '체질량지수',
    my: 38,
    unit: 'kg/m2',
    normal: '18.5 ~ 22.9',
    txt: '체질량지수는 키와 몸무게를 이용해 간접적으로 비만 위험도를 측정하는데 사용됩니다. 단, 체질량지수는 근육과 지방 무게를 구별하지 못하므로 참고만 하는 것이 좋습니다.\n' +
      '체질량지수가 너무 낮거나 너무 높으면 사망률이 높아지는 상관관계가 있습니다.\n' +
      '체질량지수가 18.5~22.9 사이면 정상 범위에 속하며, 비만으로 인한 질병이나 사망에 대한 위험도는 상대적으로 낮다고 볼 수 있습니다.'
  },
  {
    name: '수축기혈압',
    my: 138,
    unit: 'mmHg',
    normal: '120 미만',
    txt: '혈압은 동맥혈관 벽에 대항한 혈액의 압력을 말합니다. 혈액의 압력은 심장이 수축하여 동맥혈관을 통해 온 몸으로 혈액을 내보낼 때 가장 높은데, 이때의 혈압을 수축기 혈압이라고 합니다. \n' +
      '고혈압은 동맥 혈압이 정상보다 높아진 상태이며, 혈압이 높을수록 심장병과 뇌졸중에 미치는 영향은 크게 증가하는 것으로 알려져 있습니다. \n' +
      '수축기 혈압이 120 ~139 mmHg 사이면 고혈압 주의, 140mmHg 이상이면 고혈압으로 진단됩니다. '
  }
])
const startIndex = ref(0) /* 231211 보여지는 데이터 인덱스 */

function popupClose() { /* 231211 팝업 닫기 */
  instance.emit('popupClose')
}
function prev(index) { /* 231211 이전 지수 */
  if (index === 0) {
    return
  }
  startIndex.value = index - 1
}
function next(index) { /* 231211 이후 지수 */
  if (index < data.value.length - 1) {
    startIndex.value = index + 1
  }
}
</script>

<template>
  <base-popup-tit v-if="props.isPop" @popupClose="popupClose">
    <template v-slot:title>
      주요 건강 위험 요인
    </template>
    <template v-slot:contents>
      <div v-for="item in data.slice(startIndex, startIndex + 1)" :class="prefix">
        <div :class="prefix + '--header'">
          <div :class="prefix + '--prev'">
            <button @click="prev(startIndex)" type="button" aria-label="이전" :class="prefix + '--prev-btn'"></button>
          </div>
          <div :class="prefix + '--tit'">
            <span>{{ item.name }}</span>
          </div>
          <div :class="prefix + '--next'">
            <button @click="next(startIndex)" type="button" aria-label="다음" :class="prefix + '--next-btn'"></button>
          </div>
        </div>
        <div :class="prefix + '--con'">

          <div class="txt--right AnalyzeCheckupDataRecord--label">
            <span class="AnalyzeCheckupDataRecord--label-wrap">
              <span class="AnalyzeCheckupDataRecord--label-rect bora"></span> 한국인 평균
            </span>
            <span class="AnalyzeCheckupDataRecord--label-wrap">
              <span class="AnalyzeCheckupDataRecord--label-rect green"></span> 나의 위치
            </span>
          </div>
          <div class="bar--wrap">
            <!--            <img src="/img/chart/bar/tracking-normal.svg" alt="" /> &lt;!&ndash;Bar 그래프&ndash;&gt;-->
            <div class="bar bar2"></div> {{ props.sendData }}
            <div class="bar--unit">
              <div class="bar--unit-start">정상</div>
              <div class="bar--unit-middle">주의</div>
              <div class="bar--unit-end">위험</div>
            </div>
            <div class="bar--average" :style="'left: ' + wePoint + '%'"></div> <!-- 한국인 평균 도트 -->
            <img src="/img/ico_me.svg" class="bar--me" :style="'left: ' + myPoint + '%'" alt="" /> <!-- 나의 위치 아이콘 -->
          </div>

          <dl :class="prefix + '--index'">
            <dt :class="prefix + '--dt t1'">나의 {{ item.name }} <span>({{ item.unit }})</span></dt>
            <dd
              :class="[prefix + '--dd a1', myStat === 'danger' ? 'danger' : myStat === 'caution' ? 'caution' : myStat === 'normal' ? 'normal' : '']">
              {{ item.my }}</dd> <!--231211 내 지수에 따라 클래스 변경해서 적용 바람-->
            <!--            <dt :class="prefix + '&#45;&#45;dt t2'">정상(권고) 범위 <span>({{item.unit}})</span></dt>-->
            <!--            <dd :class="prefix + '&#45;&#45;dd a2'">{{item.normal}}</dd>-->
          </dl>
          <hr class="gray2" :class="[prefix + '--hr']">
          <p v-html="item.txt" :class="prefix + '--txt'"></p>
        </div>
      </div>
    </template>
  </base-popup-tit>
</template>

<style scoped></style>
