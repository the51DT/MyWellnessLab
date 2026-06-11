<script setup>
/**
 * 가입 및 웰니스 분석 시 부계정이 있는 경우, 계정을 선택하는 콤포넌트
 */
const props = defineProps({
  data: Object,
  link: String
})
</script>

<template>
  <div class="align--center">
    <ul class="user--select">
      <li v-for="item in props.data" class="login--li">
        <a @click="$emit('userSelect', item)" href="javascript:void(0);" class="login--a">
          <div class="user--sex" :class="item.sex === 0 ? 'male' : 'female'" />
          <strong class="login--name">{{ item.name }}</strong>
        </a>
      </li>
    </ul>
  </div>
</template>

<style lang="scss">

</style>
