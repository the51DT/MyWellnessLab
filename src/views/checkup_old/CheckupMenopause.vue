<script setup>

import BaseStep from "@/components/BaseStep.vue";
import router from "@/router";
import {nextStep, findNextPage} from "@/assets/js/common";
import { ref, inject, computed, onBeforeMount, onUnmounted, toRaw  } from 'vue';
import {useStore} from 'vuex';

const store = useStore();
const axios = inject('$axios');
const api = import.meta.env.VITE_GLOB_BASE_API_URL + "/v1/api/user/survey/menopause/temporary";
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
  menopause: {
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
  {fieldName: 'ki01', question: "얼굴이 달아오르거나 밤에 땀이 난다"},
  {fieldName: 'ki02', question: "손발이 저리거나 짜릿한 느낌이 든다"},
  {fieldName: 'ki03', question: "잠들기 어렵거나 깨어나서 다시 자기 어렵다"},
  {fieldName: 'ki04', question: "신경질을 잘 부리고 괜히 불안해진다"},
  {fieldName: 'ki05', question: "울적한 느낌이 들 때가 있다"},
  {fieldName: 'ki06', question: "현기증이 난다"},
  {fieldName: 'ki07', question: "쉽게 피로하다"},
  {fieldName: 'ki08', question: "관절 마디나 근육에 통증이 느껴진다"},
  {fieldName: 'ki09', question: "머리가 자주 아프다"},
  {fieldName: 'ki10', question: "가슴이 두근두근 거린다"},
  {fieldName: 'ki11', question: "작은 곤충이 피부에 기어가는 듯한 가려움이 있다"},
  {fieldName: 'ki12', question: "질이 건조하고 분비물이 감소된 것 같다"},
]);

const answer = [
  {label: "없음", value: 0},
  {label: "가끔", value: 1},
  {label: "자주", value: 2},
  {label: "항상", value: 3}
];

const selectedValues = ref([]); /*선택된 값*/

const getTemporaryData = () => {
  axios.get(api + '/' + basicsId.value, {headers:header})
  .then(res => {
    if(res.data.data.menopause) {
      initTmpData(res.data.data);
    }
  }).catch(error => {
    console.log(error)
  });
};

const initTmpData = (data) => {
  isModified.value = true;
  basicsId.value = data.menopause.basicsId;
  seqId.value = data.menopause.id;

  //if(analysisType.value == 'temporary') {
    Object.assign(sendParam.value, data)
    delete sendParam.value.menopause.createdDate;
    delete sendParam.value.menopause.modifiedDate;

    let tmpData = {fieldName: '', answerValue: ''};

    for(let k in sendParam.value.menopause) {
      if(k != 'basicsId' && k != 'id') {
        selectedValues.value.push({fieldName: k, answerValue: sendParam.value.menopause[k]});
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
    sendParam.value.menopause[data.fieldName] = data.answerValue;
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
    <section class="container CheckupMenopause">
      <BaseStep :step="`step3`" class="CheckupMenopause--step"/>
      <div class="Checkup--contents-wrap">
        <div class="Checkup--contents-wrapT">
          <div class="CheckupMenopause--info">
            <strong>여성 갱년기</strong> 증상과 관련하여 <br>
            아래 증상에 답 해주세요
          </div>
          <div class="CheckupMenopause--con">
            <div v-for="(item, index) in questionData" :key="index" class="CheckupMenopause--div">
              <p class="CheckupMenopause--q">
                {{ item.question }}
              </p>
              <div class="align--around CheckupMenopause--a-div">
                <div v-for="(ite, idx) in answer" :key="idx" class="CheckupMenopause--for">
                  <label @click="nextStep($event, '.CheckupMenopause--div')" :for="'Menopause' + index + idx" class="txt--center CheckupMenopause--label">
                    <input v-model="selectedValues[index]" :value="{fieldName:item.fieldName, answerValue:ite.value}" type="radio" :name="'Menopause' + index" :id="'Menopause' + index + idx" class="CheckupMenopause--input" hidden="hidden">
                    <span class="radio--icon"></span>
                    <span class="CheckupMenopause--span" v-html="ite.label"></span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="btn--bottom CheckupMenopause--btn-div">
          <button @click="tempSave" :disabled="nextDisabled" type="button" class="CheckupMenopause--btn">다음 <span class="answerNum">({{ checkedData.length }}<span>/</span>{{ questionData.length }})</span></button>
        </div>
      </div>
    </section>

</template>

<style lang="scss">

</style>