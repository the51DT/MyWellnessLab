<script setup>
import {getCurrentInstance, onMounted, ref, watchEffect} from "vue";

const props = defineProps({ /*231129 핀 등록에서 포커스가 아래로 가서 추가*/
  id: {
    type: String,
    default: "",
  },
  focus: {
    type: Boolean,
    default: false,
  }
})

const pin1 = ref();
const pin2 = ref();
const pin3 = ref();
const pin4 = ref();
const input1 = ref(null); /*첫번째 input dom*/
const input2 = ref(null); /*두번째 input dom*/
const input3 = ref(null); /*세번째 input dom*/
const input4 = ref(null); /*네번째 input dom*/
const instance = getCurrentInstance()

function nextInput(tg, me, next){
  if(tg !== "p4"){
    if (me.value){ /*입력되면 다음 input으로 커서 이동*/
      next.focus()
    }
  }
  switch (tg) {
    case "p1":
      instance.emit("inputTxt", {tg: tg, val: pin1.value})
      break
    case "p2":
      instance.emit("inputTxt", {tg: tg, val: pin2.value})
      break
    case "p3":
      instance.emit("inputTxt", {tg: tg, val: pin3.value})
      break
    case "p4":
      instance.emit("inputTxt", {tg: tg, val: pin4.value})
      break
  }
}

const reset = () => { /*틀렸을 경우 입력값 날리기*/
  pin1.value = "";
  pin2.value = "";
  pin3.value = "";
  pin4.value = "";
  input1.value.focus();
}
defineExpose({reset});

watchEffect(() => {
  [pin1, pin2, pin3, pin4].forEach(pin => {
    if (!/^\d*$/.test(pin.value)) pin.value = '';
  });
})

onMounted(()=>{
  if(props.focus){ /*231129 핀 등록에서 포커스가 아래로 가서 추가*/
    input1.value.focus()
  }
})
</script>

<template>
  <div class="align--between ea4">
    <div class="pin--wrap" :class="pin1 !== '' ? 'input' : ''">
      <input v-model="pin1" @input="nextInput('p1', input1, input2)" type="password" name="lp01" :id="props.id" maxlength="1" class="txt--center pinI" :class="pin1 !== '' ? 'input' : ''" ref="input1"> <!--231129 동적 id 추가-->
    </div>
    <div class="pin--wrap" :class="pin2 !== '' ? 'input' : ''">
      <input v-model="pin2" @input="nextInput('p2', input2, input3)" type="password" name="lp02" maxlength="1" class="txt--center pinI" :class="pin2 !== '' ? 'input' : ''" ref="input2">
    </div>
    <div class="pin--wrap" :class="pin3 !== '' ? 'input' : ''">
      <input v-model="pin3" @input="nextInput('p3', input3, input4)" type="password" name="lp03" maxlength="1" class="txt--center pinI" :class="pin3 !== '' ? 'input' : ''" ref="input3">
    </div>
    <div class="pin--wrap" :class="pin4 !== '' ? 'input' : ''">
      <input v-model="pin4" @input="nextInput('p4', input4)" type="password" name="lp04" maxlength="1" class="txt--center pinI" :class="pin4 !== '' ? 'input' : ''" ref="input4">
    </div>
  </div>
</template>

<style scoped>

</style>