<script setup>
/**
 * 작은 레이어팝업 생성용 콤포넌트
 */
import { onBeforeMount, ref, computed } from 'vue'
import { MESSAGE_TYPE, MESSAGE_BUTTON_TYPE } from './types'
import { useI18n } from 'vue-i18n'  
const { t } = useI18n() 
const props = defineProps({
  type: {
    type: String,
    default: ''
  },
  message: {
    type: String,
    default: ''
  },
  doAction: {
    type: Function,
    default: null
  }
})

const instance = ref(null)

const isConfirmType = computed(() => {
  return props.type === MESSAGE_TYPE.CONFIRM
})

const handleClose = () => {
  document.body.classList.remove('no-scroll')
  document.body.removeChild(instance.value)
}
const handleAction = (type) => {
  if (props.doAction) {
    props.doAction(type)
  }

  handleClose()
}

onBeforeMount(() => {
  document.body.classList.add('no-scroll')
})

</script>

<template>
  <div ref="instance" class="message-container">
    <div class="message-box">
      <div class="message-content">
        {{props.message}}
      </div>

      <button @click="handleAction(MESSAGE_BUTTON_TYPE.OK)" class="btn btn-pop--green">{{ t('Common.confirm') }}</button>
      <button v-if="isConfirmType" @click="handleAction(MESSAGE_BUTTON_TYPE.CANCLE)" class="btn btn-pop--gray">{{ t('Common.cancle') }}</button>
    </div>
  </div>
</template>

<style lang="scss" scoped> /* 2606 스타일 내용 수정 */
.message-container {
  position: fixed;
  left: 0;
  top: 0;
  min-width: 100vw;
  min-height: 100vh;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.5);
  z-index: 9999;
}

.message-box {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  background-color: #fff;
  border-radius: 2rem;
  padding: 2.4rem 2rem 2rem;
  width: 50%;
  min-width: 32rem;
  max-width: 38.8rem;
}

.message-content {
  white-space: break-spaces;
  margin-bottom: 20px;
  font-size: 1.5rem;
  line-height: 1.5;
  @media (min-width:960px) {
    font-size: 1.8rem;
  }
}
.btn{
  height: 4rem;
  font-size: 1.5rem;
  border-radius: 9rem;
  @media (min-width:960px) {
    height: 4.8rem;
    font-size: 1.8rem;
  }
}
</style>
