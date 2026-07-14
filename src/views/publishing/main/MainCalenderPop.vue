<script>
import TextDatePicker from '@/components/TextDatePicker.vue'
import BasePopupImage from '@/views/publishing/BasePopupImage.vue'
import ChallengeSharePop from '@/views/publishing/challenge/ChallengeSharePop.vue'
import { bodyScroll } from '@/assets/js/common'

export default {
  name: "MainCalenderPop",
  components: {
    TextDatePicker,
    BasePopupImage,
    ChallengeSharePop,
  },
  data () {
    return {
      missionCertImagePopup: false, /* 인증사진 보기 팝업 */
      sharePopup: false /* 공유하기 팝업 */
    }
  },
  props: {
    successDates: {
      type: Array,
    },
  },
  emits: ["popupClose"],
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
    sharePopupOpen () {
      this.sharePopup = true
    },
    sharePopupClose () {
      this.sharePopup = false
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
    <div class="popup-date-picker">
      <TextDatePicker 
        :success-dates="successDates"
        @success-date-click="imagePopupOpen"
      />
    </div>
    <div class="pop-btn-wrap">
      <button type="button" @click="sharePopupOpen" class="pop-btn pop-btn--green">인증 공유하기</button>
    </div>
  </div>

  <!-- 인증사진 보기 팝업 -->
  <BasePopupImage v-if="missionCertImagePopup" @popupClose="imagePopupClose"></BasePopupImage>

  <!-- 공유하기 팝업 -->
  <ChallengeSharePop v-if="sharePopup" @popupClose="sharePopupClose"></ChallengeSharePop>
</template>



