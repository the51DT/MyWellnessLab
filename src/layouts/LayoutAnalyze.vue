<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { RouterView, useRoute, useRouter, onBeforeRouteLeave } from 'vue-router'
import BasePopup from '@/components/BasePopup.vue'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()
const store = useStore()
const route = useRoute()
const router = useRouter()

const analysisType = store.getters['checkup/getAnalysisType']
const resultId = store.getters['checkup/getResultId']

const title = ref(route.meta?.title || '')
const toastMsg = ref(null)
const isOneTimeBack = ref(false)
const allowLeave = ref(false)

const childView = ref(null)

const detailId = ref(0)

// 다국어 처리된 제목
const translatedTitle = computed(() => {
  if (!title.value) return ''
  if (title.value.startsWith('Router.')) {
    return t(title.value)
  }
  return title.value
})

const isDetailRoute = computed(() => {
  return route.name === 'AnalyzeDetail'
})
const handleBack = () => {
  if (analysisType === 'onetime' && isDetailRoute.value) {
    isOneTimeBack.value = true
    return
  }

  // AnalyzeDetail 페이지에서는 무조건 Home으로 이동
  if (route.name === 'AnalyzeDetail') {
    router.push({ name: 'Home' })
    return
  }

  router.go(-1)
}

const cancleOneTimeBack = () => {
  isOneTimeBack.value = false
}

const doOneTimeBack = () => {
  isOneTimeBack.value = false
  allowLeave.value = true
  router.push({ name: 'Home' }).finally(() => {
    // leave 허용 플래그는 내비게이션 이후 초기화
    allowLeave.value = false
  })
}

watch(
  () => route.path,
  () => {
    title.value = route.meta?.title || ''
    if (history.state.detailId !== undefined) {
      detailId.value = history.state.detailId
    }
  },
  {
    immediate: true
  }
)

onMounted(() => {
  if (route.name === 'AnalyzeDetail' && !resultId) {
    alert(t('LayoutAnalyze.alert.invalid'))
    router.push({ name: 'Home' })
  }
})

onBeforeRouteLeave((to, from) => {
  // onetime 분석에서 상세 페이지를 떠나려는 경우 확인 팝업 표시
  if (allowLeave.value) return true
  if (analysisType === 'onetime' && from.name === 'AnalyzeDetail') {
    isOneTimeBack.value = true
    return false
  }
  
  // 일반 분석에서 /checkup-side/로 이동하는 경우 /home으로 리다이렉트
  if (from.name === 'AnalyzeDetail' && to.path.startsWith('/checkup-side/')) {
    router.push('/home')
    return false
  }
  
  return true
})
</script>

<template>
  <div class="layout--checkup" :class="$route.meta.class">
    <header class="header">
      <div class="header--wrap">
        <div class="header--back">
          <button
            @click="handleBack"
            class="header--back-btn"
            title="뒤로"
            type="button" />
        </div>
        <h1 class="header--tit">
          <span>{{ translatedTitle }}</span>
        </h1>

        <div class="header--close txt--right">
          <button
            v-if="isDetailRoute && analysisType !== 'onetime'"
            @click="router.push('/')"
            class="header--home-btn"
            aria-label="홈"
            type="button" />
        </div>

      </div>
    </header>

    <main>
      <RouterView ref="childView" />
    </main>

    <transition name="toastFade">
      <div v-if="toastMsg" class="toast">
        {{ toastMsg }}
      </div>
    </transition>

    <base-popup v-if="isOneTimeBack" class="base-pop">
      <template v-slot:contents>
        <p v-html="t('LayoutAnalyze.Popup.p1')"></p>
        <p v-html="t('LayoutAnalyze.Popup.p2')"></p>
        <div class="base-pop--footer">
          <button @click="cancleOneTimeBack" class="btn-pop--gray" type="button">{{ $t('Common.cancle')}}</button>
          <button @click="doOneTimeBack" class="btn-pop--green" type="button">{{ $t('Common.confirm')}}</button>
        </div>
      </template>
    </base-popup>
  </div>
</template>
