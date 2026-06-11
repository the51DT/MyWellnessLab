<script setup>
import router from '@/router'
import { ref } from 'vue'

const nextDisabled = ref(false) /* 데이터가 다 입력되기 전까지는 하단의 다음 버튼이 비활성되도록 해주세요, true: 비활성 */
const selectDate = ref(new Date())
const attributes = ref({
  highlight: { fillMode: 'solid' }
})
const config = ref({
  type: 'string',
  masks: 'YYYY-MM-DD'
})
const mask = ref({
  L: 'YYYY-MM-DD',
  data: ['L', 'YYYY-MM-DD', 'YYYY-MM-DD']
})
</script>

<template>
  <div>
    <section class="AnalyzeCheckDateSelect"> <!--231129 클래스 삭제-->
      <div class="AnalyzeCheckDateSelect--contents"> <!--231129 클래스 삭제-->
        <div class="AnalyzeCheckDateSelect--msg">
          건강데이터의 검진일을 입력해 주세요
        </div>
        <div class="AnalyzeCheckDateSelect--cal">
          <VDatePicker
            v-model="selectDate"
            mode="date"
            :isToday="true"
            :attributes="attributes"
            :model-config="config"
            :masks="mask"
            is-required />
        </div>
      </div>
    </section>
    <div class="btn--bottom">
      <button
        @click="router.push('/checkup-basics')"
        :disabled="nextDisabled"
        type="button"
        class="">다음</button>
    </div>

  </div>
</template>

<style scoped lang="scss">
:deep(.AnalyzeCheckDateSelect .vc-container .vc-day.is-today .vc-day-content.vc-highlight-content-solid){
  background-color: initial;
  &:hover{
    color: white;
  }
}
</style>
