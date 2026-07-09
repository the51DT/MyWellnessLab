<script>
import TextDatePicker from '@/components/TextDatePicker.vue'
import BasePopupImage from '@/views/publishing/BasePopupImage.vue'
import { bodyScroll } from '@/assets/js/common'

export default {
  name: "ChallengeSharePop",
  components: {
    TextDatePicker,
    BasePopupImage,
  },
  data () {
    return {
      missionCertImagePopup: false /* 인증사진 보기 팝업 */
    }
  },
  methods: {
    close(){
      this.$emit("popupClose")
    },
    imagePopupOpen () {
      this.missionCertImagePopup = true
    },
    imagePopupClose () {
      this.missionCertImagePopup = false
    },
  },
  mounted() {
    bodyScroll(false) /* 팝업 노출 시 body 스크롤 정지 */
  },
  unmounted() {
    bodyScroll(true) /* 팝업 삭제 시 body 스크롤 원복 */
  },
};
</script>

<template>
  <div class="popup challengeSharePopup">
    <div class="align--between popup--header">
      <div />
      <div class="popup--tit-wrap">
        <span class="popup--tit"><slot name="title" /></span>
      </div>
      <div>
        <button @click="close" type="button" class="popup--close" />
      </div>
    </div>
    <div class="challenge-share">
      <div class="challenge-share--title">이미지를 저장하여 <span>SNS로 </span>공유해 보세요!</div>
      <div class="mission-wrap">
        <div class="mission-img">
          <div class="img-wrap">
            <img class="img-comp" src="/img/img_home_daily_comp.png" />
            <img class="img-uploaded" src="/img/img_daily_exam.png" />
          </div>
          <div class="text-wrap">
            <p class="date">2026.09.23 (월)</p>
            <p class="title">나의 미션 인증 횟수</p>
            <p class="num"><span>2</span>회</p>
          </div>
          <div class="share-btn-wrap">
            <button class="share-btn"></button>
          </div>
        </div>
      </div>
      <TextDatePicker 
        :pointColor="'pink'"
        :showDetail="true"
        :titleText="'나의 챌린지 참여 현황'"
        :success-dates="[
          '2026-07-01',
          '2026-07-02',
          '2026-07-03',
          '2026-07-04',
          '2026-07-05',
          '2026-07-07',
        ]"
        :mission-ranges="[
          {
            start: new Date(2026, 6, 1),
            end: new Date(2026, 6, 21)
          },
        ]"
        @success-date-click="imagePopupOpen"
      />
      <div class="btn-wrap">
        <button class="kakao">카카오로 공유</button>
        <button>오늘 인증 이미지 저장</button>
        <button>전체 이미지 저장</button>
      </div>
    </div>
  </div>

  <!-- 인증사진 보기 팝업 -->
  <BasePopupImage v-if="missionCertImagePopup" @popupClose="imagePopupClose"></BasePopupImage>
</template>



