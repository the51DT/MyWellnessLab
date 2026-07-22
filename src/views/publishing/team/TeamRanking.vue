<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import TabRound from '@/components/TabRound.vue'

/* 챌린지<->상시 구분 - 퍼블 임의  */
const route = useRoute()
const challengeTeam = computed(() => {
  return route.meta.title.includes('챌린지')
})

const headerTooltip = ref(false) /* 헤터 메달 부여 기준 여닫기 */

const rankingList = [  /* 퍼블 확인용 팀 리스트 */
  {
    teamName: '우리몸은 GUT Morning을 원한다 GUT Morning을 원한다!',
    teamMember: 100,
    teamRate: 100,
    teamImg: '/img/age_20f.png',
  },
  {
    teamName: '아침마다 오 마이 GUT Morning',
    teamMember: 99,
    teamRate: 95,
    teamImg: '/img/team_profile_exam.png',
    myTeam: true,
  },
  {
    teamName: '아침마다 오 마이 GUT Morning',
    teamMember: 99,
    teamRate: 90,
    teamImg: '/img/age_20f.png',
  },
  {
    teamName: '아침마다 오 마이 GUT Morning',
    teamMember: 99,
    teamRate: 90,
    teamImg: '/img/profile_exam1.png',
  },
  {
    teamName: '아침마다 오 마이 GUT Morning',
    teamMember: 99,
    teamRate: 70,
    teamImg: '/img/age_20f.png',
  },
  {
    teamName: '아침마다 오 마이 GUT Morning',
    teamMember: 99,
    teamRate: 70,
    teamImg: '/img/profile_exam2.png',
  },
  {
    teamName: '아침마다 오 마이 GUT Morning',
    teamMember: 99,
    teamRate: 70,
    teamImg: '/img/age_20f.png',
  },
  {
    teamName: '아침마다 오 마이 GUT Morning',
    teamMember: 99,
    teamRate: 70,
    teamImg: '/img/profile_exam3.png',
  },
  {
    teamName: '아침마다 오 마이 GUT Morning',
    teamMember: 99,
    teamRate: 70,
    teamImg: '/img/profile_exam4.png',
  },
  {
    teamName: '아침마다 오 마이 GUT Morning',
    teamMember: 99,
    teamRate: 70,
    teamImg: '/img/profile_exam5.png',
  },
]
</script>

<template>
  <section class="team-ranking" :class="{ challengeColor : challengeTeam}">
    <aside>
      <button type="button" aria-label="메달 부여 기준 확인하기" @click="headerTooltip = true"></button>
      <div v-if="headerTooltip">
        <button type="button" aria-label="메달 부여 기준 툴팁 닫기" @click="headerTooltip = false"></button>
        <p>메달 부여 기준</p>
        <ul>
          <li>
            <img src="/img/ico_medal_gold.svg">
            <strong>금메달</strong>
            <span>1위</span>
          </li>
          <li>
            <img src="/img/ico_medal_silver.svg">
            <strong>은메달</strong>
            <span>2위~10위</span>
          </li>
          <li>
            <img src="/img/ico_medal_bronze.svg">
            <strong>동메달</strong>
            <span>11위~30위</span>
          </li>
        </ul>
      </div>
    </aside>
    <TabRound :tabs="[{title:'인증률'}, {title:'인증횟수'}, ...(challengeTeam ? [{ title: '혜택 순위' }] : []) ]">
      <template #common>
        <div v-if="!challengeTeam" class="team-ranking--filter-radio">
          <div class="inputField--input--radio--wrap">
            <input class="inputField--input--radio" type="radio" id="month" value="month" name="period" checked>
            <lable class="inputField--input--radio--label" for="month">월별</lable>
          </div>
          <div class="inputField--input--radio--wrap">
            <input class="inputField--input--radio" type="radio" id="season" value="season" name="period">
            <lable class="inputField--input--radio--label" for="season">시즌</lable>
          </div>
        </div>
        <div v-if="challengeTeam" class="team-ranking--filter-desc">
          <p>챌린지 회차 선택</p>
          <p>팀원 수 선택</p>
        </div>
        <div class="team-ranking--filter-select">
          <div v-if="!challengeTeam" class="select-wrap">
            <select name="rankingSession" class="circle" required>
              <option value="session_all" selected>2026시즌(25.09~26.01)</option>
              <option value="session_1">2025시즌(25.09~26.01)</option>
              <option value="session_2">2024시즌(24.09~25.08)</option>
            </select>
          </div>
          <div v-else class="select-wrap">
            <select name="rankingSession" class="circle" required>
              <option value="session_all" selected>전체</option>
              <option value="session_1">챌린지 $1$회차</option>
              <option value="session_2">챌린지 $2$회차</option>
            </select>
          </div>
          <div class="select-wrap">
            <select name="rankingMin" class="circle" required>
              <option value="" disabled selected>최소</option>
              <option value="min_0">0명</option>
              <option value="min_1">10명</option>
              <option value="min_2">20명</option>
              <option value="min_3">30명</option>
              <option value="min_4">40명</option>
              <option value="min_5">50명</option>
              <option value="min_6">60명</option>
              <option value="min_7">70명</option>
              <option value="min_8">80명</option>
              <option value="min_9">90명</option>
            </select>
          </div>
          <span>~</span>
          <div class="select-wrap">
            <select name="rankingMax" class="circle" required>
              <option value="" disabled selected>최대</option>
              <option value="max_0">10명</option>
              <option value="max_1">20명</option>
              <option value="max_2">30명</option>
              <option value="max_3">40명</option>
              <option value="max_4">50명</option>
              <option value="max_5">60명</option>
              <option value="max_6">70명</option>
              <option value="max_7">80명</option>
              <option value="max_8">90명</option>
              <option value="max_9">100명</option>
            </select>
          </div>
        </div>
        <div class="team-ranking--filter-date">2025.09.17 10:49:00 기준</div>
      </template>
      <template #tab-0> <!-- 인증률 -->
        <div class="team-ranking--list">
          <div v-for="(team, index) in rankingList" :key="team.teamName" class="team-ranking--box" :class="{ myTeam: team.myTeam}">
            <div class="team-ranking--profile">
              <div class="team-ranking--medal" :class="index >= 1 ? 'silver' : 'gold'"> <!-- 금메달 .gold / 은메달 .silver / 동메달(랭킹 리스트x) .bronze / 그 외 회색 -->
                <span>{{ index + 1 }}위</span>
              </div>
              <img :src="team.teamImg">
            </div>
            <div class="team-ranking--info">
              <p class="team-ranking--team">{{ team.teamName }}</p>
              <div>
                <div class="team-ranking--member">{{ team.teamMember }}명</div>
                <div class="team-ranking--rate">
                  <span>{{ challengeTeam ? '팀 인증률 ' : '팀 인증횟수 ' }}</span>
                  <strong>{{ team.teamRate }}</strong>
                  <span>{{ challengeTeam ? '% ' : '회' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="team-ranking--sticky">
          <div class="team-ranking--box myTeam">
            <div class="team-ranking--profile">
              <div class="team-ranking--medal"> <!-- 금메달 .gold / 은메달 .silver / 동메달(랭킹 리스트x) .bronze / 그 외 회색 -->
                <span>999위</span>
              </div>
              <img src="/img/age_20f.png">
            </div>
            <div class="team-ranking--info">
              <p class="team-ranking--team">아침마다 오 마이 GUT Morning</p>
              <div>
                <div class="team-ranking--member">99명</div>
                <div class="team-ranking--rate">
                  <span>{{ challengeTeam ? '팀 인증률 ' : '팀 인증횟수 ' }}</span>
                  <strong>95</strong>
                  <span>{{ challengeTeam ? '% ' : '회' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template #tab-1> <!-- 인증횟수 -->
        <div class="team-ranking--list">
          <div v-for="(team, index) in rankingList" :key="team.teamName" class="team-ranking--box" :class="{ myTeam: team.myTeam}">
            <div class="team-ranking--profile">
              <div class="team-ranking--medal" :class="index >= 1 ? 'silver' : 'gold'"> <!-- 금메달 .gold / 은메달 .silver / 동메달(랭킹 리스트x) .bronze / 그 외 회색 -->
                <span>{{ index + 1 }}위</span>
              </div>
              <img :src="team.teamImg">
            </div>
            <div class="team-ranking--info">
              <p class="team-ranking--team">{{ team.teamName }}</p>
              <div>
                <div class="team-ranking--member">{{ team.teamMember }}명</div>
                <div class="team-ranking--rate">
                  <span>{{ challengeTeam ? '팀 인증률 ' : '팀 인증횟수 ' }}</span>
                  <strong>{{ team.teamRate }}</strong>
                  <span>{{ challengeTeam ? '% ' : '회' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="team-ranking--sticky">
          <div class="team-ranking--box myTeam">
            <div class="team-ranking--profile">
              <div class="team-ranking--medal silver"> <!-- 금메달 .gold / 은메달 .silver / 동메달(랭킹 리스트x) .bronze / 그 외 회색 -->
                <span>2위</span>
              </div>
              <img src="/img/age_20f.png">
            </div>
            <div class="team-ranking--info">
              <p class="team-ranking--team">아침마다 오 마이 GUT Morning</p>
              <div>
                <div class="team-ranking--member">231명</div>
                <div class="team-ranking--rate">
                  <span>{{ challengeTeam ? '팀 인증률 ' : '팀 인증횟수 ' }}</span>
                  <strong>95</strong>
                  <span>{{ challengeTeam ? '% ' : '회' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template #tab-2> <!-- 혜택순위 - 챌린지 -->
        <div class="team-ranking--list">
          <div v-for="(team, index) in rankingList" :key="team.teamName" class="team-ranking--box" :class="{ myTeam: team.myTeam}">
            <div class="team-ranking--profile">
              <div class="team-ranking--medal" :class="index >= 1 ? 'silver' : 'gold'"> <!-- 금메달 .gold / 은메달 .silver / 동메달(랭킹 리스트x) .bronze / 그 외 회색 -->
                <span>{{ index + 1 }}위</span>
              </div>
              <img :src="team.teamImg">
            </div>
            <div class="team-ranking--info">
              <p class="team-ranking--team">{{ team.teamName }}</p>
              <div>
                <div class="team-ranking--member">{{ team.teamMember }}명</div>
                <div class="team-ranking--rate">
                  <span>{{ challengeTeam ? '팀 인증률 ' : '팀 인증횟수 ' }}</span>
                  <strong>{{ team.teamRate }}</strong>
                  <span>{{ challengeTeam ? '% ' : '회' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="team-ranking--sticky">
          <div class="team-ranking--box myTeam">
            <div class="team-ranking--profile">
              <div class="team-ranking--medal"> <!-- 금메달 .gold / 은메달 .silver / 동메달(랭킹 리스트x) .bronze / 그 외 회색 -->
                <span>999위</span>
              </div>
              <img src="/img/age_20f.png">
            </div>
            <div class="team-ranking--info">
              <p class="team-ranking--team">아침마다 오 마이 GUT Morning</p>
              <div>
                <div class="team-ranking--member">9명</div>
                <div class="team-ranking--rate">
                  <span>{{ challengeTeam ? '팀 인증률 ' : '팀 인증횟수 ' }}</span>
                  <strong>95</strong>
                  <span>{{ challengeTeam ? '% ' : '회' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </TabRound>
  </section>
</template>

<style lang="sass" scoped>
</style>