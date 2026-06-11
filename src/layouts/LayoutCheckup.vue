<script setup>
import { ref, computed, watch, provide } from 'vue'
import { useStore } from 'vuex'
import { RouterView, useRoute } from 'vue-router'
import router from '@/router'
import BasePopup from '@/components/BasePopup.vue'
import { useMovePrev } from '@/composables/checkup'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()
const store = useStore()
const route = useRoute()
const movePrev = useMovePrev()

const analysisType = store.getters['checkup/getAnalysisType']
const healthDataType = store.getters['checkup/getHealthDataType']

const isStop = ref(false)
const isShowStopConfirm = ref(false)
const title = ref(route.meta?.title || '')

// 다국어 처리된 제목
const translatedTitle = computed(() => {
  if (!title.value) return ''
  if (title.value.startsWith('Router.')) {
    return t(title.value)
  }
  return title.value
})

const isOneTime = computed(() => {
  return analysisType === 'onetime'
})

watch(
  () => route.path,
  () => {
    title.value = route.meta?.title || ''
  },
  {
    immediate: true
  }
)

const showStopConfirm = () => {
  isShowStopConfirm.value = true
}

const closeStopConfirm = () => {
  isShowStopConfirm.value = false
}

const ROUTES = {
  BASICS: 'CheckupBasics',
  SIDE_SELECT: 'CheckupSideSelect',
  DATE_SELECT: 'CheckupDateSelect',
}

const handleBack = async () => {
  const isBasicsPage = route.name === ROUTES.BASICS

  // 1) 기본 페이지가 아니면 이전 스텝으로
  if (!isBasicsPage) {
    await movePrev()
    return
  }

  // 2) 기본 페이지 + 원타임이면 확인 팝업
  if (isOneTime.value) {
    showStopConfirm()
    return
  }

  // 3) 기본 페이지 + 포멀/일반에 따라 라우팅
  const target = healthDataType === 'formal'
    ? ROUTES.SIDE_SELECT
    : ROUTES.DATE_SELECT

  router.push({ name: target })
}

const handleStop = () => {
  if (!isOneTime.value) {
    isStop.value = true

    store.dispatch('showToast', t('LayoutCheckup.p8'))
  } else {
    isShowStopConfirm.value = false
  }
  router.push({ name: 'Home' })
}

provide('stop', isStop)
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
          <button @click="showStopConfirm" type="button" />
        </div>
      </div>
    </header>

    <main>
      <RouterView />
    </main>

    <base-popup v-if="isShowStopConfirm" class="pop-style">
      <template v-slot:contents>
        <template v-if="isOneTime">
          <p class="pop-text-light">{{ $t('LayoutCheckup.p1') }}<br />{{ $t('LayoutCheckup.p2') }}</p>
          <p class="pop-text-bold">{{ $t('LayoutCheckup.p3') }}</p>
        </template>
        <template v-else>
          <p class="pop-text-bold">{{ $t('LayoutCheckup.p4') }}</p>
          <p class="pop-text-light">{{ $t('LayoutCheckup.p5') }}</p>
        </template>
        <div class="pop-btn-wrap">
          <button @click="closeStopConfirm" type="button" class="pop-btn pop-btn--gray">{{ $t('Common.cancle') }}</button>
          <button @click="handleStop" type="button" class="pop-btn pop-btn--green">{{ $t('Common.confirm') }}</button>
        </div>
      </template>
    </base-popup>
  </div>
</template>
