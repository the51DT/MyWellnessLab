<script setup>

import BaseStep from "@/components/BaseStep.vue";
import router from "@/router";
import {nextStep, findNextPage} from "@/assets/js/common";
import { ref, inject, computed, onBeforeMount, onUnmounted, toRaw  } from 'vue';
import {useStore} from 'vuex';

const store = useStore();
const axios = inject('$axios');
const api = import.meta.env.VITE_GLOB_BASE_API_URL + "/v1/api/user/survey/stomach/temporary";
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
  stomach: {
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
  {fieldName:'gis01', question: "속이 메스껍다고 느끼나요?"},
  {fieldName:'gis02', question: "권태감(나른함)을 느끼나요?"},
  {fieldName:'gis03', question: "구역질을 자주 하거나 구토를 할 때가 있나요?"},
  {fieldName:'gis04', question: "소화가 잘 되지 않고 더부룩한 포만감을 느끼나요?"},
  {fieldName:'gis05', question: "경련성 복통이 있나요?"},
  {fieldName:'gis06', question: "조금만 먹어도 배가 부르고, 속이 가득 차다고 느끼나요?"},
  {fieldName:'gis07', question: "목에 이물질이 걸린 듯한 느낌이 들며, 속쓰림 증상이 있나요?"},
  {fieldName:'gis08', question: "식욕이 부진한가요?"},
  {fieldName:'gis09', question: "흉골 바로 뒤 가슴(가슴 중앙 부위)이 타는 듯한 느낌 또는 불편감을 느끼나요?"},
  {fieldName:'gis10', question: "명치 부근에서 발생하는 상복부 통증을 느끼나요?"},
]);

const answer = [
  {label: "증상 없음", value: 0},
  {label: "가벼운", value: 1},
  {label: "중간", value: 2},
  {label: "심함", value: 3},
  {label: "매우 심함", value: 4}
];

const selectedValues = ref([]); /*선택된 값*/

const getTemporaryData = () => {
  axios.get(api + '/' + basicsId.value, {headers:header})
  .then(res => {
    if(res.data.data.stomach) {
      initTmpData(res.data.data);
    }
  }).catch(error => {
    console.log(error)
  });
};

const initTmpData = (data) => {
  isModified.value = true;
  basicsId.value = data.stomach.basicsId;
  seqId.value = data.stomach.id;

  //if(analysisType.value == 'temporary') {
    Object.assign(sendParam.value, data)
    
    delete sendParam.value.stomach.createdDate;
    delete sendParam.value.stomach.modifiedDate;

    let tmpData = {fieldName: '', answerValue: ''};

    for(let k in sendParam.value.stomach) {
      if(k != 'basicsId' && k != 'id') {
        selectedValues.value.push({fieldName: k, answerValue: sendParam.value.stomach[k]});
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
    sendParam.value.stomach[data.fieldName] = data.answerValue;
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
    <section class="container CheckupStomach">
      <BaseStep :step="`step3`" class="CheckupStomach--step"/>
      <div class="Checkup--contents-wrap">
        <div class="Checkup--contents-wrapT">
          <div class="CheckupStomach--info">
            <strong>위 건강</strong>과 관련하여 <br>
            아래 증상의 정도를 답 해주세요
          </div>
          <div class="CheckupStomach--con">
            <div v-for="(item, index) in questionData" :key="index" class="CheckupStomach--div">
              <p class="CheckupStomach--q">
                {{ item.question }}
              </p>
              <div class="align--between CheckupStomach--a-div">
                <div v-for="(ite, idx) in answer" :key="idx" class="CheckupStomach--for">
                  <label @click="nextStep($event, '.CheckupStomach--div')" :for="'stomach' + index + idx" class="txt--center CheckupStomach--label">
                    <input v-model="selectedValues[index]" :value="{fieldName:item.fieldName, answerValue:ite.value}" type="radio" :name="'stomach' + index" :id="'stomach' + index + idx" class="CheckupStomach--input" hidden="hidden">
                    <span class="radio--icon"></span>
                    <span class="CheckupStomach--span" v-html="ite.label"></span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="btn--bottom topMargin CheckupStomach--btn-div">
          <button @click="tempSave" :disabled="nextDisabled" type="button" class="CheckupStomach--btn">다음 <span class="answerNum">({{ checkedData.length }}<span>/</span>{{ questionData.length }})</span></button>
        </div>
      </div>
    </section>

</template>

<style lang="scss">

</style>