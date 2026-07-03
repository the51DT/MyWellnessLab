<script setup>
import { useRoute } from 'vue-router'
import { go } from '@/assets/js/common'

const route = useRoute()

const menus = [
  {
    label: '홈',
    path: '/publishing/main', /* 202606 퍼블로 임시 지정 변경 필요 */
    icon: '/img/ico_dock-home.svg',
    activeIcon: '/img/ico_dock-home_on.svg'
  },
  {
    label: '건강수명 분석',
    path: '/publishing/home', /* 202606 퍼블로 임시 지정 변경 필요 */
    icon: '/img/ico_dock-health.svg',
    activeIcon: '/img/ico_dock-health_on.svg'
  },
  {
    label: '챌린지',
    path: '/', /* 202606 퍼블로 임시 지정 변경 필요 */
    icon: '/img/ico_dock-challenge.svg',
    activeIcon: '/img/ico_dock-challenge_on.svg'
  },
  {
    label: '나의 팀',
    path: '/', /* 202606 퍼블로 임시 지정 변경 필요 */
    icon: '/img/ico_dock-team.svg',
    activeIcon: '/img/ico_dock-team_on.svg'
  },
  {
    label: '마이',
    path: '/', /* 202606 퍼블로 임시 지정 변경 필요 */
    icon: '/img/ico_dock-my.svg',
    activeIcon: '/img/ico_dock-my_on.svg'
  }
]

const props = defineProps({
  isSideBar: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits([
  'update:isSideBar'
])

function openSideMenu() {
  emit('update:isSideBar', true)
}

function isActive(path) {
  if (path === '/') {
    return route.path === '/'
  }

  return route.path.startsWith(path)
}
</script>

<template>
  <div class="home--dock">
    <div class="home--dock--list">
      <div
        v-for="menu in menus"
        :key="menu.label"
        :class="{ active: isActive(menu.path) }"
      >
        <button @click="go(menu.path)" type="button" class="btn--menu">
          <img
            :src="isActive(menu.path) ? menu.activeIcon : menu.icon"
            alt=""
          />
          <span>{{ menu.label }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>