<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

/* 챌린지<->상시 구분 - 퍼블 임의  */
const route = useRoute()
const challengeTeam = computed(() => {
  return route.meta.teamClassification === 'challenge'
})
const noMember = computed(() => {
  return route.meta.noMember === true
})
const isLeader = computed(() => {
  return route.meta.isLeader === true
})

const sortFavorites = ref(false) /* 즐겨찾기한 팀원만 보기 토글 */
const sortLayout = ref(false) /* full <-> lite 리스트 전환 토글 */
const memberList = ref([ /* 퍼블 확인용 챌린지 팀원 데이터 */
  {
    nickname: '닉네임 두 줄 케이스 줄바꿈',
    leader: true,
    profileImg: '/img/img_profile.png',
    ranking: 1,
    name: '홍길동 여러줄 여러줄 여러줄 Case',
    missionCate: '근육(근력)근건강',
    missionDetail: '1회 이상 식후 15분 가볍게 걷기',
    count: 563,
    per: 100,
    today: true,
    purchase: true,
    isFavorite: true,
  },
  {
    nickname: '닉네임',
    leader: false,
    profileImg: '/img/img_profile.png',
    ranking: 2,
    name: '홍길동',
    missionCate: '혈당조절',
    missionDetail: '1회 이상 식후 15분 가볍게 걷기',
    count: 453,
    per: 60,
    today: false,
    purchase: false,
    isFavorite: false,
  },
  {
    nickname: '닉네임',
    leader: false,
    profileImg: '/img/img_profile.png',
    ranking: 3,
    name: '홍길동',
    missionCate: '혈당조절',
    missionDetail: '1회 이상 식후 15분 가볍게 걷기',
    count: 233,
    per: 60,
    today: false,
    purchase: false,
    isFavorite: true,
  },
])
</script>

<template>
  <section class="team-status" :class="{ challengeColor : challengeTeam}">
    <div class="team-status--filter-wrap">
      <div v-if="challengeTeam && !noMember" class="select-wrap">
        <select name="statusSession" class="circle" required>
          <option value="session_all" selected>전체</option>
          <option value="session_1">챌린지 $1$회차</option>
          <option value="session_2">챌린지 $2$회차</option>
        </select>
      </div>
      <div v-if="!challengeTeam" class="select-wrap">
        <select name="statusSession" class="circle" required>
          <option value="session_all" selected>2026.09</option>
          <option value="session_1">2026.08</option>
          <option value="session_2">2026.07</option>
          <option value="session_3">2026.06</option>
        </select>
      </div>
      <div class="select-wrap">
        <select name="statusDetail" class="circle" required>
          <option value="detail_1" selected>전체</option>
          <option value="detail_2">오늘 인증 완료</option>
          <option value="detail_3">오늘 미인증 팀원</option>
          <option v-if="challengeTeam" value="detail_prod">제품 구매 완료</option>
          <option v-if="challengeTeam" value="detail_prod_no">제품 미구매 팀원</option>
          <option value="detail_4">80% 이상 달성</option>
          <option value="detail_5">80% 미만 달성</option>
        </select>
      </div>
    </div>
    <div class="team-status--sort-wrap">
      <div class="sort-wrap">
        <span class="sort-wrap--text">랭킹 높은 순</span> <!-- 260820 문구 수정 -->
        <select name="statusSort" class="circle" required @change="$event.currentTarget.previousElementSibling.textContent = $event.currentTarget.selectedOptions[0].textContent">
          <option value="sort_1" selected>랭킹 높은 순</option> <!-- 260820 문구 수정 -->
          <option value="sort_2">랭킹 낮은 순</option> <!-- 260820 문구 수정 -->
          <option value="sort_3">전체 인증횟수 높은 순</option>
          <option value="sort_4">전체 인증횟수 낮은 순</option>
          <option value="sort_5">닉네임 가나다순</option>
        </select>
      </div>
      <div class="sort-btn">
        <button class="btn-favorites" @click="sortFavorites = !sortFavorites" :class="{active: sortFavorites}"></button>
        <button class="btn-layout" @click="sortLayout = !sortLayout" :class="{active: sortLayout}"></button>
      </div>
    </div>
    <div v-if="noMember" class="challenge--not"> <!-- v-if = 퍼블 확인용 챌린지 없을 때 -->
      <img src="/img/visual_alert_green.png">
      <p>조회된 팀원이 없습니다.</p>
    </div>
    <div v-else class="team-status--list" :class="{liteVersion: sortLayout}"> <!-- .ty02 라이트 버전 -->
      <div v-for="item in memberList" :key="item.name" class="team-status--box" @click=""> <!-- 팀원 카드 클릭 시 팀원 상세 페이지로 이동 -->
        <div v-if="!sortLayout" class="team-status--profile">
          <div class="img-wrap" :class="{leader:item.leader}"> <!-- .leader 팀장 표시 -->
            <img :src="item.profileImg">
          </div>
          <p>{{ item.nickname }}</p>
        </div>
        <div class="team-status--info">
          <!-- [s] 260820 .team-status--info 내부 수정 -->
          <dl v-if="!sortLayout">
            <dt>랭킹</dt>
            <dd>{{ item.ranking }}위</dd>
          </dl>
          <dl v-if="isLeader">
            <dt>이름</dt>
            <dd>{{ item.name }}</dd>
          </dl>
          <dl v-if="!isLeader && sortLayout">
            <dt>닉네임</dt>
            <dd>{{ item.nickname }}</dd>
          </dl>
          <dl v-if="isLeader">
            <dt>진행 미션</dt>
            <dd><span class="tag">{{ item.missionCate }}</span><span v-if="!sortLayout">{{ item.missionDetail }}</span></dd>
          </dl>
          <dl>
            <dt>{{ challengeTeam ? '인증횟수' : sortLayout ? '전체인증횟수' : '전체 인증 횟수' }}</dt> <!-- 챌린지/상시 구분 퍼블 임의 -->
            <dd>{{ item.count }}회</dd>
          </dl>
          <dl>
            <dt>{{ challengeTeam ? '인증률' : sortLayout ? '이달의인증' : '이 달의 인증' }}</dt> <!-- 챌린지/상시 구분 퍼블 임의 -->
            <dd><span v-if="!challengeTeam">12월 22회</span><span class="color">{{ item.per }}%</span></dd>
          </dl>
          <!-- [e] 260820 .team-status--info 내부 수정 -->
          <dl>
            <dt>{{ sortLayout ? '오늘인증' : '오늘 인증' }}</dt>
            <dd v-if="item.today"><span class="color">O</span></dd>
            <dd v-else><span class="not">X</span></dd>
          </dl>
          <div v-if="challengeTeam && isLeader" class="team-status--purchase" :class="{active:item.purchase}">{{ item.purchase ? '제품 구매완료' : '제품 미구매' }}</div>
        </div>
        <button v-if="!sortLayout" class="team-status--fav" @click.stop="item.isFavorite = !item.isFavorite" :class="{active: item.isFavorite}" :aria-label="isFavorite ? '즐겨찾기 해제' : '즐겨찾기 등록'"></button>
      </div>
    </div>
  </section>
</template>

<style lang="sass" scoped>

</style>