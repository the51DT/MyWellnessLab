<script setup>
import router from '@/router'
import { ref } from 'vue'
import CheckupBasicsBasic from '@/views/publishing/checkup/CheckupBasicsBasic.vue'
import BaseStep from '@/views/publishing/checkup/BaseStep.vue'
import CheckupBasicsBody from '@/views/publishing/checkup/CheckupBasicsBody.vue'
import CheckupBasicsBlood from '@/views/publishing/checkup/CheckupBasicsBlood.vue'
import BaseCheckupDate from '@/views/publishing/checkup/BaseCheckupDate.vue'

const nextDisabled = ref(false) /* 데이터가 다 입력되기 전까지는 하단의 다음 버튼이 비활성되도록 해주세요, true: 비활성 */
</script>

<template>
  <section class="CheckupBasics">
    <BaseStep class="CheckupBasics--step" />
    <div class="Checkup--contents-wrap">
      <div class="Checkup--contents-wrapT">
        <BaseCheckupDate class="CheckupBasics--date" />

        <!--    if 직접 입력, 공단 데이터이용-->
        <CheckupBasicsBasic class="CheckupBasics--basic" />

        <!--    else 일회성-->
        <!--        <CheckupBasicsBasicOne class="CheckupBasics&#45;&#45;basic"/>-->

        <CheckupBasicsBody class="CheckupBasics--body" />
        <CheckupBasicsBlood class="CheckupBasics--blood" />

      </div>

      <div class="btn--bottom">
        <button @click="router.push('/checkup-blood')" :disabled="nextDisabled" type="button" class="">다음</button>
      </div>
    </div>
  </section>
</template>

<style lang="scss"></style>
