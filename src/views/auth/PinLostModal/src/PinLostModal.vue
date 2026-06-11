<script setup>
import { ref, shallowRef } from 'vue'
import { useStore } from 'vuex'
import BasePopupTit from '@/components/BasePopupTit.vue'
import PhoneCertification from './PhoneCertification.vue'
import PinReset from './PinReset.vue'
import BasePopup from '@/components/BasePopup.vue'

const store = useStore()
const user = store.getters.getUser

const emit = defineEmits(['close', 'complete'])

const componentName = ref('PhoneCertification')
const component = shallowRef(PhoneCertification)
const openPopPin = ref(false)

/**
 * 종료 버튼 클릭시
 */
const handleClose = () => {
  emit('close')
}

/**
 * 다음 버튼 클릭시
 */
const handleNext = () => {
  componentName.value = 'PinReset'
  component.value = PinReset
}

/**
 * 팝업 오픈
 */
const handleFinish = () => {
  openPopPin.value = true
}

/**
 * 팝업 종료
 */
const clickBtnBtn = () => {
  handleClose()
  emit('complete')
}

</script>

<template>
  <div>
    <base-popup-tit @popupClose="handleClose">
      <template v-slot:title>
        <template v-if="componentName === 'PhoneCertification'">
          {{ $t('PinLostModal.text1') }}
        </template>
        <template v-else>
          {{ $t('PinLostModal.text2') }}
        </template>
      </template>

      <template v-slot:contents>
        <component
          :is="component"
          :userInfo="user"
          @next="handleNext"
          @finish="handleFinish" />
      </template>
    </base-popup-tit>

    <base-popup v-if="openPopPin" class="openPopContinue">
      <template v-slot:contents>
        <p>{{ $t('PinLostModal.text3') }}</p>
        <!--      <p class="color&#45;&#45;gray space&#45;&#45;top-small">PIN 번호를 재설정 하세요.</p>-->
        <div class="txt--center">
          <button @click="clickBtnBtn" class="btn-pop--green" type="button">{{ $t('Common.confirm') }}</button>
        </div>
      </template>
    </base-popup>

  </div>
</template>
