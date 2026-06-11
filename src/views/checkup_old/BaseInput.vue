<script>
import {ref, computed, watch, toRaw} from "vue";
import { focusDom } from "@/assets/js/common"; /*231204 인풋 포커스 위해 신규 함수 추가*/

export default {
  name: 'BaseInput',
  props:{
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
      default: "0"
    },
    suf: { /*인풋 뒤 접미사*/
      type: String,
      default: ""
    },
    maxlength: {
      type:Number,
      default: -1
    },
    zeroCheck: {
      type:Boolean,
      default:true,
    }
  },
  setup(props, {emit}){
    const isFocused = ref(false);
    const txt = ref(props.value);

    const regex = computed(() => {
      return (props.zeroCheck ? /^[0-9\.]{props.maxlength}$/gi : /^[0-9]{props.maxlength}$/gi)
    });
    
    //txt.value = props.value;

    function inputTxt(event){ /*입력받은 값*/
        //event.target.value = event.target.value.replace(/^0+/, ''); //LeadingZero 수정
        if(props.maxlength > 0 && props.type == 'number'){ //자릿수 정규식
          if(!regex.value.test(txt.value)) {
            txt.value = String(txt.value).substring(0, props.maxlength);
          }
        }
      emit('inputTxt', txt.value);
    }
    function focusHandler(){
      isFocused.value = true;
    }
    function blurHandler(){
      isFocused.value = false;
    }

    watch(props, (val) => {
      txt.value = val.value;
    });

    return {
      props,
      isFocused,
      txt,
      inputTxt,
      focusHandler,
      blurHandler,
      focusDom,
    }
  }
}
</script>

<template>
  <dl class="BaseInput">
    <dt class="BaseInput--dt">
      <span>{{ props.itemName }}</span>
    </dt>
    <dd class="BaseInput--dd">
      <div class="BaseInput--dd-div" :class="{'disabled': !disabled, 'focus': isFocused}">
        <div class="BaseInput--pre">
          {{ props.pre }}
          <slot name="hCustom"></slot>
        </div>
        <input :disabled="!disabled" v-model="txt" @input="inputTxt" @focus="[focusHandler, focusDom($event, true)]" @blur="[blurHandler, focusDom($event, false)]" :placeholder="props.placeholder" :type="props.type" name="baseInput" class="BaseInput--input" :maxlength="props.maxlength">
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