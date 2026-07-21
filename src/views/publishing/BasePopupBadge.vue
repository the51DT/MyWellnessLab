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
  computed: {
    imgStyle() {
      const color = this.getShadowColor(this.frontImg);
      return {
        '--badge-shadow-color': `drop-shadow(0 .5rem 2rem ${color}80)` // 80 = 50% 투명도
      };
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
    // 배지 이미지 이름마다 shadow값 지정
    getShadowColor(img) {
      if (img.includes('challenge_perfect') || img.includes('challenge_beginner')) return '#51DFD8';
      if (img.includes('beginner') || img.includes('mission_streak')) return '#1EC159';
      if (img.includes('rookie') || img.includes('gold')) return '#FF8D2F';
      if (img.includes('bronze')) return '#B9876E';
      if (img.includes('silver')) return '#9DACAF';
      if (img.includes('platinum')) return '#636FE6';
      if (img.includes('ruby')) return '#FF5C5C';
      if (img.includes('sapphire')) return '#6E97FF';
      if (img.includes('emerald')) return '#29DEA5';
      if (img.includes('diamond') || img.includes('childrens_day')) return '#50CDFF';
      if (img.includes('founders_crown_ambassador')) return '#FF4999';
      if (img.includes('crown')) return '#A34EFF';
      if (img.includes('figure')) return '#415AFD';
      if (img.includes('amway_korea')) return '#F79C22';
      if (img.includes('amway_global')) return '#B547FF';
      if (img.includes('new_year')) return '#F98D18';
      if (img.includes('chuseok')) return '#3578FF';
      if (img.includes('mission_start')) return '#FFB80C';
      if (img.includes('family_day')) return '#B1FF7B';
      if (img.includes('octopus_mode')) return '#2F66D2';
      if (img.includes('birthday')) return '#98F055';
      if (img.includes('returning_hero')) return '#64D3FF';
      if (img.includes('early_bird')) return '#97D2FF';
      if (img.includes('womens_day')) return '#D084FF';
      if (img.includes('earth_day')) return '#3AE0C5';
      if (img.includes('halloween')) return '#5B1CA7';
      if (img.includes('valentines')) return '#F2497D';
      if (img.includes('liberation')) return '#05C7EB';
      if (img.includes('summer')) return '#3578FF';
      if (img.includes('winter')) return '#708EBB';
      if (img.includes('merry_christmas')) return '#F67171';
      if (img.includes('best_teammate')) return '#F14691';
      if (img.includes('family_power')) return '#74F158';
      if (img.includes('family_duo')) return '#FF9797';
      if (img.includes('big_family')) return '#96AFFF';
      if (img.includes('challenge_complete_1')) return '#636FE6';
      if (img.includes('challenge_complete_2')) return '#C98AE2';
      if (img.includes('challenge_final_sprint')) return '#00FFAA';
      if (img.includes('challenge_slow_aging')) return '#75FF38';
      if (img.includes('self_starter')) return '#FF968C';
      if (img.includes('new_leader')) return '#FFAD73';
      if (img.includes('proven_leader')) return '#7BE81D';
      if (img.includes('inspiring_leader')) return '#59F4BE';
      if (img.includes('elite_leader')) return '#539DFF';
      if (img.includes('ultimate_leader')) return '#8361FF';
      if (img.includes('flawless_leader')) return '#FF80AA';
      if (img.includes('brunch_lover')) return '#A1D7F7';
      if (img.includes('lock')) return '#888888';


      return '#000000';
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
        <div class="badge--wrap" ref="box" :style="imgStyle"> <!-- :class="{ start: isReady }" -->
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



