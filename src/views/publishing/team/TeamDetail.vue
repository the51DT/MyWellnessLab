<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import BasePopupClose from '@/views/publishing/BasePopupClose.vue'
import BasePopupImage from '@/views/publishing/BasePopupImage.vue'
import TeamBadgePop from '@/views/publishing/team/TeamBadgePop.vue'
import TextDatePicker from '@/components/TextDatePicker.vue'

/* 챌린지<->상시 구분 - 퍼블 임의  */
const route = useRoute()
const challengeTeam = computed(() => {
  return route.meta.teamClassification === 'challenge'
})
const isLeader = computed(() => {
  return route.meta.isLeader === true
})

const teamKickPopup = ref(false) /* 팀 내보내기 팝업 */
const missionCertImagePopup = ref(false) /* 인증사진 보기 팝업 */
const allBadgePopup = ref(false) /* 획득한 배지 전체보기 팝업 */

const badgeList = [ /* 퍼블 확인용 획득한 배지 목록 */
  {
    img: '/img/badge_happy-birthday.svg',
    name: '30일<br>연속 인증',
  },
  {
    img: '/img/badge_happy-birthday.svg',
    name: '10일<br>연속 인증',
  },
  {
    img: '/img/badge_happy-birthday.svg',
    name: '챌린지 러버',
  },
  {
    img: '/img/badge_happy-birthday.svg',
    name: '나의 생일',
  },
  {
    img: '/img/pin_ruby.svg',
    name: '루비',
  },
  {
    img: '/img/pin_ruby.svg',
    name: '두줄<br>텍스트',
  },
] 

function imagePopupOpen () {
  missionCertImagePopup.value = true
}
function imagePopupClose () {
  missionCertImagePopup.value = false
}
</script>

<template>
  <section class="team-detail" :class="{ challengeColor : challengeTeam}">
    <div class="team-detail--profile">
      <div class="img-wrap" :class="{leader:isLeader}"> <!-- .leader 팀장 표시 -->
        <img src="/img/age_20f.png">
      </div>
      <p class="nickname">닉네임 영문 최대 20자</p>
      <p v-if="isLeader" class="name">홍길동</p>
    </div>
    <button class="team-detail--btn-text" @click="allBadgePopup = true">전체 배지 보기</button>
    <div class="team-detail--info">
      <div class="team-detail--box">
        <div class="team-detail--badge-wrap">
          <p>마이웰니스 랩 핀</p>
          <img src="/img/pin_ruby.svg">
          <span>루비</span>
        </div>
        <div v-if="isLeader" class="team-detail--badge-wrap"> <!-- v-if 퍼블 확인용 / 팀장 케이스만 대표 배지 노출 -->
          <p>대표 배지</p>
          <img src="/img/badge_happy-birthday.svg">
          <span>나의 생일</span>
        </div>
      </div>
      <div class="team-status--info">
        <dl>
          <dt>팀 가입일</dt>
          <dd><strong>2025.09.09</strong></dd>
        </dl>
        <dl v-if="isLeader">
          <dt>진행 미션</dt>
          <dd><span class="tag">혈당조절</span><span>1회 이상 식후 15분 가볍게 걷기</span></dd>
        </dl>
        <dl>
          <dt>인증 횟수</dt> <!-- 챌린지/상시 구분 퍼블 임의 -->
          <dd v-if="challengeTeam"><span class="color">223</span> / {{ 1000 }}회</dd>
          <dd v-else><span class="session">9월 22회</span><span class="color">223</span>회</dd> <!-- 260820 문구 수정 -->
        </dl>
      </div>
      <div v-if="challengeTeam && isLeader" class="team-status--purchase active">제품 구매완료</div> <!-- .active 구매완료 / 없으면 미구매 스타일 -->
    </div>
    <div class="team-detail--date-picker">
      <TextDatePicker 
        :pointColor="challengeTeam ? 'pink' : 'green'"
        :showDetail="true"
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
    <button v-if="isLeader && !challengeTeam" class="team-detail--btn-bottom" @click="teamKickPopup = true">팀에서 내보내기</button>
  </section>

  <!-- 팀 내보내기 팝업 -->
  <BasePopupClose v-if="teamKickPopup" :close-btn="false">
    <template v-slot:title>$홍길동$님을<br>팀에서 내보내시겠습니까?</template>
    <template v-slot:contents>
      <p class="pop-text-light">팀에서 내보내면, 팀 내 활동 내역이 삭제됩니다.</p> <!-- 260820 문구 수정 -->
    </template>
    <template v-slot:button>
      <button type="button" @click="teamKickPopup = false" class="pop-btn pop-btn--gray">취소</button>
      <button type="button" @click="teamKickPopup = false" class="pop-btn pop-btn--green">확인</button>
    </template>
  </BasePopupClose>

  <!-- 인증사진 보기 팝업 -->
  <BasePopupImage v-if="missionCertImagePopup" @popupClose="imagePopupClose"></BasePopupImage>

  <!-- 획득한 배지 전체보기 팝업 -->
  <TeamBadgePop
    v-if="allBadgePopup"
    @popupClose="allBadgePopup = false"
    :list="badgeList"
  ></TeamBadgePop>
</template>

<style lang="scss" scoped>
</style>