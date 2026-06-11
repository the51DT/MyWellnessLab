<script setup>

import BaseStep from "@/components/BaseStep.vue";
import router from "@/router";
import {nextStep, findNextPage} from "@/assets/js/common";
import { ref, inject, computed, onBeforeMount, onUnmounted, toRaw  } from 'vue';
import {useStore} from 'vuex';

const store = useStore();
const axios = inject('$axios');
const api = import.meta.env.VITE_GLOB_BASE_API_URL + "/v1/api/user/survey/eye/temporary";
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
  eye: {
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
  {fieldName:'esq01', question: "눈이 피로하다"},
  {fieldName:'esq02', question: "눈이 시리다, 아프다"},
  {fieldName:'esq03', question: "눈이  자극감이 든다"},
  {fieldName:'esq04', question: "눈물이 난다"},
  {fieldName:'esq05', question: "눈이 건조하다"},
  {fieldName:'esq06', question: "눈에 압박감이 있다"},
  {fieldName:'esq07', question: "눈이 뜨겁다"},
  {fieldName:'esq08', question: "흐리게 보인다 "},
  {fieldName:'esq09', question: "초점 맞추기 어렵다"},
  {fieldName:'esq10', question: "시청에 불편감이 있다"},
]);

const answer = [
  {label: "증상 없음", value: 0},
  {label: "경미", value: 1},
  {label: "중간", value: 3},
  {label: "심함", value: 5},
];

const selectedValues = ref([]); /*선택된 값*/

const getTemporaryData = () => {
  axios.get(api + '/' + basicsId.value, {headers:header})
  .then(res => {
    if(res.data.data.eye) {
      initTmpData(res.data.data);
    }
  }).catch(error => {
    console.log(error)
  });
};

const initTmpData = (data) => {
  isModified.value = true;
  basicsId.value = data.eye.basicsId;
  seqId.value = data.eye.id;

  //if(analysisType.value == 'temporary') {
    Object.assign(sendParam.value, data)
    delete sendParam.value.eye.createdDate;
    delete sendParam.value.eye.modifiedDate;

    let tmpData = {fieldName: '', answerValue: ''};

    for(let k in sendParam.value.eye) {
      if(k != 'basicsId' && k != 'id') {
        selectedValues.value.push({fieldName: k, answerValue: sendParam.value.eye[k]});
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
    sendParam.value.eye[data.fieldName] = data.answerValue;
  }
}

const nextPage = () => {
  let param = findNextPage( toRaw(interestObj.value), analysisType.value, toRaw(interestParam.value) );
  console.log(param)
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
    <section class="container CheckupEye">
      <BaseStep :step="`step3`" class="CheckupEye--step"/>
      <div class="Checkup--contents-wrap">
        <div class="Checkup--contents-wrapT">
          <div class="CheckupEye--info">
            눈 건강과 관련하여
            아래 증상의 정도를 답 해주세요
          </div>
          <div class="CheckupEye--con">
            <div v-for="(item, index) in questionData" :key="index" class="CheckupEye--div">
              <p class="CheckupEye--q">
                {{ item.question }}
              </p>
              <div class="align--between CheckupEye--a-div">
                <div v-for="(ite, idx) in answer" :key="idx" class="CheckupEye--for">
                  <label @click="nextStep($event, '.CheckupEye--div')" :for="'eye' + index + idx" class="txt--center CheckupEye--label">
                    <input v-model="selectedValues[index]" :value="{fieldName:item.fieldName, answerValue:ite.value}" type="radio" :name="'eye' + index" :id="'eye' + index + idx" class="CheckupEye--input" hidden="hidden">
                    <span class="radio--icon"></span>
                    <span class="CheckupEye--span" v-html="ite.label"></span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="btn--bottom CheckupEye--btn-div">
          <button @click="tempSave" :disabled="nextDisabled" type="button" class="CheckupEye--btn">다음 <span class="answerNum">({{ checkedData.length }}<span>/</span>{{ questionData.length }})</span></button>
        </div>
      </div>
    </section>

</template>

<style lang="scss">

</style>