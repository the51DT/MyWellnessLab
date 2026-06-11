<script setup>
import {getCurrentInstance, ref, watch} from "vue";

const props = defineProps({
  maxlength: Number,
  id: String,
  type: {
    type: String,
    default: "text"
  },
  placeholder: {
    type: String,
    default: ""
  },
  focus: { /*밸리데이션 체크 후 포커스가 필요한 경우*/
    type: Boolean,
    default: false
  }
})
const inputValue = ref("");
const input = ref(null);
const instance = getCurrentInstance();

function inputEmit(){
  instance.emit("inputTxt", inputValue.value);
}

watch(
  inputValue, (newValue, oldValue) => {
    if( !/^\d*$/.test(newValue) ){
      inputValue.value = oldValue;
    }
  }
)

watch(focus, (newValue)=>{
  if(newValue){
    input.value.focus();
  }
})

</script>

<template>
  <input v-model="inputValue" @input="inputEmit" :type="props.type" :maxlength="props.maxlength" :placeholder="props.placeholder" name="" :id="props.id" ref="input">
</template>

<style scoped>

</style>