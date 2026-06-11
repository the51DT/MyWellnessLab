<script setup>
import {RouterView, useRoute} from "vue-router";
import {ref, watch, computed} from "vue";
import router from "@/router";
import { useCheckupSideNavigation } from '@/composables/checkup-side'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const route = useRoute();
const title = ref(route.meta?.title || ''); /*페이지 제목*/

const isSelectProfile = ref(false); /*240116 프로필 페이지에서는 백버튼이 없어야 해서 추가한 변수, true: 백 버튼 삭제*/

// checkup-side 네비게이션 composable 사용
const { handleBack: handleCheckupSideBack } = useCheckupSideNavigation()

// 다국어 처리된 제목
const translatedTitle = computed(() => {
  if (!title.value) return ''
  if (title.value.startsWith('Router.')) {
    return t(title.value)
  }
  return title.value
})

watch(
    () => route.path,
    () => {
      title.value = route.meta?.title || '';
      isSelectProfile.value = route.name === "LoginProfile";
    },
    {
      immediate: true
    }
);

function back(){
  // checkup-side 경로인 경우 특별 처리
  if(route.path.startsWith('/checkup-side')){
    handleCheckupSideBack()
    return
  }

  if(route.path === "/dev-analyze-detail"){ /*일회성 분석 결과 페이지일 경우 별도 처리*/
    switch(history.state.back) {
      case '/dev-analyze':
        router.back();
        break;
      default:
        router.push('/');
        break;
    }
  }

  router.back();
}
</script>

<template>
  <div class="layout--normal" :class="$route.meta.class"> <!--231201 클래스 추가-->
    <header class="header">
      <div class="header--wrap">
        <div class="header--back">
          <button v-if="!isSelectProfile" @click="back" class="header--back-btn" title="뒤로" type="button"></button>
        </div>
        <h1 class="header--tit">
          <span>{{ translatedTitle }}</span>
        </h1>
        <div class="header--close"></div>
      </div>
    </header>

    <main>
      <RouterView/>
    </main>

  </div>
</template>

<style scoped>

</style>