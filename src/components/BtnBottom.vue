<script setup>
const props = defineProps({
  targetClass: {
    type: String,
    default: '.AnalyzePagesDetail--my-body-wrap'
  },
  show: {
    type: Boolean,
    default: true
  }
});

function goBottom(){
  const targetElement = document.querySelector(props.targetClass);
  if (targetElement) {
    targetElement.scrollIntoView({ behavior: 'smooth' });
  }
}
</script>

<template>
  <div class="btn--bottom" v-show="show">
    <button @click="goBottom" type="button" aria-label="아래로 이동"></button>
  </div>
</template>

<style scoped>
.btn--bottom {
  position: fixed;
  bottom: 4rem;
  z-index: 1;
  right: 2rem;
  padding-right: 0rem;
}

.btn--bottom button {
  border: none;
  background-color: transparent;
  background-position: center;
  background-repeat: no-repeat;
  width: 62px;
  height: 62px;
  border-radius: 62px;
  box-shadow: 0 0.3rem 0.8rem rgba(0, 0, 0, 0.2);
  background-color: white;
  transition: background-color 0.5s;
  position: relative;
}

.btn--bottom button:after {
  content: "";
  display: block;
  width: 26px;
  height: 14px;
  background: white url(/img/ico_downarrow.svg) no-repeat center;
  background-size: contain;
  position: absolute;
  top: 48%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
