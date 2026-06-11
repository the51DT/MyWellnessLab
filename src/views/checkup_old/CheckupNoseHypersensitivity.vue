<script setup>

import BaseStep from "@/components/BaseStep.vue";
import router from "@/router";
import {nextStep, findNextPage} from "@/assets/js/common";
import { ref, inject, computed, onBeforeMount, onUnmounted, toRaw  } from 'vue';
import {useStore} from 'vuex';

const store = useStore();
const axios = inject('$axios');
const api = import.meta.env.VITE_GLOB_BASE_API_URL + "/v1/api/user/survey/nose-hypersensitivity/temporary";
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
  noseHypersensitivity: {
    basicsId: basicsId.value,
  }
});

const checkedData = computed(() => {/* 질문을 선택한 항목 배열 */
  return selectedValues.value.filter(val => (val !== undefined));
});

const nextDisabled = computed(() => {/*데이터가 다 입력되기 전까지는 하단의 다음 버튼이 비활성되도록 해주세요, true: 비활성*/
  return checkedData.value.length !== questionData.value.length ? true : false;
});

const questionData = ref([
  {fieldName:'nt01', question: "맑은 콧물이 자주 흐르며, 특히 아침에 심한 편인가요?"},
  {fieldName:'nt02', question: "시도때도 없이 발작적인 재채기가 자주 나오나요?"},
  {fieldName:'nt03', question: "코가 막혀 답답함을 자주 느끼시나요?"},
  {fieldName:'nt04', question: "코 안쪽이 가렵고 답답하여 자주 후비게 되나요?"},
  {fieldName:'nt05', question: "눈, 코, 목, 귀 주변이 자주 간지럽다고 느끼나요?"},
  {fieldName:'nt06', question: "눈이 자주 충혈되나요?"},
  {fieldName:'nt07', question: "눈 밑에 다크서클이 심해지며 자주 피로하다고 느끼나요?"},
  {fieldName:'nt08', question: "아침에 차가운 공기를 들이마시면 숨이 차고 기침이 나나요?"},
  {fieldName:'nt09', question: "뜨겁거나 매운 음식을 먹을 때 특히 콧물이 더 많이 흐르나요?"},
  {fieldName:'nt10', question: "잘 때 입을 벌리고 자거나, 코를 고나요?"},
]);

const answer = ref([
  {label: "아니요", value: 0},
  {label: "예", value: 1},
]);

const selectedValues = ref([]); /*선택된 값*/

const getTemporaryData = () => {
  axios.get(api + '/' + basicsId.value, {headers:header})
  .then(res => {
    if(res.data.data.noseHypersensitivity) {
      initTmpData(res.data.data);
    }
  }).catch(error => {
    console.log(error)
  });
};

const initTmpData = (data) => {
  isModified.value = true;
  basicsId.value = data.noseHypersensitivity.basicsId;
  seqId.value = data.noseHypersensitivity.id;

  //if(analysisType.value == 'temporary'){
    Object.assign(sendParam.value, data)
    delete sendParam.value.noseHypersensitivity.createdDate;
    delete sendParam.value.noseHypersensitivity.modifiedDate;

    let tmpData = {fieldName: '', answerValue: ''};

    for(let k in sendParam.value.noseHypersensitivity) {
      if(k != 'basicsId' && k != 'id') {
        selectedValues.value.push({fieldName: k, answerValue: sendParam.value.noseHypersensitivity[k]});
      }
    }
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
    sendParam.value.noseHypersensitivity[data.fieldName] = data.answerValue;
  }
}

const nextPage = () => {
  let param = findNextPage( toRaw(interestObj.value), analysisType.value, toRaw(interestParam.value) );
  router.push( param );
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
    <section class="container CheckupNoseHypersensitivity">
      <BaseStep :step="`step3`" class="CheckupNoseHypersensitivity--step"/>
      <div class="Checkup--contents-wrap">
        <div class="Checkup--contents-wrapT">
          <div class="CheckupNoseHypersensitivity--info">
            코 과민반응과 관련하여
            아래 증상에 답 해주세요
          </div>
          <div class="CheckupNoseHypersensitivity--con">
            <div v-for="(item, index) in questionData" :key="index" class="CheckupNoseHypersensitivity--div">
              <p class="CheckupNoseHypersensitivity--q">
                {{ item.question }}
              </p>
              <div class="align--between CheckupNoseHypersensitivity--a-div">
                <div v-for="(ite, idx) in answer" :key="idx" class="CheckupNoseHypersensitivity--for">
                  <label @click="nextStep($event, '.CheckupNoseHypersensitivity--div')" :for="'cm' + index + idx" class="CheckupNoseHypersensitivity--label" :class="selectedValues[index] && selectedValues[index].answerValue === idx ? 'active' : ''">
                    <input v-model="selectedValues[index]" :value="{fieldName:item.fieldName, answerValue:ite.value}" type="radio" :name="'cm' + index" :id="'cm' + index + idx" class="CheckupNoseHypersensitivity--input" hidden="hidden">
                    <span class="CheckupNoseHypersensitivity--span">{{ ite.label }}</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="btn--bottom CheckupNoseHypersensitivity--btn-div">
          <button @click="tempSave" :disabled="nextDisabled" type="button" class="CheckupNoseHypersensitivity--btn">다음 <span class="answerNum">({{ checkedData.length }}<span>/</span>{{ questionData.length }})</span></button>
        </div>
      </div>
    </section>

</template>

<style lang="scss">

</style>