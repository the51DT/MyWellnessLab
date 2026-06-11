<script setup>

import BaseStep from "@/components/BaseStep.vue";
import router from "@/router";
import {nextStep, findNextPage} from "@/assets/js/common";
import { ref, inject, computed, onBeforeMount, onUnmounted, toRaw  } from 'vue';
import {useStore} from 'vuex';

const store = useStore();
const axios = inject('$axios');
const api = import.meta.env.VITE_GLOB_BASE_API_URL + "/v1/api/user/survey/immunity/temporary";
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
  immunity: {
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
  {fieldName:'it01', question: "피로가 잘 풀리지 않는다"},
  {fieldName:'it02', question: "감기에 자주 걸리고 잘 낫지 않는다"},
  {fieldName:'it03', question: "입안이 헐거나 입 주위 물집이 생긴다"},
  {fieldName:'it04', question: "눈에 염증이 자주 생긴다"},
  {fieldName:'it05', question: "스트레스가 자주 쌓인다"},
  {fieldName:'it06', question: "상처가 잘 낫지 않는다"},
  {fieldName:'it07', question: "체력이 급격히 떨어진다"},
  {fieldName:'it08', question: "인내력과 끈기가 없어진다"},
  {fieldName:'it09', question: "배탈 혹은 설사가 잦다"},
  {fieldName:'it10', question: "눈 밑에 다크서클이 자주 생긴다"},
]);

const answer = ref([
  {label: "아니요", value: 0},
  {label: "예", value: 1},
]);

const selectedValues = ref([]); /*선택된 값*/

const getTemporaryData = () => {
  axios.get(api + '/' + basicsId.value, {headers:header})
  .then(res => {
    if(res.data.data.immunity) {
      initTmpData(res.data.data);
    }
  }).catch(error => {

  });
};

const initTmpData = (data) => {
  isModified.value = true;
  basicsId.value = data.immunity.basicsId;
  seqId.value = data.immunity.id;

  //if(analysisType.value == 'temporary'){
    Object.assign(sendParam.value, data)
    delete sendParam.value.immunity.createdDate;
    delete sendParam.value.immunity.modifiedDate;

    let tmpData = {fieldName: '', answerValue: ''};

    for(let k in sendParam.value.immunity) {
      if(k != 'basicsId' && k != 'id') {
        selectedValues.value.push({fieldName: k, answerValue: sendParam.value.immunity[k]});
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
    sendParam.value.immunity[data.fieldName] = data.answerValue;
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
    <section class="container CheckupImmunity">
      <BaseStep :step="`step3`" class="CheckupImmunity--step"/>
      <div class="Checkup--contents-wrap">
        <div class="Checkup--contents-wrapT">
          <div class="CheckupImmunity--info">
            <strong>면역</strong>과 관련하여
            아래 증상에 답 해주세요
          </div>
          <div class="CheckupImmunity--con">
            <div v-for="(item, index) in questionData" :key="index" class="CheckupImmunity--div">
              <p class="CheckupImmunity--q">
                {{ item.question }}
              </p>
              <div class="align--between CheckupImmunity--a-div">
                <div v-for="(ite, idx) in answer" :key="idx" class="CheckupImmunity--for">
                  <label @click="nextStep($event, '.CheckupImmunity--div')" :for="'ci' + index + idx" class="CheckupImmunity--label" :class="selectedValues[index] && selectedValues[index].answerValue === idx ? 'active' : ''">
                    <input v-model="selectedValues[index]" :value="{fieldName:item.fieldName, answerValue:ite.value}" type="radio" :name="'ci' + index" :id="'ci' + index + idx" class="CheckupImmunity--input" hidden="hidden">
                    <span class="CheckupImmunity--span">{{ ite.label }}</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="btn--bottom CheckupImmunity--btn-div">
          <button @click="tempSave" :disabled="nextDisabled" type="button" class="CheckupImmunity--btn">다음 <span class="answerNum">({{ checkedData.length }}<span>/</span>{{ questionData.length }})</span></button>
        </div>
      </div>
    </section>

</template>

<style lang="scss">

</style>