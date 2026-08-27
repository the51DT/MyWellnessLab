<script>
/*
    사용 예시
    <BasePopupBadge type="pin" frontImg="pin--ruby.svg"> $명칭$ </BasePopupBadge>  
    
    - type : pin/badge 선택 
    - frontImg : 이미지 네임만 작성
    - $명칭$ : 핀/배지 명칭 작성
*/
import { bodyScroll } from '@/assets/js/common'
import lottie from 'lottie-web' /* 260824 로티 추가 */

export default {
  name: "BasePopupBadge",
  data() {
    return {
      lottieAnimations: [], /* 260824 로티 추가 */
      isPc: false, /* 260825 브라우저 사이즈 체크 추가 */
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
    /* imgStyle() {
      const color = this.getShadowColor(this.frontImg);
      return {
        '--badge-shadow-color': `drop-shadow(0 .5rem 2rem ${color}80)` // 80 = 50% 투명도
      };
    } */
  },
  methods: {
    close(){ /* 260727 핀/배지 팝업 상단 x 버튼 추가 */
      this.$emit("popupClose")
    },
    startAnimation() {
      const box = this.$refs.box
      if (!box) return

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          box.animate(
            [
              { offset: 0, transform: 'translateY(0) scale(1, 1) rotateY(0deg)' },

              // 처음 아래로 눌림
              { offset: 0.02, transform: 'translateY(2rem) scale(1.2, .8) rotateY(0deg)' },
              { offset: 0.04, transform: 'translateY(-5rem) scale(1, 1) rotateY(0deg)' },

              // 첫 번째 뒤집힘
              { offset: 0.07, transform: 'translateY(-8rem) scale(.05, 1) rotateY(90deg)' },
              { offset: 0.09, transform: 'translateY(-8rem) scale(1, 1) rotateY(180deg)' },

              // 두 번째 뒤집힘
              { offset: 0.13, transform: 'translateY(-7.5rem) scale(.05, 1) rotateY(270deg)' },
              { offset: 0.18, transform: 'translateY(-6.5rem) scale(1, 1) rotateY(360deg)' },

              // 튕기면서 내려옴
              { offset: 0.21, transform: 'translateY(0) scale(1.2, .8) rotateY(360deg)' },
              { offset: 0.25, transform: 'translateY(.4rem) scale(.94, 1.06) rotateY(360deg)' },
              { offset: 0.30, transform: 'translateY(0) scale(1.02, .98) rotateY(360deg)' },
              { offset: 0.36, transform: 'translateY(0) scale(.99, 1.01) rotateY(360deg)' },
              { offset: 0.43, transform: 'translateY(0) scale(1, 1) rotateY(360deg)' },

              // 정지 구간
              { offset: 1, transform: 'translateY(0) scale(1, 1) rotateY(360deg)' }
            ],
            {
              duration: 12500,
              easing: 'cubic-bezier(.17, .67, .33, 1)',
              fill: 'forwards'
            }
          )
        })
      })
    },
    // 배지 이미지 이름마다 shadow값 지정
    /* getShadowColor(img) {
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
    }, */
    async startLottie() { /* 260824 로티 추가 */
      const lottieList = [
        {
          container: this.$refs.moTextLevelup,
          path: '/lottie/MO_TEXT_motion_levelup.json',
          loop: false,
          autoplay: true
        },
        {
          container: this.$refs.pcTextLevelup,
          path: '/lottie/PC_TEXT_motion_levelup.json',
          loop: false,
          autoplay: true
        },
        {
          container: this.$refs.moTextNewBadge,
          path: '/lottie/MO_TEXT_motion_newbadge.json',
          loop: false,
          autoplay: true
        },
        {
          container: this.$refs.pcTextNewBadge,
          path: '/lottie/PC_TEXT_motion_newbadge.json',
          loop: false,
          autoplay: true
        },
        {
          container: this.$refs.moParticle,
          path: '/lottie/MO_Confetti_motion_2.json',
          loop: false,
          autoplay: true
        },
        {
          container: this.$refs.pcParticle,
          path: '/lottie/PC_Confetti_motion_2.json',
          loop: false,
          autoplay: true
        },
        {
          container: this.$refs.moBadge,
          path: '/lottie/MO_Badge_motion.json',
          loop: false,
          autoplay: true,
          replaceImg: this.frontImg
        },
        {
          container: this.$refs.pcBadge,
          path: '/lottie/PC_Badge_motion.json',
          loop: false,
          autoplay: true,
          replaceImg: this.frontImg
        },
      ]

      this.lottieAnimations = await Promise.all(
        lottieList
          .filter(item => item.container)
          .map(async item => {
            if (item.replaceImg) {
              const response = await fetch(item.path)
              const animationData = await response.json()

              if (animationData.assets) {
                const imageAsset = animationData.assets.find(asset => {
                  return asset.p && /\.(png|jpg|jpeg|svg|webp)$/i.test(asset.p)
                })

                if (imageAsset) {
                  imageAsset.u = ''
                  imageAsset.p = item.replaceImg
                }
              }

              return lottie.loadAnimation({
                container: item.container,
                renderer: 'svg',
                loop: item.loop,
                autoplay: item.autoplay,
                animationData
              })
            }

            return lottie.loadAnimation({
              container: item.container,
              renderer: 'svg',
              loop: item.loop,
              autoplay: item.autoplay,
              path: item.path
            })
          })
      )
    },
    winWidth () { /* 260825 브라우저 사이즈 체크 추가 */
      this.isPc = window.innerWidth > 960
    },
  },
  mounted() {
    this.startLottie() /* 260824 로티 추가 */
    winWidth() /* 브라우저 가로 사이즈 체크 */
    bodyScroll(false) /* 팝업 노출 시 body 스크롤 정지 */
  },
  unmounted() {
    bodyScroll(true) /* 팝업 삭제 시 body 스크롤 원복 */

    /* 260824 로티 추가 */
    this.lottieAnimations.forEach(animation => {
      animation.destroy()
    })
    this.lottieAnimations = []
  },
};
</script>

<template>
  <div class="popup BadgeAniPopup">
    <div class="popup--header"> <!-- 260727 핀/배지 팝업 상단 x 버튼 추가 -->
      <div class="popup--tit-wrap">
        <button @click="close" type="button" class="popup--close" aria-label="닫기"></button>
      </div>
    </div>
    <div class="popup--wrap">
      <!-- [s] 260825 로티 조건문 추가 -->
      <div v-if="!isPc && type === 'pin'" ref="moTextLevelup" class="animation-text"></div>
      <div v-if="isPc && type === 'pin'" ref="pcTextLevelup" class="animation-text"></div>
      <div v-if="!isPc && type === 'badge'" ref="moTextNewBadge" class="animation-text"></div>
      <div v-if="isPc && type === 'badge'" ref="pcTextNewBadge" class="animation-text"></div>
      <div v-if="!isPc" ref="moParticle" class="animation-bg"></div>
      <div v-if="isPc" ref="pcParticle" class="animation-bg"></div>
      <div v-if="!isPc" ref="moBadge" class="animation-motion"></div>
      <div v-if="isPc" ref="pcBadge" class="animation-motion"></div>
      <!-- [e] 260825 로티 조건문 추가 -->
      <span class="badge-name">
        <slot />
      </span>
      <div class="popup-message">
        <p>축하합니다!</p>
        <p v-if="type === 'badge'">새로운 배지를 획득했습니다!</p> <!-- 260827 문구 수정 -->
        <p v-else>새로운 마이웰니스 랩 핀을 달성했습니다!</p> <!-- 260827 문구 수정 -->
      </div>
      <div class="pop-btn-wrap">
        <button type="button" class="pop-btn pop-btn--green">보러가기</button>
      </div>
    </div>
  </div>

</template>
