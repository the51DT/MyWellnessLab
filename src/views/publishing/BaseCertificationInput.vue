<script setup>
import {getCurrentInstance, onMounted, onUnmounted, ref} from "vue";

const props = defineProps({
  totalSeconds: Number,
})
let timerId = null;
const totalSeconds = ref(props.totalSeconds);
const minutes = ref(); /*분 초기값*/
const seconds = ref("00"); /*0초 초기값*/
const instance = getCurrentInstance(); /*어밋 인스턴스*/
const inputCertificationNumber = ref(""); /*입력된 인증번호*/ /*231129 "" 추가*/
const focusTg = ref(false); /*인풋 포커스 콘트롤 변수*/ /*231129 추가*/
const minStart = ref(false); /*타이머 보이고 안보이고 변수*/ /*231129 추가*/

function timerStart(val){
  minStart.value = true; /*231129 타이머 보이기 시작*/
  if ( val === "complete" ){
    clearInterval( timerId );
    timerId = null;
    totalSeconds.value = props.totalSeconds;
    return;
  }
  if( timerId ){
    return
  }
  timerId = setInterval(() => {
    if( totalSeconds.value > 0 ){
      totalSeconds.value--;
      minutes.value = Math.floor(totalSeconds.value / 60);
      seconds.value = totalSeconds.value % 60;
      if( minutes.value < 10 ){
        minutes.value = "0" + minutes.value;
      }
      if( seconds.value < 10 ){
        seconds.value = "0" + seconds.value;
      }
    } else {
      clearInterval( timerId );
      timerId = null;
      totalSeconds.value = props.totalSeconds;
      instance.emit("timerEnd");
    }
  }, 1000);
}
function certificationConfirm(){
  instance.emit("certificationConfirm", inputCertificationNumber)
}

function focusDom(val){ /*231129 인풋박스 포커스 들어오고 나가는 처리 변수*/
  focusTg.value = val;
}

onMounted(() => {
  let m = totalSeconds.value / 60;
  if( m < 10 ){
    minutes.value = "0" + m;
  } else {
    minutes.value = m;
  }
})

onUnmounted(() => {
  if( timerId ){
    clearInterval( timerId );
    timerId = null;
  }
});

defineExpose({timerStart}); /*부모가 함수를 호출할 수 있도록 제공*/
</script>

<template>
  <div class="BasePhoneInput" :class="focusTg ? 'active' : ''"> <!--231129 클래스 추가-->
    <input @focus="focusDom(true)" @blur="focusDom(false)" v-model="inputCertificationNumber" maxlength="6" type="password" name="" id="jpc02" placeholder="인증번호를 입력해주세요" class="BasePhoneInput--input"> <!--231129 focus, blur 이벤트 추가-->
    <span> <!--231129 span 추가-->
      <span v-if="minStart">{{ minutes }}:{{ seconds }}</span> <!--231129 v-if 추가-->
    </span>
    <button @click="certificationConfirm" :disabled="!inputCertificationNumber" type="button" class="BaseCertificationInput--btn">인증 확인</button> <!--231129 클래스 추가-->
  </div>
</template>

<style scoped>

</style>