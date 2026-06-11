<script setup>
import { ref } from 'vue'
import router from '@/router'
import BasePhoneInput from '@/views/publishing/BasePhoneInput.vue'
import BaseCertificationInput from '@/views/publishing/BaseCertificationInput.vue'

const phoneNumber = ref() /* 최종 폰번호 */
const tempCertificationNumber = ref(1234) /* 임시 인증번호 */
const certificationResult = ref() /* 인증 결과 값 */
const timerReady = ref(false) /* 3분 유효한지 여부 */
const BaseCertificationInputRef = ref(null) /* 인증번호 입력 컴포넌트 */
const btnNext = ref(false) /* 다음 버튼 */

function phoneInput(val) { /* 폰번호 입력되면 실시간으로 호출, val : 폰번호 */
  val ? phoneNumber.value = true : phoneNumber.value = false /* 폰 번호 입력되었으면 인증 보내기 버튼 활성화 */
  phoneNumber.value = val
}

function certificationStart() { /* 인증 시작 */
  BaseCertificationInputRef.value.timerStart()
  timerReady.value = true
}
function certificationConfirm(number) { /* 인증번호 판별 */
  if (timerReady.value) {
    if (String(number.value) === String(tempCertificationNumber.value)) {
      certificationResult.value = '휴대폰 인증에 성공하였습니다'
      BaseCertificationInputRef.value.timerStart('complete')
      btnNext.value = true
    } else {
      certificationResult.value = '휴대폰 인증에 실패하였습니다'
    }
  } else {
    certificationResult.value = "휴대폰번호 입력 후 '인증 보내기'를 눌러주세요"
  }
}
function timerEnd() {
  timerReady.value = false
  certificationResult.value = '휴대폰 인증시간이 경과되었습니다. 다시 인증해주세요'
}

</script>

<template>
  <section class="JoinPhoneCertification--wrap"> <!--231129 container 클래스 삭제-->
    <div class="JoinPhoneCertification--in-wrap">
      <div class="txt--center JoinPhoneCertification--txt">
        <span class="gray">실제 사용하는</span> <br> 휴대폰번호를 인증 해주세요
      </div>
      <div class="JoinPhoneCertification--txt2">
        ※ myWellness LAB 휴대폰번호 인증 시,<br>
        암웨이 회원프로필의 휴대폰번호는 변경되지 않습니다
      </div>

      <div class="JoinPhoneCertification--phone-wrap">
        <h2 class="JoinPhoneCertification--h2">
          <label for="jpc01" class="JoinPhoneCertification--phone-tit">휴대폰번호 입력</label>
        </h2>
        <BasePhoneInput :maxlength="11" :id="`jpc01`" @inputTxt="phoneInput" @certificationStart="certificationStart"
          :placeholder="`'-' 없이  숫자만 입력하세요`" />
        <!--        <div class="JoinPhoneCertification&#45;&#45;validation"> &lt;!&ndash;폰번호가 안 맞을 경우 벨리데이션 처리해주세요&ndash;&gt;-->
        <!--          휴대폰  번호  입력규칙에  맞지 않습니다-->
        <!--        </div>-->

      </div>

      <div class="JoinPhoneCertification--certi-wrap">
        <h2 class="JoinPhoneCertification--h2">
          <label for="jpc02" class="JoinPhoneCertification--certi-tit">인증번호 입력</label>
        </h2>
        <BaseCertificationInput :totalSeconds="180" @timerEnd="timerEnd" @certificationConfirm="certificationConfirm"
          ref="BaseCertificationInputRef" />
        <div v-if="certificationResult" class="JoinPhoneCertification--validation2" :class="btnNext ? 'ok' : ''">{{
          certificationResult }}</div> <!--231129 동적 클래스 추가-->
      </div>

    </div>

    <div class="btn--bottom ">
      <button @click="router.push('/join-pin-registration')" :disabled="!btnNext" type="button"
        >다음</button>
    </div>
  </section>
</template>

<style lang="scss"></style>
