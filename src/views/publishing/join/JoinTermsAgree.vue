<script setup>
import { computed, ref } from 'vue'
import router from '@/router'
import BaseTerms from '@/views/publishing/BaseTerms.vue'
import BasePrivacy from '@/views/publishing/BasePrivacy.vue'

const checkboxAllEl = computed(() => checkboxTerms.value && checkboxPrivacy.value)
const checkboxTerms = ref(false)
const checkboxPrivacy = ref(false)
const btnNext = computed(() => checkboxTerms.value && checkboxPrivacy.value)
// const serviceUseTerms = ref("서비스 이용약관 내용"); 231222 약관 추가로 삭제
// const personalInfoRule = ref("개인정보 처리방침 동의"); 231222 약관 추가로 삭제

function checkAll(event) {
  if (event.target.checked) {
    checkboxTerms.value = true
    checkboxPrivacy.value = true
  } else {
    checkboxTerms.value = false
    checkboxPrivacy.value = false
  }
}

</script>

<template>
  <section class="JoinTermsAgree--wrap">
    <div class="JoinTermsAgree--in-wrap">
      <div class="JoinTermsAgree--txt">
        <span class="gray">myWellness LAB 서비스 이용을 위해</span> <br>
        약관에 동의가 필요합니다
      </div>
      <div class="JoinTermsAgree--wrap2">
        <div class="JoinTermsAgree--all-check-wrap">
          <label for="jta01" class="JoinTermsAgree--all"> <!--임의의 for값이니 수정해도 무방, 단 고칠 대는 아래 input id도 함께 고쳐야 함-->
            <span class="checkbox" :class="checkboxAllEl ? 'active' : ''">
              <input @change="checkAll" v-model="checkboxAllEl" type="checkbox" name="" id="jta01"
                class="JoinTermsAgree--all-check" hidden="hidden">
              <span></span>
            </span>
            <span class="JoinTermsAgree--all-txt">전체동의</span>
          </label>
        </div>
        <hr class="gray2 JoinTermsAgree--hr">
        <div class="JoinTermsAgree--terms-wrap">
          <div class="align--between JoinTermsAgree--terms-in-wrap">
            <label for="jta02" class="JoinTermsAgree--terms">
              <span class="checkbox" :class="checkboxTerms ? 'active' : ''">
                <input v-model="checkboxTerms" type="checkbox" name="" id="jta02" class="JoinTermsAgree--check"
                  hidden="hidden">
                <span></span>
              </span>
              <span class="JoinTermsAgree--tit">서비스 이용약관 (필수)</span>
            </label>
          </div>
          <div class="JoinTermsAgree--texts"> <!--231222 약관 추가로 변경-->
            <BaseTerms />
          </div>
        </div>
        <div class="JoinTermsAgree--privacy-wrap">
          <div class="align--between JoinTermsAgree--privacy-in-wrap">
            <label for="jta04" class="JoinTermsAgree--privacy-check-wrap">
              <span class="checkbox" :class="checkboxPrivacy ? 'active' : ''">
                <input v-model="checkboxPrivacy" type="checkbox" name="" id="jta04" class="JoinTermsAgree--privacy-check"
                  hidden="hidden">
                <span></span>
              </span>
              <span class="JoinTermsAgree--privacy-tit">개인정보 처리방침 동의 (필수)</span>
            </label>
          </div>
          <div class="JoinTermsAgree--texts"> <!--231222 방침 추가로 변경-->
            <BasePrivacy />
          </div>
        </div>
      </div>
    </div>
  </section>
  <div class="btn--bottom JoinTermsAgree--btm">
    <button @click="router.push('/join-phone-certification')" :disabled="!btnNext" type="button"
      class="JoinTermsAgree--btm-btn">다음</button>
  </div>
</template>

<style lang="scss"></style>
