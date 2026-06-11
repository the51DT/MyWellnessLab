<script setup>
import {getCurrentInstance} from "vue";

const props = defineProps({
  data: Object,
  link: String
})

const instance = getCurrentInstance()
function go(val){
  instance.emit("userSelect", val)
}
</script>

<template>
  <div class="align--center">
    <ul class="user--select">
      <li v-for="item in props.data" class="login--li">
        <a @click="go(item)" href="javascript:void(0);" class="login--a">
          <div class="user--sex" :class="item.sex === 0 ? 'male' : 'female'"></div>
          <strong class="login--name">{{ item.name }}</strong>
        </a>
      </li>
    </ul>
  </div>
</template>

<style lang="scss">

</style>