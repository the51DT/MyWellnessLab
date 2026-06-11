<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

const router = useRouter()

const startCheckup = () => {
  // 가이드 페이지에서 시작하기 버튼 클릭 시 CheckupSideSelect로 이동
  router.push({ name: 'CheckupSideSelect' })
}
</script>

<template>
  <div>
    <div class="CheckupGuide">
      <p class="CheckupGuide--tit" v-html="$t('CheckupGuide.text15')">
      </p>
      <div class="CheckupGuide--con">
        <ul>
          <!-- 건강 검진 -->
          <li>
            <div class="CheckupGuide--con-icon">
              <img src="/img/ic_step1.svg" alt="건강 검진 아이콘">
            </div>
            <div class="CheckupGuide--con-text">
              <!-- <span class="CheckupGuide--con-text--step">{{ $t('CheckupGuide.text16') }}</span> -->
              <h2 class="CheckupGuide--con-text--tit">{{ $t('CheckupGuide.text17') }}
                <!-- <span>{{ $t('CheckupGuide.text18') }}</span> -->
              </h2>
              <p class="CheckupGuide--con-text--desc">{{ $t('CheckupGuide.text3') }}</p>
            </div>
          </li>
          <!-- 체성분 -->
          <li>
            <div class="CheckupGuide--con-icon">
              <img src="/img/ic_step2.png" alt="체성분 아이콘">
            </div>
            <div class="CheckupGuide--con-text">
              <!-- <span class="CheckupGuide--con-text--step">{{ $t('CheckupGuide.text19') }}</span> -->
              <h2 class="CheckupGuide--con-text--tit">{{ $t('CheckupGuide.text20') }}
                <!-- <span>{{ $t('CheckupGuide.text21') }}</span> -->
              </h2>
              <p class="CheckupGuide--con-text--desc">{{ $t('CheckupGuide.text22') }}</p>
            </div>
          </li>
          <!-- 관심 건강 설문 -->
          <!-- <li>
            <div class="CheckupGuide--con-icon">
              <img src="/img/ic_step3.svg" alt="관심 건강 설문 아이콘">
            </div>
            <div class="CheckupGuide--con-text">
              <span class="CheckupGuide--con-text--step">{{ $t('CheckupGuide.text23') }}</span>
              <h2 class="CheckupGuide--con-text--tit">{{ $t('CheckupGuide.text7') }}
                <span>{{ $t('CheckupGuide.text30') }}</span>
              </h2>
              <p class="CheckupGuide--con-text--desc">{{ $t('CheckupGuide.text25') }}</p>
            </div>
          </li> -->
          <!-- 건강 설문 -->
          <li>
            <div class="CheckupGuide--con-icon">
              <img src="/img/ic_step3.png" alt="건강 설문 아이콘">
            </div>
            <div class="CheckupGuide--con-text">
              <!-- <span class="CheckupGuide--con-text--step">{{ $t('CheckupGuide.text24') }}</span> -->
              <h2 class="CheckupGuide--con-text--tit">{{ $t('CheckupGuide.text10') }}
                <!-- <span>{{ $t('CheckupGuide.text31') }}</span> -->
              </h2>
              <p class="CheckupGuide--con-text--desc">{{ $t('CheckupGuide.text26') }}</p>
            </div>
          </li>
        </ul>
      </div>
      <div class="CheckupGuide--desc">
        <p class="CheckupGuide--desc-text">{{ $t('CheckupGuide.text32') }}</p>
        <p class="CheckupGuide--desc-text">{{ $t('CheckupGuide.text27') }}</p>
        <p class="CheckupGuide--desc-text">{{ $t('CheckupGuide.text28') }}</p>
        <p class="CheckupGuide--desc-text red" v-html="$t('CheckupGuide.text33')"></p>
      </div>
      <div class="CheckupGuide--btn">
        <button @click="startCheckup" type="button">{{ $t('CheckupGuide.text29') }}</button>
      </div>
    </div>


  </div>
</template>
