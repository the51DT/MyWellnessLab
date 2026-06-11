<script setup>
import { onBeforeMount, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import * as joinApi from '@/apis/join'

const store = useStore()
const router = useRouter()

const userList = computed(() => store.getters.getProfileList)

/**
 * 서비스 가입 여부
 * @param {*} customerId
 * @returns {boolean}
 */
const shouldJoin = async (customerId) => {
  const response = await joinApi.getJoinStatus(customerId)
  return response.data.userCheck === 0
}

/**
 * 로그인 한 유저인지 확인후 'PIN 번호 입력' 으로 이동
 * @param {*} profile
 */
const handleSelect = async (profile) => {
  try {
    const customerId = profile.customerId

    if (customerId && await shouldJoin(customerId)) {
      store.dispatch('setIsShowJoinAlert', true)

      store.dispatch('setUser', profile)
      store.dispatch('setJoinInfo', profile)

      return
    }

    // const userInfo = await getUserInfo(customerId)
    store.dispatch('setUser', {
      ...profile
      // ...userInfo
    })

    router.push({ name: 'LoginPin' })
  } catch (e) {
    console.error(e)
  }
}

onBeforeMount(() => {
  store.dispatch('setUser', {})
})
</script>

<template>
  <div class="login--wrap">
    <div class="login--center">
      <div class="login--txt" v-html="$t('Profile.text1')">
      </div>

      <div class="align--center login--user">
        <ul class="user--select">
          <li v-for="(item, index) in userList" :key="index" class="login--li">
            <div class="login--a" @click="handleSelect(item)" style="cursor: pointer;">
              <div class="user--sex" :class="item.gender === 'MALE' ? 'male' : 'female'" />
              <strong class="login--name">{{ item.name }}</strong>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
