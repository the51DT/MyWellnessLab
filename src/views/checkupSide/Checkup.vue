<script setup>
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import BasePopup from "@/components/BasePopup.vue";
import {ref} from "vue";

const store = useStore()
const router = useRouter()

const handleNext = (value) => {
  store.dispatch('checkup/setAnalysisType', 'normal')
  store.dispatch('checkup/setHealthDataType', value)

  router.push({ name: 'CheckupSideTerms' })
}

const isShowPopup = ref(true)

const closePopup = () => {
  isShowPopup.value = false
}

</script>

<template>
  <div class="analyze checkupSide">
    <div class="txt--center analyze--info">
      <span class="analyze--info-txt gray">{{ $t('Side.Checkup.text1') }}</span> <br />
      {{ $t('Side.Checkup.text2') }}
    </div>
    <div class="txt--center analyze--btn-wrap">
      <a
        href="javascript:void(0);"
        @click="handleNext('formal');"
        type="button"
        class="btn--big4">
        <span class="align--between btn--big4--txt">
          <span class="btn--big4--ico">
            <img src="/img/ico_nhis.svg" alt="건강검진 불러오기" />
          </span>
          <span class="checkup--import">
            {{ $t('Side.Checkup.text3') }}
            <span class="btn--big4--desc">{{ $t('Side.Checkup.text4') }}</span>
          </span>
        </span>
      </a>
      <a
        href="javascript:void(0);"
        @click="handleNext('direct');"
        type="button"
        class="btn--big4">
        <span class="align--between btn--big4--txt">
          <span class="btn--big4--ico">
            <img src="/img/ico_direct_input.svg" alt="직접 입력" class="analyze--direct" />
          </span>
          <span class="checkup--direct">
            {{ $t('Side.Checkup.text5') }}
          </span>
        </span>
      </a>
    </div>
    <div class="analyze--txt">
      <ul class="bull--billiards analyze--ul">
        <li class="analyze--li">
          <span>
            {{ $t('Side.Checkup.text6') }} <span class="txt--red">{{ $t('Side.Checkup.text7') }}</span>{{ $t('Side.Checkup.text8') }}
          </span>
        </li>
        <li>
          <span>
            {{ $t('Side.Checkup.text9') }} <span class="txt--red">{{ $t('Side.Checkup.text10') }}{{ $t('Side.Checkup.text11') }}</span>
          </span>
        </li>
      </ul>
    </div>
  </div>

<!--  <BasePopup v-if="isShowPopup" class="TermsAgree&#45;&#45;join-confirm">-->
<!--    <template v-slot:contents>-->
<!--      <div class="join-confirm-content">-->
<!--        <p class="pop-text-bold">현재 국민건강보험공단의 건강검진 불러오기에 오류가 있어 일시적으로 서비스가 제공되지 않고 있습니다.<br> 직접 입력으로 진행해주세요.</p>-->
<!--      </div>-->
<!--      <div class="pop-btn-wrap">-->
<!--        <button type="button" @click="closePopup" class="pop-btn pop-btn&#45;&#45;green">확인</button>-->
<!--      </div>-->
<!--    </template>-->
<!--  </BasePopup>-->
</template>
