<script>
import { bodyScroll } from '@/assets/js/common'

export default {
  name: "BasePopupImage",
  data() {
    return {
    };
  },
  props: {
    todayImg: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    close(){
      this.$emit("popupClose")
    }
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
  <div class="popup imgSharePopup">
    <div class="popup--wrap">
      <button @click="close" type="button" class="popup--close" aria-label="닫기"></button>
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
          <button v-if="todayImg" class="img-btn"></button>
        </div>
      </div>
    </div>
  </div>

</template>



