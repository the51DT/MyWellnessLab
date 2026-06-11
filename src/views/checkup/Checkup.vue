<script setup>
import router from '@/router'

function goNext (arg) {
  router.push({
    path: '/checkup-side/terms',
    state: {
      analysisType: 'normal',
      healthDataType: arg
    }
  })
}
</script>

<template>
  <div class="analyze">
    <div class="txt--center analyze--info" v-html="$t('Checkup.text1')">
    </div>
    <div class="txt--center analyze--btn-wrap">
      <a
        href="javascript:void(0);"
        @click="goNext('formal');"
        type="button"
        class="btn--big4">
        <span class="align--between btn--big4--txt">
          <span class="btn--big4--ico">
            <img src="/img/ico_nhis.svg" alt="$t('Checkup.text2')" srcset="" />
          </span>
          <span class="checkup--import">
            {{ $t('Checkup.text3') }}
            <span class="btn--big4--desc">{{ $t('Checkup.text4') }}</span>
          </span>
        </span>
      </a>
      <a
        href="javascript:void(0);"
        @click="goNext('direct');"
        type="button"
        class="btn--big4">
        <span class="align--between btn--big4--txt">
          <span class="btn--big4--ico">
            <img src="/img/ico_direct_input.svg" alt="$t('Checkup.text4')" srcset="" />
          </span>
          <span class="checkup--direct">
            {{ $t('Checkup.text4') }}
          </span>
        </span>
      </a>
    </div>
    <div class="analyze--txt">
      <ul class="bull--billiards analyze--ul">
        <li class="analyze--li" >
          <span v-html="$t('Checkup.text5')">
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss"></style>
