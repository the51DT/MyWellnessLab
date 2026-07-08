<script setup>
import { onMounted, ref, computed } from 'vue'
import { useRoute } from 'vue-router'

 /* 퍼블 확인용 챌린지 데이터 없을 때 받을 값 */
const route = useRoute()
const isNoChallenge = computed(() => {
  return route.meta.isNoChallenge === true
})
</script>

<template>
  <section class="challenge-history">
    <div v-if="isNoChallenge" class="challenge-history--not"> <!-- v-if 퍼블 확인용 -->
      <img src="/img/visual_alert_pink.png">
      <p>진행중인 챌린지가 없습니다.</p>
    </div>

    <div v-else class="challenge-history--wrap">
      <div class="challenge-history--card">
        <button class="challenge-history--btn"></button> <!-- 상세로 이동 -->
        <div class="challenge-history--title">챌린지 타이틀명</div>
        <div class="challenge-history--profile">
          <img src="/img/age_20f.png">
          <div>
            <div class="challenge-history--people">200명</div>
            <div class="challenge-history--team"><span>팀명 </span>아침마다 오 마이 아침마다 오 마이 아침마다 오 마이 아침마다 오 마이</div>
          </div>
        </div>
        <div class="challenge-history--detail">
          <div class="challenge-history--info">
            <div>
              <p>전체 기간</p>
              <p>2026.10.01 ~ 2026.11.30<span>61일</span></p>
            </div>
            <div>
              <p>1회차 진행</p>
              <p>2026.10.01 ~ 2026.10.31<span>31일</span></p>
            </div>
            <div>
              <p>진행 미션</p>
              <p>혈당조절 1회 이상 식후 15분 가볍게 걷기</p>
            </div>
          </div>
          <div class="challenge-history--box">
            <div><span>나의 인증률</span><strong>100</strong></div>
            <div><span>팀 인증률</span><strong>86</strong></div>
            <div><span>챌린지 결과</span><span class="challenge-history--result">성공</span></div>
          </div>
        </div>
        <div class="challenge-history--detail">
          <div class="challenge-history--info">
            <div>
              <p>2회차 진행</p>
              <p>2026.10.01 ~ 2026.10.31<span>31일</span></p>
            </div>
            <div>
              <p>진행 미션</p>
              <p>혈당조절 1회 이상 식후 15분 가볍게 걷기</p>
            </div>
          </div>
          <div class="challenge-history--box fail">
            <div><span>나의 인증률</span><strong>100</strong></div>
            <div><span>팀 인증률</span><strong>40</strong></div>
            <div><span>챌린지 결과</span><span class="challenge-history--result">실패</span></div>
          </div>
        </div>
      </div>

      <div class="challenge-history--card">
        <button class="challenge-history--btn"></button> <!-- 상세로 이동 -->
        <div class="challenge-history--title">챌린지 타이틀명</div>
        <div class="challenge-history--profile">
          <img src="/img/age_20.png">
          <div>
            <div class="challenge-history--people">30명</div>
            <div class="challenge-history--team"><span>팀명 </span>아침마다 오 마이</div>
          </div>
        </div>
        <div class="challenge-history--detail">
          <div class="challenge-history--info">
            <div>
              <p>전체 기간</p>
              <p>2026.10.01 ~ 2026.10.31<span>31일</span></p>
            </div>
            <div>
              <p>진행 미션</p>
              <p>혈당조절 1회 이상 식후 15분 가볍게 걷기</p>
            </div>
          </div>
          <div class="challenge-history--box">
            <div><span>나의 인증률</span><strong>100</strong></div>
            <div><span>팀 인증률</span><strong>80</strong></div>
            <div><span>챌린지 결과</span><span class="challenge-history--result">성공</span></div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
</style>
