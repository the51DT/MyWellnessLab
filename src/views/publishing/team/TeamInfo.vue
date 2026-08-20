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

const teamDeletePopup = ref(false) /* 팀 삭제 팝업 */
const disableDeletePopup = ref(false) /* 팀 삭제 불가 팝업 */
const teamLeavePopup = ref(false) /* 팀 탈퇴 팝업 */

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
            <p class="box-tit">성공 조건</p> <!-- 260820 문구 수정 -->
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
            <p class="box-tit">성공 조건</p> <!-- 260820 문구 수정 -->
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
            <p class="box-tit">성공 조건</p> <!-- 260820 문구 수정 -->
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
        <p v-if="teamClassification === 'challenge'" class="team-info--box-tit">챌린지 $n$회차 팀원 인증률 순위</p>
        <p v-else class="team-info--box-tit">$2026$년 $7$월 팀원 인증률 순위</p>
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
        <p v-if="teamClassification === 'challenge'" class="team-info--box-tit">챌린지 $n$회차 팀원 인증률 순위</p>
        <p v-else class="team-info--box-tit">$2026$년 $7$월 팀원 인증률 순위</p>
        <p class="team-info--box-sub-tit">나의 랭킹</p>
        <div class="team-info--team-rank">
          <div class="team-info--rank"><span class="num">-</span>위</div>
          <button class="team-info--btn-plus" disabled>팀원 현황 보기</button>
        </div>
      </div>

      <!-- 팀 정보 - 상시 -->
      <div v-if="teamClassification === 'regular'" class="team-info--box">
        <ul class="team-info--list">
          <li>
            <span class="tit">팀 구분</span>
            <span class="tag">상시</span>
          </li>
          <li>
            <span class="tit">기간</span>
            <span>2026.01.01 ~ 2027.01.01<br>365일</span>
          </li>
          <li>
            <span class="tit">팀 가입일</span>
            <span>2026.02.24</span>
          </li>
          <li>
            <span class="tit">인증 시작일</span>
            <span>2026.02.24</span>
          </li>
          <li>
            <span class="tit">팀장</span>
            <span>$닉네임$</span>
          </li>
          <li>
            <span class="tit">참여 인원</span>
            <span>68명</span>
          </li>
        </ul>
      </div>

      <!-- 팀 정보 - 챌린지 -->
      <div v-if="teamClassification === 'challenge'" class="team-info--box">
        <ul class="team-info--list challenge">
          <li>
            <span class="tit">팀 구분</span>
            <span class="tag">챌린지</span>
          </li>
          <li>
            <span class="tit">전체 일정</span>
            <span>
              <strong>2026.01.01 ~ 2026.02.28<br>60일</strong>
            </span>
          </li>
          <li>
            <span class="tit">팀 가입일</span>
            <span>2026.02.24</span>
          </li>
          <li>
            <span class="tit">챌린지 시작일</span>
            <span>2026.02.24</span>
          </li>
          <li>
            <span class="tit">팀장</span>
            <span>$닉네임$</span>
          </li>
          <li>
            <span class="tit">진행 미션</span>
            <span>$미션 정보$</span>
          </li>
          <li>
            <span class="tit">1회차 <br class="mo-br">진행 안내</span>
            <span>
              <em>진행 기간</em>
              <strong>2026.08.01 ~ 2026.08.31</strong>
              <em>성공 조건</em>
              <strong class="color">80% 이상</strong>
              <em>성공 보상</em>
              <strong>$1회차 보상명 (20자 까지 노출 가능)$</strong>
            </span>
          </li>
          <li>
            <span class="tit">2회차 <br class="mo-br">진행 안내</span>
            <span>
              <em>진행 기간</em>
              <strong>2026.09.01 ~ 2026.09.30</strong>
              <em>성공 조건</em>
              <strong class="color">80% 이상</strong>
              <em>성공 보상</em>
              <strong>$2회차 보상명 (20자 까지 노출 가능)$</strong>
            </span>
          </li>
          <li>
            <span class="tit">성공 조건</span>
            <span class="color">80%</span>
          </li>
          <li>
            <span class="tit">성공 보상</span>
            <span>$보상명 20자까지 노출 가능$</span>
          </li>
          <li>
            <span class="tit">바우처명</span>
            <span>$바우처명 20자까지 노출 가능$</span>
          </li>
          <li>
            <span class="tit">보상 수령 방법</span>
            <span>팀원 개별수령</span>
          </li>
          <li>
            <span class="tit">보상 수령처</span>
            <span class="select-wrap">
              <select name="teamRewardPoint" class="circle" required>
                <option value="1">분당</option>
                <option value="2" selected>강서</option>
                <option value="3">인천</option>
                <option value="4">대전</option>
                <option value="5">청주</option>
                <option value="6">부산</option>
                <option value="7">대구</option>
                <option value="8">창원</option>
                <option value="9">울산</option>
                <option value="10">광주</option>
                <option value="11">전주</option>
                <option value="12">강릉</option>
                <option value="13">제주</option>
                <option value="14">스타시티</option>
              </select>
              <button>저장</button>
            </span>
          </li>
          <li>
            <span class="tit">보상 수령처</span>
            <span class="select-wrap">
              <select name="teamRewardPoint" class="circle" required disabled>
                <option value="1" selected>분당</option>
                <option value="2">강서</option>
                <option value="3">인천</option>
                <option value="4">대전</option>
                <option value="5">청주</option>
                <option value="6">부산</option>
                <option value="7">대구</option>
                <option value="8">창원</option>
                <option value="9">울산</option>
                <option value="10">광주</option>
                <option value="11">전주</option>
                <option value="12">강릉</option>
                <option value="13">제주</option>
                <option value="14">스타시티</option>
              </select>
              <button disabled>저장</button>
            </span>
          </li>
        </ul>
      </div>

      <button v-if="isLeader" class="team-info--btn-green">초대한 팀원 보기</button>
      <div class="team-info--btn-text">
        <button v-if="isLeader" @click="teamDeletePopup = true">팀 삭제</button>
        <button v-else @click="teamLeavePopup = true">팀 탈퇴</button>
      </div>
    </div>
  </section>

  <!-- 팀 삭제 팝업 -->
  <BasePopup v-if="teamDeletePopup">
    <template v-slot:contents>
      <p class="pop-text-light">팀을 정말 삭제하시겠습니까?</p>
      <div class="pop-btn-wrap">
        <button type="button" @click="teamDeletePopup = false" class="pop-btn pop-btn--gray">취소</button>
        <button type="button" @click="teamDeletePopup = false, disableDeletePopup = true" class="pop-btn pop-btn--green">확인</button> <!-- 퍼블 확인을 위해 팝업 임의 노출 -->
      </div>
    </template>
  </BasePopup>

  <!-- 팀 삭제 불가 팝업 -->
  <BasePopup v-if="disableDeletePopup">
    <template v-slot:contents>
      <p class="pop-text-light">참여 중인 팀원이 있어,<br>팀을 삭제할 수 없습니다.</p> <!-- 260820 문구 수정 -->
      <div class="pop-btn-wrap">
        <button type="button" @click="disableDeletePopup = false" class="pop-btn pop-btn--green">확인</button>
      </div>
    </template>
  </BasePopup>

  <!-- 팀 탈퇴 팝업 -->
  <BasePopup v-if="teamLeavePopup">
    <template v-slot:contents>
      <p class="pop-text-light">팀을 정말 탈퇴하시겠습니까?</p>
      <div class="pop-btn-wrap">
        <button type="button" @click="teamLeavePopup = false" class="pop-btn pop-btn--gray">취소</button>
        <button type="button" @click="teamLeavePopup = false" class="pop-btn pop-btn--green">확인</button>
      </div>
    </template>
  </BasePopup>
</template>

<style lang="sass" scoped>
</style>