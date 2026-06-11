<script setup>
import BasePopupTit from '@/components/BasePopupTit.vue'
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'

const { t } = useI18n()

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    default: 'basics' // 'blood', 'basics', 'body'
  },
})

const emit = defineEmits(['close'])

const closePopup = () => {
  emit('close')
}

// type에 따라 타이틀과 이미지를 결정
const popupTitle = computed(() => {
  switch (props.type) {
    case 'blood':
      return t('Router.checkup.text32') // 혈액 입력 가이드
    case 'basics':
      return t('Router.checkup.text33') // 검사 입력 가이드
    case 'body':
      return t('Router.checkup.text34') // 체성분 입력 가이드
  }
})

const popupImage = computed(() => {
  switch (props.type) {
    case 'blood':
      return '/img/img_guide_pop_blood.png'
    case 'basics':
      return '/img/img_guide_pop_basic.png'
    case 'body':
      return '/img/img_guide_pop_body.png'
  }
})
</script>

<template>
  <BasePopupTit v-if="isOpen" @popupClose="closePopup" class="DirectInputGuidePop">
    <template v-slot:title>
      {{ popupTitle }}
    </template>
    <template v-slot:contents>
    <div class="DirectInputGuidePop--con">
        <div class="DirectInputGuidePop--img-wrap">
        <img :src="popupImage" :alt="popupTitle">
        </div>
    </div>
    </template>
  </BasePopupTit>
</template>