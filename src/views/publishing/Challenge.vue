<script setup>
import { onMounted, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { funcIsPc } from '@/assets/js/common'
import TabRound from '@/components/TabRound.vue'
import TextDatePicker from '@/components/TextDatePicker.vue'
import TargetGauge from '@/components/TargetGauge.vue'
import BasePopupImage from '@/views/publishing/BasePopupImage.vue'
import ChallengeSharePop from '@/views/publishing/challenge/ChallengeSharePop.vue'

 /* 퍼블 확인용 챌린지 데이터 없을 때 받을 값 */
const route = useRoute()
const isNoChallenge = computed(() => {
  return route.meta.isNoChallenge === true
})

const isPc = ref(false) /* 231217 pc인지? */
const selectedMissionOpen = ref(false); /* 퍼블 확인용 미션 선택 후 버튼 오프너 */
const selectedMission = {
  groupTitle: '혈압조절',
  desc: '혈압조절 제품 (코엔자임Q10, 마그네슘, 오메가 3) 챙겨 먹기',
  title: '영양',
}
const missionCertImagePopup = ref(false) /* 인증사진 보기 팝업 */
const sharePopup = ref(false) /* 인증 공유하기 팝업 */

function winWidth () { /* 브라우저 가로 사이즈 체크 */
  isPc.value = window.innerWidth > 920
}
function imagePopupOpen () {
  missionCertImagePopup.value = true
}
function imagePopupClose () {
  missionCertImagePopup.value = false
}
function sharePopupOpen () {
  sharePopup.value = true
}
function sharePopupClose () {
  sharePopup.value = false
}

onMounted(() => {
  isPc.value = funcIsPc()
  window.addEventListener('resize', () => {
    isPc.value = funcIsPc()
  })
})
</script>

<template>
  <section class="challenge">
    <div class="main--mission">
      <div class="main--mission__head" :class="{ open: selectedMissionOpen }">
        <div class="main--mission__title">
          <span class="main--mission__badge">{{ selectedMission.groupTitle }}</span>
          {{ selectedMission.desc }}
        </div>
        <button type="button" @click="selectedMissionOpen = !selectedMissionOpen"></button>
      </div>
      <transition name="downUp">
        <div v-show="selectedMissionOpen" class="main--mission__body">
          <span>#{{ selectedMission.title }}</span>
          <span>#{{12}}일째</span>
          <p>건강기능식품 섭취 시 해당 제품의 복용량, 복용방법과 부작용 등<br>주의사항을 반드시 확인해 주세요.</p> <!-- 260727 미션 주의사항 추가 -->
          <button type="button" class="main--mission__change" @click.stop="">미션 변경하기</button>
        </div>
      </transition>
    </div>
    <a class="challenge--link">챌린지 이력보기</a>
    <TabRound :tabs="[{title:'진행중'}, {title:'모집중', new:true}, {title:'종료'}]">
      <template #tab-0>
        <div v-if="isNoChallenge" class="challenge--not"> <!-- v-if = 퍼블 확인용 챌린지 없을 때 -->
          <img src="/img/visual_alert_pink.png">
          <p>지금은 진행 중인 <br v-if="!isPc"> 챌린지가 없습니다.</p>
        </div>
        <div v-else>
          <div class="challenge--tit">
            <strong>자두자두 졸리다 챌린지</strong>
            <p><span>50</span>일째 참여 중입니다.</p> <!-- 260827 문구 수정 -->
          </div>
          <div class="challenge--box">
            <div class="challenge--box-tit">
              6월 건강수면 챌린지팀
              <button type="button"></button> <!-- 팀상세로 이동 -->
            </div>
            <div class="challenge--box-info">
              <p>
                <span>성공조건</span>
                <span><em>팀 인증률</em><strong>80%</strong><em>이상</em></span>
              </p>
              <p>
                <span>전체기간</span>
                <span>2026.02.01 ~ 2026.03.31<em>60일</em></span>
              </p>
              <p>
                <span>1회차 진행</span>
                <span>2026.02.01 ~ 2026.02.28<em>28일</em></span>
              </p>
            </div>
            <div class="challenge--box-rate">
              <div class="challenge--box-rate--wrap">
                <div class="challenge--box-rate--per"><span>팀 인증률</span><strong><span>40</span>%</strong></div>
                <TargetGauge :gaugePer="40" :targetPer="55" :compPer="80"></TargetGauge>
              </div>
              <div class="challenge--box-note">
                <span><strong>목표치란, </strong>챌린지 성공을 위해 오늘까지 달성해야 하는 최소 인증률입니다.</span> <!-- 260820 문구 수정 -->
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
          <button class="challenge--share" @click="sharePopupOpen">챌린지 인증 공유하기<img src="/img/ico_btn_share.svg"></button>
        </div>
      </template>
      <template #tab-1>
        <div class="challenge--recruit">
          <img src="/img/img_challenge_recruit.png">
          <p class="challenge--start-day">챌린지 시작 <span>D-{{3}}</span></p>
          <p class="challenge--start-text"><span>바른수면 챌린지</span>가<br>2026년 7월 3일에 시작됩니다.</p>
          <div class="challenge--recruit-box">
            <p>챌린지에 참여하려면<br>챌린지 시작 전 팀에 참여해 주세요.</p> <!-- 팀 가입 전 --> <!-- 260820 문구 수정 -->
            <!-- <p><span>7월 건강수면 팀</span>에 참여가 완료되었습니다.</p> --> <!-- 팀 가입 후 -->
            <div class="challenge--recruit-info">
              <div>
                <p>진행 일시</p>
                <p><span class="light">2026.02.01 ~ 2026.03.31</span><span class="light">/</span><span>60일</span></p>
              </div>
              <div>
                <p>성공 조건</p>
                <p><span>팀 인증률</span><span class="color">80%</span><span>이상</span></p>
              </div>
            </div>
          </div>
          <p class="challenge--recruit-desc">챌린지 성공 및 보상 수령을 위해 OOOO 프로모션(300000L) 구매가 필요합니다. 챌린지 종료 시점까지 구매 인증을 완료하지 않으면 팀이 성공하더라도 개인 보상이 지급되지 않습니다.</p> <!-- 260820 문구 수정 -->
        </div>
      </template>
      <template #tab-2>
        <div>
          <div class="challenge--tit">
            <strong>자두자두 졸리다 챌린지</strong>
            <p>6월 10일에 챌린지가 종료되었습니다.</p>
          </div>
          <div class="challenge--box">
            <div class="challenge--box-tit">
              6월 건강수면 챌린지팀
              <button type="button"></button> <!-- 팀상세로 이동 -->
            </div>
            <div class="challenge--box-info">
              <p>
                <span>성공조건</span>
                <span><em>팀 인증률</em><strong>80%</strong><em>이상</em></span>
              </p>
              <p>
                <span>전체기간</span>
                <span>2026.02.01 ~ 2026.03.31<em>60일</em></span>
              </p>
              <p>
                <span>1회차 진행</span>
                <span>2026.02.01 ~ 2026.02.28<em>28일</em></span>
              </p>
            </div>
            <div class="challenge--box-rate">
              <div class="challenge--box-rate--wrap">
                <div class="challenge--box-rate--per"><span>팀 인증률</span><strong><span>40</span>%</strong></div>
                <TargetGauge :gaugePer="40" :targetPer="55" :compPer="80"></TargetGauge>
              </div>
              <div class="challenge--box-note">
                <span><strong>목표치란, </strong>챌린지 성공을 위해 오늘까지 달성해야 하는 최소 인증률입니다.</span> <!-- 260820 문구 수정 -->
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
        </div>
        <button class="challenge--share" @click="sharePopupOpen">챌린지 인증 공유하기<img src="/img/ico_btn_share.svg"></button>
      </template>
    </TabRound>
  </section>

  <!-- 인증사진 보기 팝업 -->
  <BasePopupImage v-if="missionCertImagePopup" @popupClose="imagePopupClose"></BasePopupImage>

  <!-- 인증 공유하기 팝업 -->
  <ChallengeSharePop v-if="sharePopup" @popupClose="sharePopupClose"></ChallengeSharePop>
</template>

<style lang="scss" scoped>
</style>
