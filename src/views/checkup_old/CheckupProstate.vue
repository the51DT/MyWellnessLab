<script setup>

import BaseStep from "@/components/BaseStep.vue";
import router from "@/router";
import {nextStep, findNextPage} from "@/assets/js/common";
import { ref, inject, computed, onBeforeMount, onUnmounted, toRaw  } from 'vue';
import {useStore} from 'vuex';

const store = useStore();
const axios = inject('$axios');
const api = import.meta.env.VITE_GLOB_BASE_API_URL + "/v1/api/user/survey/prostate/temporary";
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
  prostate: {
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
  {fieldName:'ipss01', question: "소변을 다 보았는데도 소변이 남아있는 것 같이 느끼는 경우가 있습니까?"},
  {fieldName:'ipss02', question: "소변을 보고 난 후 2시간 이내에 다시 소변을 보는 경우가 있습니까?"},
  {fieldName:'ipss03', question: "소변 줄기가 끊어져서 다시 힘주어 소변을 보는 경우가 있습니까?"},
  {fieldName:'ipss04', question: "소변을 참기가 어려운 경우가 있습니까?"},
  {fieldName:'ipss05', question: "소변줄기가 약하거나  가늘다고 생각되는 경우가 있습니까?"},
  {fieldName:'ipss06', question: "소변이 금방 나오지 않아서 아랫배에 힘을 주어야 하는 경우가 있습니까?"},
  {fieldName:'ipss07', question: "잠을 자다 일어나서 소변을 보는 경우가 하룻밤에 몇 번이나 있습니까?", answer: [{label: "없다", value: 0}, {label: "1번", value: 1}, {label: "2번", value: 2}, {label: "3번", value: 3}, {label: "4번", value: 4}, {label: "5번", value: 5},]},
]);

const answer = [
{label: "전혀 없음", value: 0},
{label: "5번 중 한 번", value: 1},
{label: "5번 중 1~2번", value: 2},
{label: "5번 중 2~3번", value: 3},
{label: "5번 중 3~4번", value: 4},
{label: "거의 항상", value: 5},
];

const selectedValues = ref([]); /*선택된 값*/

const getTemporaryData = () => {
  axios.get(api + '/' + basicsId.value, {headers:header})
  .then(res => {
    if(res.data.data.prostate) {
      initTmpData(res.data.data);
    }
  }).catch(error => {

  });
};

const initTmpData = (data) => {
  isModified.value = true;
  basicsId.value = data.prostate.basicsId;
  seqId.value = data.prostate.id;

  //if(analysisType.value == 'temporary') {
    Object.assign(sendParam.value, data)
    delete sendParam.value.prostate.createdDate;
    delete sendParam.value.prostate.modifiedDate;

    let tmpData = {fieldName: '', answerValue: ''};

    for(let k in sendParam.value.prostate) {
      if(k != 'basicsId' && k != 'id') {
        selectedValues.value.push({fieldName: k, answerValue: sendParam.value.prostate[k]});
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
    sendParam.value.prostate[data.fieldName] = data.answerValue;
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
    <section class="container CheckupProstate">
      <BaseStep :step="`step3`" class="CheckupProstate--step"/>
      <div class="Checkup--contents-wrap">
        <div class="Checkup--contents-wrapT">
          <div class="CheckupProstate--info">
            <p class="CheckupProstate--p">
              <strong>전립선 건강</strong>에 관하여 지난 한 달간 소변을 볼 때, 아래 증상 정도에 답해주세요
            </p>
          </div>
          <div class="CheckupProstate--con">
            <div v-for="(item, index) in questionData" :key="index" class="CheckupProstate--div">
              <p class="CheckupProstate--q">
                {{ item.question }}
              </p>
              <div class="CheckupProstate--a-div">

                <div v-if="index === 6" v-for="(ite, idx) in item.answer" :key="idx" class="CheckupProstate--for">
                  <label :for="'cp' + index + idx" class="CheckupProstate--label" :class="selectedValues[index] && selectedValues[index].answerValue === idx ? 'active' : ''">
                    <input v-model="selectedValues[index]" :value="{fieldName:item.fieldName, answerValue:ite.value}" type="radio" :name="'cp' + index" :id="'cp' + index + idx" class="CheckupProstate--input" hidden="hidden">
                    <span v-html="ite.label" class="CheckupProstate--span"></span>
                  </label>
                </div>

                <div v-else v-for="(ite, idx2) in answer" :key="idx2" class="CheckupProstate--for">
                  <label @click="nextStep($event, '.CheckupProstate--div')" :for="'cp' + index + idx2" class="CheckupProstate--label" :class="selectedValues[index] && selectedValues[index].answerValue === idx2 ? 'active' : ''">
                    <input v-model="selectedValues[index]" :value="{fieldName:item.fieldName, answerValue:ite.value}" type="radio" :name="'cp' + index" :id="'cp' + index + idx2" class="CheckupProstate--input" hidden="hidden">
                    <span v-html="ite.label" class="CheckupProstate--span"></span>
                  </label>
                </div>

              </div>
            </div>
          </div>
        </div>
        <div class="btn--bottom CheckupProstate--btn-div">
          <button @click="tempSave" :disabled="nextDisabled" type="button" class="CheckupProstate--btn">다음 <span class="answerNum">({{ checkedData.length }}<span>/</span>{{ questionData.length }})</span></button>
        </div>
      </div>

    </section>

</template>

<style lang="scss">

</style>