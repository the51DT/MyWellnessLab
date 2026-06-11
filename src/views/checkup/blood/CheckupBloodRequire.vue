<script setup>
import { ref, computed } from 'vue'
import BaseInput2 from '@/components/BaseInput2.vue'
import BaseOpener from '@/components/BaseOpener.vue'

const props = defineProps({
  healthDataType: String,
  basicData: {
    basicsId: String, // 기본검사 seq
    crea: Number,
    glu: Number,
    got: Number,
    gpt: Number,
    hb: Number,
    id: String // 혈액검사 ID
  }
})

const emit = defineEmits(['update'])

const dispData = ref({ ...props.basicData })
const isOpen = ref(true) /* 내용부분 열고 닫는 오프너 */
const isDisabled = computed(() => {
  return props.healthDataType !== 'formal'
}) /* 공단연계인 경우 false */

function open (val) {
  isOpen.value = val
}

function inputHB (value) {
  /* 일반혈액검사소 */
  dispData.value.hb = value || null
  handleEmit()
}
function inputGLU (value) {
  /* 당대사 공복혈당 */
  dispData.value.glu = value || null
  handleEmit()
}
function inputCREA (value) {
  /* 일반화학검사 혈청 크레아티닌 */
  dispData.value.crea = value || null
  handleEmit()
}
function inputGOT (value) {
  /* 간기능 아스파테이크 전이효소 */
  dispData.value.got = value || null
  handleEmit()
}
function inputGPT (value) {
  /* 간기능 알라닌 전이효소 */
  dispData.value.gpt = value || null
  handleEmit()
}

function handleEmit () {
  emit('update', dispData.value)
}
</script>

<template>
  <div class="CheckupBloodRequire">
    <div class="align--between CheckupBloodRequire--tit">
      <h2 class="CheckupBloodRequire--tit-txt">{{ $t('CheckupBloodRequire.text1') }}</h2>
      <BaseOpener @open="open" />
    </div>
    <transition name="downUp">
      <div v-show="isOpen" class="CheckupBloodRequire--input-div">
        <BaseInput2
          :value="props.basicData.hb"
          class="CheckupBloodRequire--name"
          placeholder="15.1"
          :disabled="!isDisabled"
          :maxlength="5"
          :fixed="1"
          @keydown="(e) => {
            if (e.key === '-' || e.key === '+' || e.key === 'e' || e.key === 'E') {
              e.preventDefault()
            }
          }"
          @input="inputHB">
          <template v-slot:label>
            {{ $t('CheckupBloodRequire.text2') }}<br />
            (Hb/Hemoglobin)
          </template>
          <template v-slot:suffix>
            <span>g/dl</span>
          </template>
        </BaseInput2>

        <BaseInput2
          :value="props.basicData.glu"
          class="CheckupBloodRequire--age"
          placeholder="100"
          :disabled="!isDisabled"
          :maxlength="5"
          @keydown="(e) => {
            if (e.key === '-' || e.key === '+' || e.key === 'e' || e.key === 'E') {
              e.preventDefault()
            }
          }"
          @input="inputGLU">
          <template v-slot:label>
            {{ $t('CheckupBloodRequire.text4') }}<br />
            (Glucose)
          </template>
          <template v-slot:suffix>
            <span>mg/dl</span>
          </template>
        </BaseInput2>

        <BaseInput2
          :value="props.basicData.crea"
          class="CheckupBloodRequire--gender"
          placeholder="0.8"
          :disabled="!isDisabled"
          :maxlength="5"
          :fixed="2"
          @keydown="(e) => {
            if (e.key === '-' || e.key === '+' || e.key === 'e' || e.key === 'E') {
              e.preventDefault()
            }
          }"
          @input="inputCREA">
          <template v-slot:label>
            {{ $t('CheckupBloodRequire.text6') }}<br />
            (Cr/Creatinine)
          </template>
          <template v-slot:suffix>
            <span>mg/dL</span>
          </template>
        </BaseInput2>

        <BaseInput2
          :value="props.basicData.got"
          class="CheckupBloodRequire--gender"
          placeholder="20"
          :disabled="!isDisabled"
          :maxlength="5"
          @keydown="(e) => {
            if (e.key === '-' || e.key === '+' || e.key === 'e' || e.key === 'E') {
              e.preventDefault()
            }
          }"
          @input="inputGOT">
          <template v-slot:label>
            {{ $t('CheckupBloodRequire.text8') }}<br />
            (AST/SGOT)
          </template>
          <template v-slot:suffix>
            <span>IU/ℓ</span>
          </template>
        </BaseInput2>

        <BaseInput2
          :value="props.basicData.gpt"
          class="CheckupBloodRequire--gender"
          placeholder="20"
          :disabled="!isDisabled"
          :maxlength="5"
          @keydown="(e) => {
            if (e.key === '-' || e.key === '+' || e.key === 'e' || e.key === 'E') {
              e.preventDefault()
            }
          }"
          @input="inputGPT">
          <template v-slot:label>
            {{ $t('CheckupBloodRequire.text10') }}<br />
            (ALT/SGPT)
          </template>
          <template v-slot:suffix>
            <span>IU/ℓ</span>
          </template>
        </BaseInput2>
      </div>
    </transition>
  </div>
</template>

<style scoped>
@use "@/assets/css/default.scss";
</style>
