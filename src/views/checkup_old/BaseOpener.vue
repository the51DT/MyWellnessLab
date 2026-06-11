<script setup>
import {getCurrentInstance, ref} from "vue";

const props = defineProps({
  order: {
    type: Number,
  }
})

const isOpen = ref(true) /*내용부분 열고 닫는 오프너*/
const instance = getCurrentInstance()

function opener(){
  isOpen.value = !isOpen.value;
  if(props.order >= 0){
    instance.emit("open", [isOpen.value, props.order]);
  }
  instance.emit("open", isOpen.value)
}
</script>

<template>
  <div class="BaseOpener--btn-div">
    <button @click="opener" type="button" class="BaseOpener--btn" :class="isOpen ? '' : 'close'" aria-label="열고닫기"></button>
  </div>
</template>

<style scoped>
@use "@/assets/css/default.scss";
</style>