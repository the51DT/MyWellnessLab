<script>
/*
    사용 예시
    <AniBadge type="pin" frontImg="pin--ruby.svg" backImg="back/pin--ruby.svg"> $명칭$ </AniBadge>  
    
    - type : pin/badge 선택 
    - frontImg : 이미지 네임만 작성
    - backImg : back/이미지네임 작성
    - $명칭$ : 핀/배지 명칭 작성
*/
import { bodyScroll } from '@/assets/js/common'

export default {
  name: "BasePopupBadge",
  data() {
    return {
      // isReady: false,
    };
  },
  props: {
    type: {
      type: String,
      required: true,
    },
    frontImg: {
      type: String,
      required: true
    },
    backImg: {
      type: String,
      required: true
    }
  },
  methods: {
    startAnimation() {
      // 로딩 대기
      // await new Promise(r => setTimeout(r, 300));
      const box = this.$refs.box;
      if (!box) return;

      // 애니메이션
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          box.animate(
            [
              { offset: 0, transform: 'rotateY(0deg)' },
              { offset: 0.05, transform: 'rotateY(360deg)' },
              { offset: 0.1, transform: 'rotateY(0deg)' },
              { offset: 0.2, transform: 'rotateY(360deg)' },
              { offset: 0.3, transform: 'rotateY(0deg)' },
              { offset: 0.45, transform: 'rotateY(360deg)' },
              { offset: 0.6, transform: 'rotateY(180deg)' },
              { offset: 0.7, transform: 'rotateY(90deg)' },
              { offset: 0.75, transform: 'rotateY(45deg)' },
              { offset: 0.8, transform: 'rotateY(0deg)' },
              { offset: 0.89, transform: 'rotateY(0deg) translateY(-55px)' },
              { offset: 0.96, transform: 'rotateY(0deg) translateY(-55px)' },
              { offset: 1, transform: 'rotateY(0deg) translateY(0)' }
            ],
            { duration: 2700, easing: 'ease-in', fill: 'forwards' }
          );
        });
      });
    },
  },
  mounted() {
    this.startAnimation();
    bodyScroll(false) /* 팝업 노출 시 body 스크롤 정지 */
  },
  unmounted() {
    bodyScroll(true) /* 팝업 삭제 시 body 스크롤 원복 */
  },
};
</script>

<template>
  <div class="popup BadgeAniPopup">
    <div class="popup--wrap">
      <div ref="animationContainer" class="animation_bg"></div>
      <div class="badge">
        <div class="badge--wrap" ref="box"> <!-- :class="{ start: isReady }" -->
          <div class="badge-img badge-front">
            <img :src="frontImg" class="badge-front" />
          </div>
          <div class="badge-img badge-back">
            <img :src="backImg" class="badge-back" />
          </div>
        </div>
        <span class="badge-name">
          <slot />
        </span>
      </div>
      <div class="popup-message">
        <p>축하합니다!</p>
        <p v-if="type === 'badge'">새로운 배지를 달성했습니다!</p>
        <p v-else>새로운 마웰랩 핀을 달성했습니다!</p>
      </div>
      <div class="pop-btn-wrap">
        <button type="button" class="pop-btn pop-btn--green">보러가기</button>
      </div>
    </div>
  </div>

</template>



