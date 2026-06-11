<script setup>

import BaseStep from "@/components/BaseStep.vue";
import router from "@/router";
import {nextStep, findNextPage} from "@/assets/js/common";
import { ref, inject, computed, onBeforeMount, onUnmounted, toRaw  } from 'vue';
import {useStore} from 'vuex';

const store = useStore();
const axios = inject('$axios');
const api = import.meta.env.VITE_GLOB_BASE_API_URL + "/v1/api/user/survey/intestine/temporary";
const commonInfoApi = import.meta.env.VITE_GLOB_BASE_API_URL + '/v1/api/user/survey/common-info/temporary';

//TODO Start
const token = store.getters.getToken;

const header = {
  Authorization: token,
};
//TODO END

const commonInfo = ref({});
const commonInfoStep = ref(3);

const analysisType = ref(history.state.analysisType);
const interestParam = ref(history.state.interestParam); //설문 관련 파람들
const interestObj = ref(history.state.interestObj);     //관심건강분야 선택항목 

const basicsId = ref(history.state.interestParam.basicsId);
const pathIdx = ref(history.state.interestParam.pathIdx);

const isModified = ref(false);
const seqId = ref(0);
const sendParam = ref({
  intestine: {
    basicsId: basicsId.value,
  }
});

const checkedData = computed(() => {/* 질문을 선택한 항목 배열 */
  let arr = selectedValues.value.filter(val => (val !== undefined));
  if(selectedValuesLast.value != "" && Number(selectedValuesLast.value) > 0){
    arr.push(selectedValuesLast.value)
  }
  return arr;
});

const nextDisabled = computed(() => {/*데이터가 다 입력되기 전까지는 하단의 다음 버튼이 비활성되도록 해주세요, true: 비활성*/
  return ( 
    selectedValues.value.length === questionData.value.length &&
      (selectedValuesLast.value != "" && Number(selectedValuesLast.value) > 0)
    )
      ? false : true;
});

const questionData = ref([
  {fieldName:'rome01', question: "일주일에 3번 미만(0~2번) 으로 대변을 본 적이 있나요? "},
  {fieldName:'rome02', question: "단단하거나 덩어리 지는 대변을 본 적이 있나요?"},
  {fieldName:'rome03', question: "과도하게 힘을 줘야 대변이 나온 적이 있나요?"},
  {fieldName:'rome04', question: "대변을 본 후,시원하지 않고 뭔가 남아 있는느낌 (잔변감)이 있었나요? "},
  {fieldName:'rome05', question: "대변을 볼 때  대변이 잘 나가지 않고 막힌 것처럼 느낀 적이 있나요?"},
  {fieldName:'rome06', question: "원활한 배변을 위해서 부가적인 처치 (예 : 수지배변유도나 골반저의 입박 등) 가 필요했나요?"},
  {fieldName:'rome07', question: "무르거나 물 같은 대변을 본 적이 있나요?"},
]);

const answer = ref([
  {label: "아니요<br><span class='txt--desc'>전혀 아니거나 거의 드물다 (  25% 이하  )</span>", value: 0},
  {label: "예<br><span class='txt--desc'>가끔 또는 항상 그렇다 (  25% 이상  )</span>", value: 1},
]);

const selectedValues = ref([]); /*선택된 값*/

const poopData = ref([ /*똥 모양*/
    {label: "단단해서 알갱이 같다", value: "1", imgUrl: "img_ddong1.svg"},
    {label: "단단해서 알갱이 같지만 한 덩어리다", value: "2", imgUrl: "img_ddong2.svg"},
    {label: "소시지처럼 한 덩어리나 표면이 갈라졌다", value: "3", imgUrl: "img_ddong3.svg"},
    {label: "소시지처럼 한 덩어리나 매끈하고 부드럽다", value: "4", imgUrl: "img_ddong4.svg"},
    {label: "부드러운 여러 개의 덩어리이다", value: "5", imgUrl: "img_ddong5.svg"},
    {label: "무른 대변으로 변기에 흩어진다", value: "6", imgUrl: "img_ddong6.svg"},
    {label: "물과 같은 변이다", value: "7", imgUrl: "img_ddong7.svg"},
  ]);
const selectedValuesLast = ref("") /*똥 모양*/

const getTemporaryData = () => {
  axios.get(api + '/' + basicsId.value, {headers:header})
  .then(res => {
    if(res.data.data.intestine) {
      initTmpData(res.data.data);
    }
  }).catch(error => {
    console.log(error)
  });
};

const initTmpData = (data) => {
  isModified.value = true;
  basicsId.value = data.intestine.basicsId;
  seqId.value = data.intestine.id;

  //if(analysisType.value == 'temporary'){
    Object.assign(sendParam.value, data)
    delete sendParam.value.intestine.createdDate;
    delete sendParam.value.intestine.modifiedDate;

    let tmpData = {fieldName: '', answerValue: ''};

    for(let k in sendParam.value.intestine) {
      if(k != 'basicsId' && k != 'id' && k != 'rome08') {
        selectedValues.value.push({fieldName: k, answerValue: sendParam.value.intestine[k]});
      }
    }

    selectedValuesLast.value = sendParam.value.intestine['rome08'];
  //}
};

const getCommonInfo = () => {
  let url = import.meta.env.VITE_GLOB_BASE_API_URL + '/v1/api/user/analysis/proceeding/'+analysisType.value;
  axios.get(url, {headers: header})
  .then(res => {
    if(res.data != null && typeof res.data === 'object') {
      commonInfo.value = res.data.data.commonInfo;
      basicsId.value = res.data.data.basics.id;
      //analysisType.value = commonInfo.value.analysisType;

      getTemporaryData();
    }else {
      console.log('임시저장 정보 없음'); //TODO soon delete
    }
  })
  .catch(error => {
    console.log(error);
  });
}

const tempSave = () => {
  setParam();

  if(!isModified.value) {
    axios.post(api, sendParam.value, {headers: header})
    .then(res => {
      nextPage();
    })
    .catch(error => {
      console.log(error);
      alert(error.response.data.message);
    });
  }else {
    axios.put(api, sendParam.value, {headers: header})
    .then(res => {
      nextPage();
    })
    .catch(error => {
      console.log(error);
      alert(error.response.data.message);
    });
  }
};

const setParam = () => {
  let data;
  for(let k in selectedValues.value) {
    data = selectedValues.value[k];
    sendParam.value.intestine[data.fieldName] = data.answerValue;
  }
  if(Number(selectedValuesLast.value) != 0) {
    sendParam.value.intestine['rome08'] = selectedValuesLast.value;
  }
}

const nextPage = () => {
  let param = findNextPage( toRaw(interestObj.value), analysisType.value, toRaw(interestParam.value) );
  console.log(param)
  router.push( param );
};

const dataCheck = () => {
  console.log('########## dataCheck')
  console.log(toRaw(interestParam.value));
  console.log(toRaw(interestObj.value));      
  console.log(toRaw(selectedValues.value));
  console.log(toRaw(selectedValuesLast.value));
  console.log('########## dataCheck')
};

onBeforeMount(() => {
  if(history.state.forward) {//뒤로가기를 통해 들어온 경우 pathIdx 삭제
    --pathIdx.value;
  }
  getCommonInfo();
});

onUnmounted(function() {
  //scrollTo(0);
})
</script>

<template>
    <section class="container CheckupIntestine">
      <BaseStep :step="`step3`" class="CheckupIntestine--step"/>
      <div class="Checkup--contents-wrap">
        <div class="Checkup--contents-wrapT">
          <div class="CheckupIntestine--info">
            <strong>최근 3개월 동안 대변</strong>을 볼 때 <br>
            1/4 이상 아래의 증상이 있었나요?
          </div>
          <div class="CheckupIntestine--con">
            <div v-for="(item, index) in questionData" :key="index" class="CheckupIntestine--div">
              <p class="CheckupIntestine--q">
                {{ item.question }}
              </p>
              <div class="CheckupIntestine--a-div">
                <div v-for="(ite, idx) in answer" :key="idx" class="CheckupIntestine--for">
                  <label @click="nextStep($event, '.CheckupIntestine--div')" :for="'ci' + index + idx" class="CheckupIntestine--label" :class="selectedValues[index] && selectedValues[index].answerValue === idx ? 'active' : ''">
                    <input v-model="selectedValues[index]" :value="{fieldName:item.fieldName, answerValue:ite.value}" type="radio" :name="'ci' + index" :id="'ci' + index + idx" class="CheckupIntestine--input" hidden="hidden">
                    <span v-html="ite.label" class="CheckupIntestine--span"></span>
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div class="CheckupIntestine--poop">
            <p class="CheckupIntestine--poop--q">
              최근에 가장 흔한 당신의 <br>
              <strong>대변 모양</strong>을 한 가지 골라주세요
            </p>
            <div class="align--between CheckupIntestine--poop--div">
              <div v-for="(item, index) in poopData" :key="index" class="CheckupIntestine--poop--label-div">
                <label :for="'cil' + index" class="CheckupIntestine--poop--label" :class="Number(selectedValuesLast) === index + 1 ? 'active' : ''">
                  <span class="CheckupIntestine--poop--img-wrap">
                    <img :src="'/img/' + item.imgUrl" :alt="item.label" class="CheckupIntestine--poop--img">
                  </span>
                  <input v-model="selectedValuesLast" :value="item.value" type="radio" name="cil" :id="'cil' + index" hidden="hidden" class="CheckupIntestine--poop--input">
                  <span class="CheckupIntestine--poop--span">{{ item.label }}</span>
                </label>
              </div>
            </div>
          </div>
        </div>
        <div class="btn--bottom CheckupIntestine--btn-div">
          <button @click="tempSave" :disabled="nextDisabled" type="button" class="CheckupIntestine--btn">다음 <span class="answerNum">({{ checkedData.length }}<span>/</span>{{ questionData.length + 1 }})</span></button>
        </div>
      </div>
    </section>

</template>

<style lang="scss">

</style>