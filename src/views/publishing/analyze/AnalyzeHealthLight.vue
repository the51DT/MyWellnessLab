<script>
import BaseTooltip from '../BaseTooltip.vue'
import router from '@/router'
import BasePopupTit from '@/views/publishing/BasePopupTit.vue'
import AnalyzeHealthLightPopup from '@/views/publishing/analyze/AnalyzeHealthLightPopup.vue'
import { useStore } from 'vuex'
import { defineProps } from 'vue'

export default {
  name: 'AnalyzeHealthLight',
  components: {
    AnalyzeHealthLightPopup,
    BasePopupTit,
    BaseTooltip
  },

  data () {
    return {
      tooltip: false, /* 툴팁 오프너 */
      tooltipEdge: 0, /* 231205 툴팁 꼬다리 위치때문에 추가 */
      danger: ['간 건강', '근육(근력)', '피로개선', '수면 건강', '체지방', '운동 수행 능력(지구력)', '항산화', '혈중 지질 개선'], /* 위험 내용 */
      caution: ['긴장완화', '혈압 조절', '혈행 개선'], /* 주의 내용 */
      interest: ['피로개선', '혈중 지질 개선'] /* 관심 내용 */
    }
  },
  setup () {
    const props = defineProps({
      detailId: Number,
      clusterList: {
        Cluster_ID: String,
        Cluster_NAME: String,
        Cluster_State: String
      },
      sendData: Object,
      isOneTime: {
        type: Boolean,
        default: false
      },
      user: {
        type: Object,
        default: null
      }
    })
    const store = useStore()
    return {
      props,
      store
    }
  },
  methods: {
    tooltipClose () { /* 툴팁 닫기 */
      this.tooltip = false
    },
    openTooltip ($event) { /* 툴팁 열기 */ /* 231205 변수 추가 */
      this.tooltip = true
      this.tooltipEdge = $event.x /* 231205 추가 */
    },
    detailView () { /* 자세히 보기 이동 */
      router.push('/analyze-health-light-detail')
    },
    detailView2 () { /* 자세히 보기 이동 */
      this.store.dispatch('analyze/setAnalysisSendData', this.props.sendData)
      this.store.dispatch('analyze/setHealthLightParams', { detailId: this.props.detailId })
      router.push({
        path: '/analyze/health-light'
      })
    }
  }
}
</script>

<template>
  <div class="AnalyzeHealthLight">
    <div class="tooltip AnalyzeHealthLight--tooltip">
      <h2 class="tooltip--tit AnalyzeHealthLight--tip-tit">건강 신호등</h2>
      <button
        @click="openTooltip($event)"
        class="btn--tooltip AnalyzeHealthLight--tip-btn"
        type="button"
        title="도움말" /> <!--231205 함수 변수 추가-->

      <base-tooltip
        v-if="tooltip"
        :leftLoca="tooltipEdge"
        @tooltipClose="tooltipClose"
        class="AnalyzeHealthLight--tip-dom"> <!--231205 프롭 추가-->
        <template v-slot:contents>
          <p class="AnalyzeHealthLight--tip-txt">나의 건강 점수와 건강 위험 요인 결과를 바탕으로 인체 생리 네트워크에서 나의 건강 신호등을 확인할 수 있습니다 내가 신경 써야 할
            건강분야와 건강을 향상시키고 싶은 건강관심분야를 확인할 수 있습니다</p>
        </template>
      </base-tooltip>

    </div>

    <div class="analyze-box"> <!--231205 div 추가-->
      <p class="AnalyzeHealthLight--info">
        <strong class="AnalyzeHealthLight--danger">{{ danger.length }}가지</strong>분야에 주의하셔야 하고,
        <strong class="AnalyzeHealthLight--caution">{{ caution.length }}가지</strong>분야에 관리가 필요하며,
        <strong class="AnalyzeHealthLight--interest">{{ interest.length }}가지</strong>분야에 관심을 가지고 있습니다
      </p>

      <div class="AnalyzeHealthLight--light">
        <!--        231205 버튼 아래로 이동-->
        <div class="AnalyzeHealthLight--light-unit danger">
          <span class="AnalyzeHealthLight--light-label" />주의
          <p class="AnalyzeHealthLight--light-p">
            <span v-for="item in danger" class="AnalyzeHealthLight--light-item">{{ item }} </span>
            <span v-if="danger.length === 0">위험 항목이 없습니다.</span>
          </p>
        </div>
        <div class="AnalyzeHealthLight--light-unit caution">
          <span class="AnalyzeHealthLight--light-label" />관리
          <p class="AnalyzeHealthLight--light-p">
            <span v-for="item in caution" class="AnalyzeHealthLight--light-item">{{ item }} </span>
            <span v-if="caution.length === 0">주의 항목이 없습니다.</span>
          </p>
        </div>
        <div class="AnalyzeHealthLight--light-unit interest">
          <span class="AnalyzeHealthLight--light-label" />관심
          <p class="AnalyzeHealthLight--light-p">
            <span v-for="item in interest" class="AnalyzeHealthLight--light-item">{{ item }} </span>
            <span v-if="interest.length === 0">관심 항목이 없습니다.</span>
          </p>
        </div>

        <div class="AnalyzeHealthLight--light-btn-wrap">
          <button
            @click="detailView2"
            type="button"
            class="AnalyzeHealthLight--light-btn">자세히 보기</button>
        </div>

      </div>

      <p class="AnalyzeHealthLight--network">* 인체 생리 네트워크는 나의 건강 위험요소와 건강 사이의 관련성을 고려하여 복잡한 관계를 연결한 생리적 네트워크입니다</p>
      <div class="AnalyzeHealthLight--more">
        <button @click="this.$refs.popup.isPopup = true" type="button" class="AnalyzeHealthLight--more-btn">더보기</button>
      </div>

    </div>

    <AnalyzeHealthLightPopup ref="popup" />

  </div>
</template>

<style scoped></style>
