<script>
import { bodyScroll } from '@/assets/js/common'

export default {
  name: "TeamBadgePop",
  data () {
    return {
    }
  },
  props: {
    list: {
      type: Array,
      required: true,
    },
  },
  emits: ["popupClose"],
  methods: {
    close(){
      this.$emit("popupClose")
    },
    imgStyle(img) {
      const color = this.getShadowColor(img)
      return {
        '--badge-shadow-color': `drop-shadow(0 .3rem .8rem ${color}80)`
      }
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
    bodyScroll(false) /* 팝업 노출 시 body 스크롤 정지 */
  },
  unmounted() {
    bodyScroll(true) /* 팝업 삭제 시 body 스크롤 원복 */
  },
};
</script>

<template>
  <div class="popup allBadgePopup">
    <div class="align--between popup--header">
      <div />
      <div class="popup--tit-wrap">
        <span class="popup--tit">획득한 배지 전체보기</span>
      </div>
      <div>
        <button @click="close" type="button" class="popup--close" />
      </div>
    </div>
    <div class="badge-list">
      <div v-for="item in list" :key="item.name" class="badge-wrap">
        <!-- <div class="img-wrap" :style="imgStyle(item.img)"> --> <!-- 섀도우 적용 필요 시 -->
        <div class="img-wrap">
          <img :src="item.img">
        </div>
        <p v-html="item.name"></p>
      </div>
    </div>
  </div>
</template>