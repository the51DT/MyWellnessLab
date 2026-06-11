<script setup>
import BaseStep from '@/views/publishing/checkup/BaseStep.vue'
import BaseCheckupDate from '@/views/publishing/checkup/BaseCheckupDate.vue'
import CheckupBloodRequire from '@/views/publishing/checkup/CheckupBloodRequire.vue'
import CheckupBloodNonRequire from '@/views/publishing/checkup/CheckupBloodNonRequire.vue'
import { ref } from 'vue'
import router from '@/router'
import BasePopup from '@/views/publishing/BasePopup.vue'

const nextDisabled = ref(false) /* 데이터가 다 입력되기 전까지는 하단의 다음 버튼이 비활성되도록 해주세요, true: 비활성 */
const popup = ref(false) /* 팝업 보이고 안보이고 */

function next () {
  const val = false
  if (val) {
    popup.value = true
  } else {
    // 문제없이 다음으로 넘어가는 경우
    router.push('/checkup-interest-health')
  }
}
</script>

<template>
  <section class="container CheckupBlood">
    <BaseStep :step="`step2`" class="CheckupBlood--step" />
    <div class="Checkup--contents-wrap">
      <div class="Checkup--contents-wrapT">
        <BaseCheckupDate class="CheckupBlood--date" />
        <CheckupBloodRequire class="CheckupBlood--require" />
        <CheckupBloodNonRequire class="CheckupBlood--non-require" />
      </div>
      <div class="btn--bottom CheckupBlood--btn-div">
        <button
          @click="next"
          :disabled="nextDisabled"
          type="button"
          class="CheckupBlood--btn">다음</button>
      </div>
    </div>
    <base-popup v-if="popup" class="CheckupBlood--popup">
      <template v-slot:contents>
        <div class="CheckupBlood--pop-con">

          <!--        입력값 오류 시-->
          <p class="CheckupBlood--p">
            입력하신 ‘$$$, $$$, $$$' 은 정상범위가 아닙니다.
          </p>
          <p class="CheckupBlood--p2">
            그래도 계속 하시겠습니까?
          </p>

          <!--   or     지질대사 저밀도 콜레스테롤 미입력 안내-->
          <p class="CheckupBlood--p">
            저밀도 콜레스테롤이 입력되지 않았습니다.
          </p>
          <p class="CheckupBlood--p2">
            자동계산 하시겠습니까?
          </p>

        </div>
        <div class="CheckupBlood--pop-btn-wrap">

          <!--    if    입력값 오류 시-->
          <button @click="popup = false" type="button" class="CheckupBlood--pop-btn--cancel">다시입력</button>
          <button type="button" class="CheckupBlood--pop-btn">계속</button>

          <!--    else if   지질대사 저밀도 콜레스테롤 미입력 안내-->
          <button type="button" class="CheckupBlood--pop-btn--cancel">취소</button>
          <button type="button" class="CheckupBlood--pop-btn">확인</button>

        </div>
      </template>
    </base-popup>
  </section>
</template>

<style lang="scss"></style>
