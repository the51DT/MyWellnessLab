<script>
import BadgeDefault from '@/views/publishing/BadgeDefault.vue'
import { bodyScroll } from '@/assets/js/common'

export default {
  name: 'MyBadgeSetting',
  props: {
  },
  components: {
    BadgeDefault,
  },
  data () {
    return {
      isBottom: false, /* 퍼블 확인용 하단 도착 여부 */
      bottomObserverInstance: null, /* 퍼블 확인용 하단 옵저버 */
      selectedBadgeId: 'mission_streak_20',  /* 퍼블 확인용 대표 배지 임의 지정 */
      badges: [ /* 260904 배지 컨펌 버전으로 교체 */
        { id: 'mission_streak_10', img: 'badge--mission_streak_10.svg', label: '10일 연속 인증' },
        { id: 'mission_streak_20', img: 'badge--mission_streak_20.svg', label: '20일 연속 인증' },
        { id: 'mission_streak_30', img: 'badge--mission_streak_30.svg', label: '30일 연속 인증' },
        { id: 'mission_streak_60', img: 'badge--mission_streak_60.svg', label: '60일 연속 인증' },
        { id: 'mission_streak_90', img: 'badge--mission_streak_90.svg', label: '90일 연속 인증' },
        { id: 'amway_global', img: 'badge--amway_global.svg', label: '한국암웨이 창립기념일' },
        { id: 'founders_day', img: 'badge--amway_global.svg', label: '파운더스데이' },
        { id: 'happy_new_year', img: 'badge--happy_new_year.svg', label: '새해 첫날' },
        { id: 'mission_start', img: 'badge--mission_start.svg', label: '첫 인증' },
        { id: 'octopus_mode', img: 'badge--octopus_mode.svg', label: '문어발' },
        { id: 'happy_birthday', img: 'badge--happy_birthday.svg', label: '나의 생일' },
      ],
    }
  },
  methods: {
    selectBadge(id) {
      this.selectedBadgeId = id
    },
    confirmSelection() {
      this.$router.back()
    },
    goBack() {
      this.$router.back()
    },
    close(){
      this.$emit("popupClose")
    },
  },
  mounted() {
    bodyScroll(false) /* 팝업 노출 시 body 스크롤 정지 */

    this.bottomObserverInstance = new IntersectionObserver(
      ([entry]) => {
        this.isBottom = entry.isIntersecting
      },
      {
        threshold: 1
      }
    )

    if (this.$refs.bottomObserver) {
      this.bottomObserverInstance.observe(this.$refs.bottomObserver)
    }
  },
  unmounted() {
    if (this.bottomObserverInstance) {
      this.bottomObserverInstance.disconnect()
    }

    bodyScroll(true) /* 팝업 삭제 시 body 스크롤 원복 */
  },
}
</script>

<template>
  <div class="popup MyBadgeSetting">
    <div class="represent__pop">
      <div class="align--between popup--header">
        <div />
        <div class="popup--tit-wrap">
          <span class="popup--tit"><slot name="title" /></span>
        </div>
        <div>
          <button @click="close" type="button" class="popup--close" />
        </div>
      </div>
      <div class="activity__area_badge-section">        
        <div class="badge-box-wrap">
          <button
            v-for="badge in badges"
            :key="badge.id"
            type="button"
            class="badge-box badge-setting__card"
            :class="{ 'is-selected': selectedBadgeId === badge.id }"
            @click="selectBadge(badge.id)"
          >
            <BadgeDefault :img="badge.img">{{ badge.label }}</BadgeDefault>
          </button>
        </div>
      </div>
      <div class="btn-area ty02" :class="{ 'is-bottom': isBottom }">
        <button class="custom-btn-light" type="button" @click="goBack">취소</button>
        <button class="custom-btn" type="button" @click="confirmSelection">확인</button>
      </div>
      <div ref="bottomObserver" class="sticky-trigger"></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
</style>