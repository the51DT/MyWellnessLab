<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

/* 퍼블 확인용 챌린지 데이터 없을 때 받을 값 */
const route = useRoute()
const isNoChallenge = computed(() => {
  return route.meta.isNoChallenge === true
})
</script>

<template>
  <div class="MyPageChallengeReward">
    <div v-if="isNoChallenge" class="AnalyzeList--no-data"> <!-- v-if 퍼블 확인용 -->
      <span>보상 지급 이력이 없습니다.</span>
    </div>

    <ul v-else class="bull--no MyPageChallengeReward--ul">
      <li>
        <div class="MyPageChallengeReward--box">
          <div class="MyPageChallengeReward--top">
            <div class="MyPageChallengeReward--tit">
              <span>챌린지 타이틀명 두 줄 케이스 두 줄 중 첫번째 줄 자두자두 졸려 챌린지</span>
              <strong>1회차</strong>
            </div>
            <div class="MyPageChallengeReward--team">
              <span>팀명</span>
              <strong>{{ '8월에도 건강수면' }}</strong>
            </div>
          </div>
          <dl class="MyPageChallengeReward--dl">
            <dt>챌린지 종료일</dt>
            <dd>2026년 10월 31일</dd>
            <dt>팀장명</dt>
            <dd>김웨이</dd>
            <dt>성공 보상명</dt>
            <dd>성공 보상</dd>
            <dt>성공 보상 수령 방법</dt>
            <dd>ABC</dd>
            <dt>바우처명</dt>
            <dd>바우처명</dd>
          </dl>
          <a href="" class="MyPageChallengeReward--link">바우처 확인하기</a>
        </div>
      </li><li>
        <div class="MyPageChallengeReward--box">
          <div class="MyPageChallengeReward--top">
            <div class="MyPageChallengeReward--tit">
              <span>자두자두 졸려 챌린지</span>
              <strong>3회차</strong>
            </div>
            <div class="MyPageChallengeReward--team">
              <span>팀명</span>
              <strong>{{ '7월에도 건강수면' }}</strong>
            </div>
          </div>
          <dl class="MyPageChallengeReward--dl">
            <dt>챌린지 종료일</dt>
            <dd>2026년 10월 31일</dd>
            <dt>팀장명</dt>
            <dd>김웨이</dd>
            <dt>성공 보상명</dt>
            <dd>성공 보상</dd>
            <dt>성공 보상 수령 방법</dt>
            <dd>ABC</dd>
            <dt>바우처명</dt>
            <dd>-</dd>
          </dl>
        </div>
      </li>
    </ul>
  </div>
</template>

<style lang="scss"></style>
