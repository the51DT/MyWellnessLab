<script setup>
import {getCurrentInstance, ref} from "vue";
import {focusDom} from "@/assets/js/common"; /*231204 인풋 포커스 위해 신규 함수 추가*/

const props = defineProps({
  itemName: String, /*항목명*/
  pre: { /*인풋 앞 접두사*/
    type: String,
    default: ""
  },
  type: {
    default: "number"
  },
  disabled: {
    type: Boolean,
    default: true
  },
  value: { /*세팅된 값이 있는 경우 input값*/
    default: ""
  },
  placeholder: {
    default: ""
  },
  suf: { /*인풋 뒤 접미사*/
    type: String,
    default: ""
  }
})
const instance = getCurrentInstance()
const isFocused = ref(false);
const txt = ref("");
txt.value = props.value;

function inputTxt(){ /*입력받은 값*/
  instance.emit("inputTxt", txt.value);
}
function focusHandler(){
  isFocused.value = true;
}
function blurHandler(){
  isFocused.value = false;
}
</script>

<template>
  <dl class="BaseInput">
    <dt class="BaseInput--dt">
      <span>{{ props.itemName }}</span>
    </dt>
    <dd class="BaseInput--dd">
      <div class="BaseInput--dd-div" :class="{'disabled': !disabled, 'focus': isFocused}">

<!--        231204 인풋 내용을 중앙 정렬하기 위해 추가함-->
        <div class="BaseInput--pre">
          {{ props.pre }}
          <slot name="hCustom"></slot>
        </div>
        <input :disabled="!disabled" v-model="txt" @input="inputTxt" @focus="focusHandler; focusDom($event, true);" @blur="blurHandler; focusDom($event, false);" :placeholder="props.placeholder" :type="props.type" name="baseInput" class="BaseInput--input">

        <div class="BaseInput--suf">
          <span class="BaseInput--suf-in">
            {{ props.suf }}
            <slot name="custom" class="BaseInput--custom"></slot>
          </span>
        </div>
      </div>
    </dd>
  </dl>
</template>

<style scoped>

</style>