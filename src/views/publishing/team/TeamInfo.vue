<script setup>
import { onMounted, ref, onBeforeUnmount, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import BasePopup from '@/components/BasePopup.vue'
import TargetGauge from '@/components/TargetGauge.vue'

/* 퍼블 확인용 챌린지/상시 구분 받을 값 challenge/regular */
const route = useRoute()
const teamClassification = ref(route.meta.teamClassification)
const isLeader = ref(route.meta.isLeader) /* 리더인지 */

const targetSection = ref(null)

const accordionOpen = ref(false); /* 월별 팀 인증률 보기 오프너 */

function checkHeaderBg () {
  const target = targetSection.value
  const header = document.querySelector('.header')

  if (!target || !header) return

  const headerHeight = header.offsetHeight
  const targetTop = target.getBoundingClientRect().top

  if (targetTop <= headerHeight) {
    header.classList.remove('greenBg')
  } else {
    header.classList.add('greenBg')
  }
}

onMounted(() => {
  nextTick(() => {
    checkHeaderBg()
    window.addEventListener('scroll', checkHeaderBg)
  })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', checkHeaderBg)
  const header = document.querySelector('.header')
  if (header) {
    header.classList.add('greenBg')
  }
})
</script>

<template>
  <section class="team-info" :class="teamClassification === 'regular' ? 'regular' : ''">
    <div class="team-info--profile">
      <div class="team-info--profile-img">
        <img src="/img/team_profile_exam.png" alt="팀 이미지">
        <img v-if="isLeader" class="team-info--profile-leader" src="/img/ico_leader.png" alt="팀장">
      </div>
      <p class="team-info--profile-text">자두자두 졸리다 챌린지</p>
    </div>
    <div class="team-info--detail" ref="targetSection">
      <p class="team-info--tit"><span>팀명</span>오래오래 모두모두 건강수면</p>

      <!-- 진행중 -->
      <div class="team-info--box">
        <TargetGauge :gaugePer="85" :compPer="80" :targetPer="75" :bgColor="teamClassification === 'regular' ? 'green' : 'pink'"></TargetGauge>
        <div class="team-info--color-box">
          <div>
            <p class="box-tit">팀 인증률</p>
            <p class="box-desc"><span class="num">40</span><span class="per">%</span></p>
          </div>
          <div>
            <p class="box-tit">팀 인증횟수/성공횟수</p>
            <p class="box-desc"><span class="num">58</span><span class="count">/300</span>회</p>
          </div>
        </div>
        <div v-if="teamClassification === 'challenge'" class="challenge--box-note">
          <span><strong>목표치란, </strong>챌린지를 성공하기 위하여 오늘까지 달성해야 할 최소한의 인증률을 말합니다.</span>
        </div>
      </div>
      <!-- 진행대기 -->
      <div class="team-info--box">
        <TargetGauge :gaugePer="0" :compPer="80" :targetPer="75" :bgColor="teamClassification === 'regular' ? 'green' : 'pink'"></TargetGauge>
        <div class="team-info--color-box">
          <div>
            <p class="box-tit">팀 인증률</p>
            <p class="box-desc"><span class="num">0</span><span class="per">%</span></p>
          </div>
          <div>
            <p class="box-tit">팀 인증횟수/성공횟수</p>
            <p class="box-desc"><span class="num">0</span><span class="count">/300</span>회</p>
          </div>
        </div>
        <div v-if="teamClassification === 'challenge'" class="challenge--box-note">
          <span><strong>목표치란, </strong>챌린지를 성공하기 위하여 오늘까지 달성해야 할 최소한의 인증률을 말합니다.</span>
        </div>
      </div>
      <!-- 100% 달성 시 -->
      <div class="team-info--box">
        <TargetGauge :gaugePer="100" :compPer="80" :targetPer="90" :bgColor="teamClassification === 'regular' ? 'green' : 'pink'"></TargetGauge>
        <div class="team-info--color-box">
          <div>
            <p class="box-tit">팀 인증률</p>
            <p class="box-desc"><span class="num">100</span><span class="per">%</span></p>
          </div>
          <div>
            <p class="box-tit">팀 인증횟수/성공횟수</p>
            <p class="box-desc"><span class="num">300</span><span class="count">/300</span>회</p>
          </div>
        </div>
        <div v-if="teamClassification === 'challenge'" class="challenge--box-note">
          <span><strong>목표치란, </strong>챌린지를 성공하기 위하여 오늘까지 달성해야 할 최소한의 인증률을 말합니다.</span>
        </div>
      </div>

      <!-- 월별 팀 인증률 보기 / 상시일 때 노출 -->
      <div v-if="teamClassification === 'regular'" class="team-info--box">
        <p class="team-info--box-tit">월별 팀 인증률 보기</p>
        <button class="team-info--acco-arrow" :class="{ open: accordionOpen}" @click="accordionOpen = !accordionOpen"></button>
        <div v-show="accordionOpen" class="team-info--box-acco">
          <p><span>2026년 7월</span><strong>40%</strong></p>
          <p><span>2026년 6월</span><strong class="color">100%</strong></p>
          <p><span>2026년 5월</span><strong>4%</strong></p>
        </div>
      </div>

      <!-- 팀 랭킹 -->
      <div class="team-info--box">
        <p class="team-info--box-tit">팀 랭킹</p>
        <div class="team-info--team-rank">
          <div class="team-info--rank"><span class="num">5</span>위</div>
          <button class="team-info--btn-plus">팀 랭킹 보기</button>
        </div>
      </div>
      <!-- 팀 랭킹 - 대기중 -->
      <div class="team-info--box">
        <p class="team-info--box-tit">팀 랭킹</p>
        <div class="team-info--team-rank">
          <div class="team-info--rank"><span class="num">-</span>위</div>
          <button class="team-info--btn-plus" disabled>팀 랭킹 보기</button>
        </div>
      </div>

      <!-- 팀원 인증률 순위 -->
      <div class="team-info--box">
        <p class="team-info--box-tit">챌린지 $n$회차 팀원 인증률 순위</p>
        <p class="team-info--box-sub-tit">나의 랭킹</p>
        <div class="team-info--team-rank">
          <div class="team-info--rank"><span class="num">15</span>위</div>
          <button class="team-info--btn-plus">팀원 현황 보기</button>
        </div>
        <div class="team-info--graph">
          <div>
            <div class="per">100%</div>
            <div class="gauge-wrap">
              <div class="gauge" style="--gauge-height: 100%;"></div>
              <div class="profile">
                <img src="/img/profile_exam1.png">
              </div>
            </div>
            <div class="rank first">1위</div>
            <div class="name-wrap"><span class="name">닉네임 두 줄에서 줄바꿈하기</span>외 2명</div>
          </div>
          <div>
            <div class="per">90%</div>
            <div class="gauge-wrap">
              <div class="gauge" style="--gauge-height: 90%;"></div>
              <div class="profile">
                <img src="/img/profile_exam2.png">
              </div>
            </div>
            <div class="rank">2위</div>
            <div class="name-wrap"><span class="name">닉네임</span>외 2명</div>
          </div>
          <div>
            <div class="per">85%</div>
            <div class="gauge-wrap">
              <div class="gauge" style="--gauge-height: 85%;"></div>
              <div class="profile">
                <img src="/img/profile_exam3.png">
              </div>
            </div>
            <div class="rank">3위</div>
            <div class="name-wrap"><span class="name">닉네임</span></div>
          </div>
          <div>
            <div class="per">70%</div>
            <div class="gauge-wrap">
              <div class="gauge" style="--gauge-height: 70%;"></div>
              <div class="profile">
                <img src="/img/profile_exam4.png">
              </div>
            </div>
            <div class="rank">4위</div>
            <div class="name-wrap"><span class="name">닉네임 세 줄</span>외 3명</div>
          </div>
          <div>
            <div class="per">65%</div>
            <div class="gauge-wrap">
              <div class="gauge" style="--gauge-height: 65%;"></div>
              <div class="profile">
                <img src="/img/profile_exam5.png">
              </div>
            </div>
            <div class="rank">5위</div>
            <div class="name-wrap"><span class="name">닉네임</span>외 1명</div>
          </div>
        </div>
        <div class="team-info--date">2025.09.17 10:49:00 기준</div>
      </div>
      <!-- 팀원 인증률 순위 - 대기중 -->
      <div class="team-info--box">
        <p class="team-info--box-tit">챌린지 $n$회차 팀원 인증률 순위</p>
        <p class="team-info--box-sub-tit">나의 랭킹</p>
        <div class="team-info--team-rank">
          <div class="team-info--rank"><span class="num">-</span>위</div>
          <button class="team-info--btn-plus" disabled>팀원 현황 보기</button>
        </div>
      </div>

      <button v-if="isLeader" class="team-info--btn-green">초대한 팀원 보기</button>
      <div class="team-info--btn-text">
        <button v-if="isLeader">팀 삭제</button>
        <button v-else>팀 탈퇴</button>
      </div>
    </div>
  </section>
</template>

<style lang="sass" scoped>
</style>