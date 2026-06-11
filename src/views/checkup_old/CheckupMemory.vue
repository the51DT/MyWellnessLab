<script setup>

import BaseStep from "@/components/BaseStep.vue";
import router from "@/router";
import {nextStep, findNextPage} from "@/assets/js/common";
import { ref, inject, computed, onBeforeMount, onUnmounted, toRaw  } from 'vue';
import {useStore} from 'vuex';

const store = useStore();
const axios = inject('$axios');
const api = import.meta.env.VITE_GLOB_BASE_API_URL + "/v1/api/user/survey/memory/temporary";
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
  memory: {
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
  {fieldName:'smcq01', question: "자신의 기억력에 문제가 있다고 느끼나요?"},
  {fieldName:'smcq02', question: "자신의 기억력이 10년 전보다 나빠졌다고 느끼나요?"},
  {fieldName:'smcq03', question: "자신의 기억력이 같은 또래의 사람들에 비해 나쁘다고 느끼나요?"},
  {fieldName:'smcq04', question: "기억력 저하로 일상생활에  불편을 느끼나요?"},
  {fieldName:'smcq05', question: "최근에 일어난 일을 기억하는 것이 어렵나요?"},
  {fieldName:'smcq06', question: "며칠 전에 나눈 대화 내용을 기억하는 것이 어렵나요?"},
  {fieldName:'smcq07', question: "며칠 전에 한 약속을 기억하는 것이 어렵나요?"},
  {fieldName:'smcq08', question: "친한 사람의 이름을 기억하기 어렵나요?"},
  {fieldName:'smcq09', question: "물건을 둔 위치를 기억하기 어렵나요?"},
  {fieldName:'smcq10', question: "이전에 비해 물건을 자주 잃어버리나요?"},
  {fieldName:'smcq11', question: "집 근처에서 길을 잃은 적이 있나요?"},
  {fieldName:'smcq12', question: "가게에서 물건을 구매할 때 2~3가지의 구매 목록을 기억하기 어렵나요?"},
  {fieldName:'smcq13', question: "가스불이나 전등 스위치를 끄는 것을 기억하기 어렵나요?"},
  {fieldName:'smcq14', question: "일상에서 자주 사용하는 번호(차량번호 혹은 전화번호 등)나 자주 가는 장소의 위치를 기억하기 어렵나요?"},
]);

const answer = ref([
  {label: "아니요", value: 0},
  {label: "예", value: 1},
]);

const selectedValues = ref([]); /*선택된 값*/

const getTemporaryData = () => {
  axios.get(api + '/' + basicsId.value, {headers:header})
  .then(res => {
    if(res.data.data.memory) {
      initTmpData(res.data.data);
    }
  }).catch(error => {
    console.log(error)
  });
};

const initTmpData = (data) => {
  isModified.value = true;
  basicsId.value = data.memory.basicsId;
  seqId.value = data.memory.id;

  //if(analysisType.value == 'temporary'){
    Object.assign(sendParam.value, data)
    delete sendParam.value.memory.createdDate;
    delete sendParam.value.memory.modifiedDate;

    let tmpData = {fieldName: '', answerValue: ''};

    for(let k in sendParam.value.memory) {
      if(k != 'basicsId' && k != 'id') {
        selectedValues.value.push({fieldName: k, answerValue: sendParam.value.memory[k]});
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
    sendParam.value.memory[data.fieldName] = data.answerValue;
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
    <section class="container CheckupMemory">
      <BaseStep :step="`step3`" class="CheckupMemory--step"/>
      <div class="Checkup--contents-wrap">
        <div class="Checkup--contents-wrapT">
          <div class="CheckupMemory--info">
            <strong>기억력</strong>과 관련하여 아래의 증상에 답 해주세요
          </div>
          <div class="CheckupMemory--con">
            <div v-for="(item, index) in questionData" :key="index" :id="'q'+index" class="CheckupMemory--div">
              <p class="CheckupMemory--q">
                {{ item.question }}
              </p>
              <div class="align--between CheckupMemory--a-div">
                <div v-for="(ite, idx) in answer" :key="idx" class="CheckupMemory--for">
                  <label @click="nextStep($event, '.CheckupMemory--div')" :for="'CheckupMemory' + index + idx" class="CheckupMemory--label" :class="selectedValues[index] && selectedValues[index].answerValue === idx ? 'active' : ''">
                    <input v-model="selectedValues[index]" :value="{fieldName:item.fieldName, answerValue:ite.value}" type="radio" :name="'CheckupMemory' + index" :id="'CheckupMemory' + index + idx" class="CheckupMemory--input" hidden="hidden">
                    <span class="CheckupMemory--span">{{ ite.label }}</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="btn--bottom CheckupMemory--btn-div">
          <button @click="tempSave" :disabled="nextDisabled" type="button" class="CheckupMemory--btn">다음 <span class="answerNum">({{ checkedData.length }}<span>/</span>{{ questionData.length }})</span></button>
        </div>
      </div>
    </section>

</template>

<style lang="scss">

</style>