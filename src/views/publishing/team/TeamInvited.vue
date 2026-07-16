<script setup>
import TabRound from '@/components/TabRound.vue'

 /* 퍼블 확인용 챌린지 데이터 없을 때 받을 값 */
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()
const invitedList = computed(() => {
  if(route.meta.noInvitedList === true) {
    return []
  }
  else {
    return [ /* 퍼블 확인용 초대 리스트 데이터 / state 참여 완료 true, 대기 false */
      {
        profile: '/img/age_20f.png',
        name: '홍길동',
        nickname: '김웨이',
        state: true,
      },
      {
        profile: '/img/age_20f.png',
        name: '홍길동',
        nickname: '김웨이',
        state: false,
      },
      {
        profile: '/img/age_20f.png',
        name: '홍길동',
        nickname: '김웨이',
        state: false,
      },
      {
        profile: '/img/age_20f.png',
        name: '홍길동',
        nickname: '김웨이',
        state: true,
      },
      {
        profile: '/img/age_20f.png',
        name: '홍길동',
        nickname: '김웨이',
        state: true,
      },
      {
        profile: '/img/age_20f.png',
        name: '홍길동',
        nickname: '김웨이',
        state: false,
      },
      {
        profile: '/img/age_20f.png',
        name: '홍길동',
        nickname: '김웨이',
        state: true,
      },
      {
        profile: '/img/age_20f.png',
        name: '홍길동',
        nickname: '김웨이',
        state: false,
      },
      {
        profile: '/img/age_20f.png',
        name: '홍길동',
        nickname: '김웨이',
        state: true,
      },
      {
        profile: '/img/age_20f.png',
        name: '홍길동',
        nickname: '김웨이',
        state: false,
      },
      {
        profile: '/img/age_20f.png',
        name: '홍길동',
        nickname: '김웨이',
        state: false,
      },
    ]
  }
})
const activeInviteTab = ref(0)
const filteredInvitedList = computed(() => {
  if (activeInviteTab.value === 1) {
    return invitedList.value.filter(item => item.state === false)
  }
  if (activeInviteTab.value === 2) {
    return invitedList.value.filter(item => item.state === true)
  }
  return invitedList.value
})
</script>

<template>
  <section class="team">
    <div class="team--tit">
      <strong><span>김마웨</span>님이</strong>
      <p>초대한 팀원 현황입니다.</p>
    </div>
    <TabRound v-model="activeInviteTab" :tabs="[{title:'전체', count:100}, {title:'참여 대기', count:55}, {title:'참여 완료', count:45}]">
      <template #tab-0>
        <div v-if="filteredInvitedList.length === 0" class="challenge--not">
          <img src="/img/visual_alert_green.png">
          <p>초대한 팀원이 없습니다.</p>
        </div>
        <div v-else>
          <div class="team-invited--list">
            <div v-for="(item, index) in filteredInvitedList" :key="index" class="team-invited--card" :class="item.state ? 'comp' : 'wait'">
              <div>
                <img :src="item.profile" alt="프로필 이미지">
                <div class="card-name">
                  <p><span>이름</span>{{ item.name }}</p>
                  <p><span>닉네임</span>{{ item.nickname }}</p>
                </div>
              </div>
              <div class="card-state">
                <div class="card-icon"></div>
                <div class="card-text">{{ item.state ? '참여 완료' : '참여 대기' }}</div>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template #tab-1>
        <div v-if="filteredInvitedList.length === 0" class="challenge--not">
          <img src="/img/visual_alert_green.png">
          <p>참여 대기 팀원이 없습니다.</p>
        </div>
        <div v-else>
          <div class="team-invited--list">
            <div v-for="(item, index) in filteredInvitedList" :key="index" class="team-invited--card wait">
              <div>
                <img :src="item.profile" alt="프로필 이미지">
                <div class="card-name">
                  <p><span>이름</span>{{ item.name }}</p>
                  <p><span>닉네임</span>{{ item.nickname }}</p>
                </div>
              </div>
              <div class="card-state">
                <div class="card-icon"></div>
                <div class="card-text">{{ item.state ? '참여 완료' : '참여 대기' }}</div>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template #tab-2>
        <div v-if="filteredInvitedList.length === 0" class="challenge--not">
          <img src="/img/visual_alert_green.png">
          <p>참여 완료 팀원이 없습니다.</p>
        </div>
        <div v-else>
          <div class="team-invited--list">
            <div v-for="(item, index) in filteredInvitedList" :key="index" class="team-invited--card comp">
              <div>
                <img :src="item.profile" alt="프로필 이미지">
                <div class="card-name">
                  <p><span>이름</span>{{ item.name }}</p>
                  <p><span>닉네임</span>{{ item.nickname }}</p>
                </div>
              </div>
              <div class="card-state">
                <div class="card-icon"></div>
                <div class="card-text">{{ item.state ? '참여 완료' : '참여 대기' }}</div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </TabRound>
  </section>
</template>

<style lang="scss" scoped>
</style>
