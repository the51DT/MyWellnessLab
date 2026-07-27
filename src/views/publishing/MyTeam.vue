<script setup>
import { onMounted, ref, computed, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { funcIsPc } from '@/assets/js/common'
import BasePopupClose from '@/views/publishing/BasePopupClose.vue'
import BasePopup from '@/components/BasePopup.vue'
import TabRound from '@/components/TabRound.vue'
import TargetGauge from '@/components/TargetGauge.vue'
import BtnTop from '@/views/publishing/BtnTop.vue'

 /* 퍼블 확인용 데이터 없을 때 받을 값 */
const route = useRoute()
const isNoTeam = computed(() => {
  return route.meta.isNoTeam === true
})

const isPc = ref(false) /* 231217 pc인지? */
const selectedMissionOpen = ref(false); /* 퍼블 확인용 미션 선택 후 버튼 오프너 */
const selectedMission = {
  groupTitle: '혈압조절',
  desc: '혈압조절 제품 (코엔자임Q10, 마그네슘, 오메가 3) 챙겨 먹기',
  title: '영양',
}
const inviteTeamPopup = ref(true); /* 챌린지 한정 팀 초대 알림 팝업 */
const unableJoinPopup = ref(false); /* 팀 가입 불가 안내 (이미 참여중) 팝업 */
const activeTeamTab = ref(0) /* 팝업 확인하러가기 버튼 탭 변경 */
const changeMissionPopup = ref(false); /* 미션 변경 알림 팝업 */
const porductStatusPopup = ref(false); /* 제품 구매 여부 알림 팝업 */
const createBtn = ref(true);

function winWidth () { /* 브라우저 가로 사이즈 체크 */
  isPc.value = window.innerWidth > 920
}
const handleScroll = () => {
  const currentScrollY = window.scrollY
  if (currentScrollY > 100) {
    createBtn.value = false   // 스크롤이 100px 이상이면 버튼 숨김
  } else {
    createBtn.value = true  // 맨 위에 가까우면 버튼 표시
  }
}

onMounted(() => {
  isPc.value = funcIsPc()
  window.addEventListener('resize', () => {
    isPc.value = funcIsPc()
  })
  window.addEventListener('scroll', handleScroll)
  handleScroll()
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <section class="team">
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
    <div class="team--tit">
      <strong><span>김마웨</span>님은</strong>
      <p><span>{{ isNoTeam ? 0 : 4 }}</span>개 팀에 참여중입니다.</p>
    </div>
    <TabRound v-model="activeTeamTab" :tabs="[{title:'진행중'}, {title:'진행종료'}, {title:'팀 초대', count: isNoTeam ? 0 : 2, new:isNoTeam ? false : true}]"> <!-- ?문 퍼블 확인용 챌린지 없을 때 -->
      <template #tab-0>
        <div v-if="isNoTeam" class="challenge--not"> <!-- v-if = 퍼블 확인용 챌린지 없을 때 -->
          <img src="/img/visual_alert_green.png">
          <p>지금은 참여중인 팀이 없습니다.</p>
        </div>
        <div v-else class="team--card-list">
          <button class="team--card challenge-team"> <!-- 202606 클릭 시 해당 팀 상세 페이지로 이동 필요 -->
            <div class="team--card-tit">
              <div>
                <span class="team--card-state">진행중</span>
              </div>
              <div>
                <span class="team--card-ranking">챌린지 팀 랭킹 <span>5</span>위</span>
              </div>
            </div>
            <div class="team--card-profile">
              <div class="team--card-img">
                <img src="/img/age_20f.png">
              </div>
              <div>
                <p>
                  <span class="team--card-tag">챌린지</span>
                  <span class="team--card-people">200명</span>
                </p>
                <div class="team--card-team">오래오래 건강수면 팀</div>
              </div>
            </div>
            <div class="team--card-info">
              <div>
                <p>전체 기간</p>
                <p>2026.02.01 ~ 2026.03.31<span>60일</span></p>
              </div>
              <div>
                <p>1회차 진행</p>
                <p>2026.02.01 ~ 2026.02.28<span>30일</span></p>
              </div>
              <div>
                <p>2회차 진행</p>
                <p>2026.03.01 ~ 2026.03.31<span>30일</span></p>
              </div>
            </div>
            <div class="challenge--box-rate">
              <div class="challenge--box-rate--wrap">
                <div class="challenge--box-rate--per"><span>챌린지 인증률</span><strong><span>70</span>%</strong></div>
                <TargetGauge :gaugePer="70" :compPer="68"></TargetGauge>
              </div>
            </div>
          </button>
          <button class="team--card challenge-team"> <!-- .challenge-team 챌린지 팀 -->
            <div class="team--card-tit">
              <div>
                <span class="team--card-state wait">대기중</span> <!-- .wait 대기중 스타일 -->
              </div>
              <div>
                <span class="team--card-ranking">챌린지 팀 랭킹 <span>0</span>위</span>
              </div>
            </div>
            <div class="team--card-profile">
              <div class="team--card-img leader"> <!-- .leader 팀장 아이콘 -->
                <img src="/img/age_20f.png">
              </div>
              <div>
                <p>
                  <span class="team--card-tag">챌린지</span>
                  <span class="team--card-people">64명</span>
                </p>
                <div class="team--card-team">오래오래 건강수면 팀 오래오래 건강수면 팀 말줄임 case</div>
              </div>
            </div>
            <div class="team--card-info">
              <div>
                <p>전체 기간</p>
                <p>2026.02.01 ~ 2026.03.31<span>60일</span></p>
              </div>
            </div>
            <div class="challenge--box-rate">
              <div class="challenge--box-rate--wrap">
                <div class="challenge--box-rate--per"><span>챌린지 인증률</span><strong><span>0</span>%</strong></div>
                <TargetGauge :gaugePer="0" :compPer="68"></TargetGauge>
              </div>
            </div>
          </button>

          <button class="team--card regular-team"> <!-- .regular-team 상시 팀 -->
            <div class="team--card-tit">
              <div>
                <span class="team--card-state">진행중</span>
              </div>
              <div>
                <span class="team--card-ranking">상시 팀 랭킹 <span>101</span>위</span>
                <button class="team--card-favorites active"></button> <!-- .active 활성화 -->
                <button class="team--card-add"></button>
              </div>
            </div>
            <div class="team--card-profile">
              <div class="team--card-img">
                <img src="/img/age_20f.png">
              </div>
              <div>
                <p>
                  <span class="team--card-tag">상시</span>
                  <span class="team--card-people">99명</span>
                </p>
                <div class="team--card-team">오래오래 건강수면 팀</div>
              </div>
            </div>
            <div class="team--card-info">
              <div>
                <p>전체 기간</p>
                <p>2026.02.01 ~ 2026.03.31<span>60일</span></p>
              </div>
            </div>
            <div class="challenge--box-rate">
              <div class="challenge--box-rate--wrap">
                <div class="challenge--box-rate--per"><span>이번달 인증률</span><strong><span>50</span>%</strong></div>
                <TargetGauge :gaugePer="50" :bgColor="'green'"></TargetGauge>
              </div>
            </div>
          </button>
          <button class="team--card regular-team">
            <div class="team--card-tit">
              <div>
                <span class="team--card-state wait">대기중</span>
              </div>
              <div>
                <span class="team--card-ranking">상시 팀 랭킹 <span>0</span>위</span>
                <button class="team--card-favorites"></button>
                <button class="team--card-add"></button>
              </div>
            </div>
            <div class="team--card-profile">
              <div class="team--card-img leader">
                <img src="/img/age_20f.png">
              </div>
              <div>
                <p>
                  <span class="team--card-tag">상시</span>
                  <span class="team--card-people">99명</span>
                </p>
                <div class="team--card-team">오래오래 건강수면 팀</div>
              </div>
            </div>
            <div class="team--card-info">
              <div>
                <p>전체 기간</p>
                <p>2026.02.01 ~ 2026.03.31<span>60일</span></p>
              </div>
            </div>
            <div class="challenge--box-rate">
              <div class="challenge--box-rate--wrap">
                <div class="challenge--box-rate--per"><span>이번달 인증률</span><strong><span>0</span>%</strong></div>
                <TargetGauge :gaugePer="0" :bgColor="'green'"></TargetGauge>
              </div>
            </div>
          </button>
        </div>
      </template>
      <template #tab-1>
        <div v-if="isNoTeam" class="challenge--not"> <!-- v-if = 퍼블 확인용 챌린지 없을 때 -->
          <img src="/img/visual_alert_green.png">
          <p>지금은 참여중인 팀이 없습니다.</p>
        </div>
        <div v-else class="team--card-list">
          <button class="team--card challenge-team">
            <div class="team--card-tit">
              <div>
                <span class="team--card-state end">진행종료</span> <!-- .end 진행종료 스타일 -->
                <span class="team--card-state">성공</span>
              </div>
            </div>
            <div class="team--card-profile">
              <div class="team--card-img">
                <img src="/img/age_20f.png">
              </div>
              <div>
                <p>
                  <span class="team--card-tag">챌린지</span>
                  <span class="team--card-people">200명</span>
                </p>
                <div class="team--card-team">오래오래 건강수면 팀</div>
              </div>
            </div>
            <div class="team--card-info">
              <div>
                <p>전체 기간</p>
                <p>2026.02.01 ~ 2026.03.31<span>60일</span></p>
              </div>
              <div>
                <p>1회차 <span class="success">성공</span></p>
                <p>2026.02.01 ~ 2026.02.28<span>30일</span></p>
              </div>
              <div>
                <p>2회차 <span class="fail">실패</span></p>
                <p>2026.03.01 ~ 2026.03.31<span>30일</span></p>
              </div>
            </div>
          </button>
          <button class="team--card regular-team">
            <div class="team--card-tit">
              <div>
                <span class="team--card-state end">진행종료</span>
                <span class="team--card-state">성공</span>
              </div>
            </div>
            <div class="team--card-profile">
              <div class="team--card-img">
                <img src="/img/age_20f.png">
              </div>
              <div>
                <p>
                  <span class="team--card-tag">상시</span>
                  <span class="team--card-people">99명</span>
                </p>
                <div class="team--card-team">오래오래 건강수면 팀</div>
              </div>
            </div>
            <div class="team--card-info">
              <div>
                <p>전체 기간</p>
                <p>2026.02.01 ~ 2026.03.31<span>60일</span></p>
              </div>
            </div>
          </button>
          <button class="team--card challenge-team">
            <div class="team--card-tit">
              <div>
                <span class="team--card-state end">진행종료</span>
                <span class="team--card-state fail">실패</span>  <!-- .fail 실패 스타일 -->
              </div>
            </div>
            <div class="team--card-profile">
              <div class="team--card-img leader">
                <img src="/img/age_20f.png">
              </div>
              <div>
                <p>
                  <span class="team--card-tag">챌린지</span>
                  <span class="team--card-people">64명</span>
                </p>
                <div class="team--card-team">오래오래 건강수면 팀 오래오래 건강수면 팀 말줄임 case</div>
              </div>
            </div>
            <div class="team--card-info">
              <div>
                <p>전체 기간</p>
                <p>2026.02.01 ~ 2026.03.31<span>60일</span></p>
              </div>
              <div>
                <p>1회차 <span class="fail">실패</span></p>
                <p>2026.02.01 ~ 2026.02.28<span>30일</span></p>
              </div>
              <div>
                <p>2회차 <span class="fail">실패</span></p>
                <p>2026.03.01 ~ 2026.03.31<span>30일</span></p>
              </div>
            </div>
          </button>
          <button class="team--card regular-team">
            <div class="team--card-tit">
              <div>
                <span class="team--card-state end">진행종료</span>
                <span class="team--card-state fail">실패</span>
              </div>
            </div>
            <div class="team--card-profile">
              <div class="team--card-img leader">
                <img src="/img/age_20f.png">
              </div>
              <div>
                <p>
                  <span class="team--card-tag">상시</span>
                  <span class="team--card-people">99명</span>
                </p>
                <div class="team--card-team">오래오래 건강수면 팀</div>
              </div>
            </div>
            <div class="team--card-info">
              <div>
                <p>전체 기간</p>
                <p>2026.02.01 ~ 2026.03.31<span>60일</span></p>
              </div>
            </div>
          </button>
        </div>
      </template>
      <template #tab-2>
        <div v-if="isNoTeam" class="challenge--not"> <!-- v-if = 퍼블 확인용 챌린지 없을 때 -->
          <img src="/img/visual_alert_green.png">
          <p>초대받은 팀이 없습니다.</p>
        </div>
        <div v-else class="team--card-list">
          <div class="team--card challenge-team">
            <div class="team--card-tit">
              <p>자두자두 졸리다 챌린지</p>
            </div>
            <div class="team--card-profile">
              <div class="team--card-img">
                <img src="/img/age_20f.png">
              </div>
              <div>
                <p>
                  <span class="team--card-tag">챌린지</span>
                  <span class="team--card-crown">오챌리</span>
                </p>
                <div class="team--card-team invite">오래오래 건강수면 팀</div>
                <div class="team--card-day">챌린지 시작까지<span>D-14</span></div>
              </div>
            </div>
            <div class="team--card-invite">
              <button class="team--invite-delete" aria-label="삭제하기"></button>
              <button class="team--invite-btn" @click="changeMissionPopup = true">참여하기</button> <!-- 퍼블 확인을 위해 팝업 임의 노출 -->
            </div>
          </div>
          <div class="team--card regular-team">
            <div class="team--card-profile">
              <div class="team--card-img">
                <img src="/img/age_20f.png">
              </div>
              <div>
                <p>
                  <span class="team--card-tag">상시</span>
                  <span class="team--card-crown">장챌린지</span>
                </p>
                <div class="team--card-team invite">오래오래 건강수면 팀 오래오래 건강수면 팀 오래오래 건강수면 팀</div>
              </div>
            </div>
            <div class="team--card-invite">
              <button class="team--invite-delete" aria-label="삭제하기"></button>
              <button class="team--invite-btn">참여하기</button>
            </div>
          </div>
        </div>
      </template>
    </TabRound>
    <BtnTop />
    <Transition name="fade">
      <div v-show="createBtn" class="team--create-btn">
        <button type="button"><img src="/img/ico_plus-white.svg"><span>팀 만들기</span></button>
      </div>
    </Transition>
  </section>

  <!-- 챌린지 한정 팀 초대 알림 팝업 - 로그인 시 노출 -->
  <BasePopup v-if="inviteTeamPopup">
    <template v-slot:contents>
      <p class="pop-text-light">자두자두 졸리다 챌린지 외 1개의<br>챌린지 팀에 초대 받았습니다.</p>
      <div class="pop-btn-wrap">
        <button type="button" @click="inviteTeamPopup = false" class="pop-btn pop-btn--gray">닫기</button>
        <button type="button" @click="inviteTeamPopup = false, activeTeamTab = 2" class="pop-btn pop-btn--green">확인하러 가기</button>
      </div>
    </template>
  </BasePopup>

  <!-- 팀 가입 불가 안내 (이미 참여중) 팝업  -->
  <BasePopupClose v-if="unableJoinPopup" :close-btn="false">
    <template v-slot:title>팀 가입 불가</template>
    <template v-slot:contents>
      <p class="pop-text-light">이미 챌린지 팀에 참여중입니다.</p>
    </template>
    <template v-slot:button>
      <button type="button" @click="unableJoinPopup = false" class="pop-btn pop-btn--green">확인</button>
    </template>
  </BasePopupClose>

  <!-- 미션 변경 알림 팝업 -->
  <BasePopup v-if="changeMissionPopup">
    <template v-slot:contents>
      <p class="pop-text-light">챌린지 참여 시 진행중인 미션이</p>
      <p class="pop-text-bold">혈압조절 - 혈압조절 제품(코엔자임 Q10, 마그네슘, 오메가3) 챙겨먹기</p>
      <p class="pop-text-light">미션으로 변경됩니다.<br>챌린지에 참여하시겠습니까?</p>
      <div class="pop-btn-wrap">
        <button type="button" @click="changeMissionPopup = false" class="pop-btn pop-btn--gray">닫기</button>
        <button type="button" @click="changeMissionPopup = false, porductStatusPopup = true" class="pop-btn pop-btn--green">참여하기</button> <!-- 퍼블 확인을 위해 팝업 임의 노출 -->
      </div>
    </template>
  </BasePopup>

  <!-- 제품 구매 여부 알림 팝업 -->
  <BasePopup v-if="porductStatusPopup">
    <template v-slot:contents>
      <p class="pop-text-light">챌린지 참여를 위해<br>제품 구매가 필요합니다.</p>
      <div class="pop-btn-wrap">
        <button type="button" @click="porductStatusPopup = false, unableJoinPopup = true" class="pop-btn pop-btn--green">확인</button> <!-- 퍼블 확인을 위해 팝업 임의 노출 -->
      </div>
    </template>
  </BasePopup>
</template>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
