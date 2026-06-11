<script>
export default {
  name: "BaseToast",
  props: {
    msg: String
  },
  data(){
    return{
      toastMsg: "",
    }
  },
  watch: {
    msg(){
      if(this.msg){
        this.toastMsg = this.msg;
      } else {
        this.toastMsg = "";
      }
    },
  }
}
</script>

<template>
  <transition name="toastFade">
    <div v-if="toastMsg" class="toast">
      {{toastMsg}}
    </div>
  </transition>
</template>

<style scoped>

</style>