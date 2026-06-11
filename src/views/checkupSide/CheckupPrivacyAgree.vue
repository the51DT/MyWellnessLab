<script setup>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import CheckupPrivacyAgreePopup from './components/CheckupPrivacyAgreePopup.vue'
import BasePopup from '@/components/BasePopup.vue'

const store = useStore()
const router = useRouter()

const analysisType = store.getters['checkup/getAnalysisType']
const healthDataType = store.getters['checkup/getHealthDataType']

const popupCertification = ref(false)

const toggleRule1 = ref(false)
const toggleRule2 = ref(false)
const required = ref(false)
const nonRequired = ref(false)
const refRule1 = ref(null)
const popMust = ref(false)

const isShowSelectedAgree = computed(() => {
  return analysisType !== 'onetime'
})

const popMustClose = () => {
  popMust.value = false
  if (refRule1.value) {
    refRule1.value.focus()
  }
}

const handleProceed = (value) => {
  if (value === 'Y') {
    if (!required.value) {
      popMust.value = true
      return
    }
    if (analysisType === 'normal' && healthDataType === 'formal') {
      popupCertification.value = true
    } else {
      router.push({ name: 'CheckupDateSelect' })
    }

    store.dispatch('checkup/setTermsCheck', {
      required: required.value,
      nonRequired: nonRequired.value
    })
  } else if (value === 'N') {
    router.push('/home')
  }
}

const handleClose = () => {
  popupCertification.value = false
}

const handleSuccess = () => {
  handleClose()

  router.push({ name: 'CheckupBasics' })
}

</script>

<template>
  <div class="AnalyzePrivacyAgree-wrap">
    <div class="AnalyzePrivacyAgree">

      <div class="space--top-default">
        <label>
          <input
            v-model="required"
            ref="refRule1"
            type="checkbox"
            name="AnalyzePrivacyAgree-check"
            class="custom input-focus" />
          <span />
          {{ $t('CheckupPrivacyAgree.text1') }}
        </label>
        <div class="txt--desc c222 AnalyzePrivacyAgree--info">
          {{ $t('CheckupPrivacyAgree.text2') }}
        </div>
        <div class="txt--desc c222 AnalyzePrivacyAgree--info2">
          {{ $t('CheckupPrivacyAgree.text3') }}
        </div>
        <div class="downUp4--wrap">
          <transition name="downUp4">
            <table v-if="toggleRule1" class="AnalyzePrivacyAgree--tb">
              <thead>
                <tr>
                  <th>{{ $t('CheckupPrivacyAgree.text4') }}</th>
                  <th>{{ $t('CheckupPrivacyAgree.text5') }}</th>
                  <th>{{ $t('CheckupPrivacyAgree.text6') }}</th>
                  <th>{{ $t('CheckupPrivacyAgree.text32') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th>{{ $t('CheckupPrivacyAgree.text7') }}</th>
                  <td class="light">{{ $t('CheckupPrivacyAgree.text8') }}</td>
                  <td class="light">{{ $t('CheckupPrivacyAgree.text9') }}</td>
                  <td class="light">{{ $t('CheckupPrivacyAgree.text33') }}</td>
                </tr>
                <tr>
                  <th>{{ $t('CheckupPrivacyAgree.text10') }}</th>
                  <td>
                    {{ $t('CheckupPrivacyAgree.text11') }}
                  </td>
                  <td>
                    {{ $t('CheckupPrivacyAgree.text12') }}
                  </td>
                  <td>
                    {{ $t('CheckupPrivacyAgree.text34') }}
                  </td>
                </tr>
                <tr v-if="isShowSelectedAgree">
                  <th>{{ $t('CheckupPrivacyAgree.text13') }}</th>
                  <td>{{ $t('CheckupPrivacyAgree.text14') }}</td>
                  <td>{{ $t('CheckupPrivacyAgree.text14') }}</td>
                  <td>{{ $t('CheckupPrivacyAgree.text14') }}</td>
                </tr>
                <tr v-else>
                  <th>{{ $t('CheckupPrivacyAgree.text13') }}</th>
                  <td>{{ $t('CheckupPrivacyAgree.text35') }}</td>
                  <td>{{ $t('CheckupPrivacyAgree.text35') }}</td>
                  <td>{{ $t('CheckupPrivacyAgree.text35') }}</td>
                </tr>
              </tbody>
            </table>
          </transition>
        </div>
        <div class="txt--center AnalyzePrivacyAgree--more">
          <button
            @click="toggleRule1 = !toggleRule1"
            type="button"
            class="btn--txt3"
            :class="toggleRule1 ? 'up' : ''">{{ $t('Common.more') }}</button>
        </div>
      </div>
      <hr />
      <div class="space--top-big" v-if="isShowSelectedAgree">
        <label>
          <input
            v-model="nonRequired"
            type="checkbox"
            name="AnalyzePrivacyAgree-check"
            class="custom" />
          <span />
          {{ $t('CheckupPrivacyAgree.text16') }}
        </label>
        <div class="txt--desc c222 AnalyzePrivacyAgree--info">
          {{ $t('CheckupPrivacyAgree.text17') }}
        </div>
        <div class="txt--desc c222 AnalyzePrivacyAgree--info2">
          {{ $t('CheckupPrivacyAgree.text18') }}
        </div>
        <div class="downUp4--wrap">
          <transition name="downUp4">
            <table v-if="toggleRule2" class="AnalyzePrivacyAgree--tb">
              <tbody>
                <tr>
                  <th>{{ $t('CheckupPrivacyAgree.text19') }}</th>
                  <td>{{ $t('CheckupPrivacyAgree.text20') }}</td>
                </tr>
                <tr>
                  <th>{{ $t('CheckupPrivacyAgree.text7') }}</th>
                  <td>
                    <ul>
                      <li>{{ $t('CheckupPrivacyAgree.text21') }}</li>
                      <li>{{ $t('CheckupPrivacyAgree.text22') }}</li>
                    </ul>
                  </td>
                </tr>
                <tr>
                  <th>{{ $t('CheckupPrivacyAgree.text10') }}</th>
                  <td>
                    <ul>
                      <li>{{ $t('CheckupPrivacyAgree.text23') }}</li>
                      <li>{{ $t('CheckupPrivacyAgree.text24') }}</li>
                      <li>{{ $t('CheckupPrivacyAgree.text25') }}</li>
                      <li>{{ $t('CheckupPrivacyAgree.text26') }}</li>
                    </ul>
                  </td>
                </tr>
                <tr>
                  <th>{{ $t('CheckupPrivacyAgree.text13') }}</th>
                  <td v-html="$t('CheckupPrivacyAgree.text27')"></td>
                </tr>
              </tbody>
            </table>
          </transition>
        </div>
        <div class="txt--center AnalyzePrivacyAgree--more">
          <button
            @click="toggleRule2 = !toggleRule2"
            type="button"
            class="btn--txt3"
            :class="toggleRule2 ? 'up' : ''">{{ $t('Common.more') }}</button>
        </div>
      </div>
    </div>

    <!--      <div class="AnalyzePrivacyAgree&#45;&#45;q">-->
    <!--        본인은 위 민감정보의 처리 위탁에 동의합니까?-->
    <!--      </div>-->
    <div class="Checkup--btn-wrap btns-2">
      <div class="btn--bottom btn--bottom-line">
        <button type="button" @click="handleProceed('N')">
          {{ $t('CheckupPrivacyAgree.text28') }}
          </button>
      </div>
      <div class="btn--bottom">
        <button @click="handleProceed('Y')" type="button">{{ $t('Common.next') }}</button>
      </div>
    </div>

    <CheckupPrivacyAgreePopup v-if="popupCertification" @success="handleSuccess" @close="handleClose" />

    <base-popup v-if="popMust" class="pop-wrap">
      <template v-slot:contents>
        <p class="pop-text-bold">{{ $t('CheckupPrivacyAgree.text30') }}</p>
        <p class="pop-text-light">{{ $t('CheckupPrivacyAgree.text31') }}</p>
        <div class="pop-btn-wrap">
          <button @click="popMustClose" class="pop-btn pop-btn--green" type="button">{{ $t('Common.confirm') }}</button>
        </div>
      </template>
    </base-popup>

  </div>
</template>
