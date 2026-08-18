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
      badges: [
        { id: 'mission_streak_10', img: 'badge--mission_streak_10.svg', label: '10일 연속 인증' },
        { id: 'mission_streak_20', img: 'badge--mission_streak_20.svg', label: '20일 연속 인증' },
        { id: 'mission_streak_30', img: 'badge--mission_streak_30.svg', label: '30일 연속 인증' },
        { id: 'mission_streak_60', img: 'badge--mission_streak_60.svg', label: '60일 연속 인증' },
        { id: 'mission_streak_90', img: 'badge--mission_streak_90.svg', label: '90일 연속 인증' },
        { id: 'event_figure_richDevos', img: 'badge--event_figure_richDevos.svg', label: '리치 디보스 탄생일' },
        { id: 'event_figure_jayVanAndel', img: 'badge--event_figure_jayVanAndel.svg', label: '제이 벤 엔델 탄생일' },
        { id: 'amway_global', img: 'badge--amway_global.svg', label: '한국암웨이 창립기념일' },
        { id: 'founders_day', img: 'badge--amway_global.svg', label: '파운더스데이' },
        { id: 'happy_new_year', img: 'badge--happy_new_year.svg', label: '새해 첫날' },
        { id: 'happy_chuseok', img: 'badge--happy_chuseok.svg', label: '추석' },
        { id: 'mission_start', img: 'badge--mission_start.svg', label: '첫 인증' },
        { id: 'family_day', img: 'badge--family_day.svg', label: '패밀리데이' },
        { id: 'childrens_day', img: 'badge--childrens_day.svg', label: '어린이날' },
        { id: 'octopus_mode', img: 'badge--octopus_mode.svg', label: '문어발' },
        { id: 'happy_birthday', img: 'badge--happy_birthday.svg', label: '나의 생일' },
        { id: 'returning_hero', img: 'badge--returning_hero.svg', label: '복귀왕' },
        { id: 'early_bird', img: 'badge--early_bird.svg', label: '얼리 것모너' },
        { id: 'womens_day', img: 'badge--womens_day.svg', label: '세계 여성의날' },
        { id: 'earth_day', img: 'badge--earth_day.svg', label: '지구의 날' },
        { id: 'halloween_hustler', img: 'badge--halloween_hustler.svg', label: '고스트 것모닝' },
        { id: 'valentines_day', img: 'badge--valentines_day.svg', label: '스윗 것모닝' },
        { id: 'liberation_day', img: 'badge--liberation_day.svg', label: '광복절' },
        { id: 'summer_gutmoring', img: 'badge--summer_gutmoring.svg', label: '썸머 것모닝' },
        { id: 'winter_gutmoring', img: 'badge--winter_gutmoring.svg', label: '윈터 것모닝' },
        { id: 'merry_christmas', img: 'badge--merry_christmas.svg', label: '메리 크리스마스' },
        { id: 'best_teammate', img: 'badge--best_teammate.svg', label: '베스트 팀메이트' },
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