<script setup>

import BaseStep from "@/components/BaseStep.vue";
import router from "@/router";
import BaseOpener from "@/views/checkup/BaseOpener.vue";
import {nextStep, findNextPage} from "@/assets/js/common";
import { ref, inject, computed, onBeforeMount, onUnmounted, toRaw  } from 'vue';
import {useStore} from 'vuex';

const store = useStore();
const axios = inject('$axios');
const api = import.meta.env.VITE_GLOB_BASE_API_URL + "/v1/api/user/survey/joint-bone/temporary";
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
  jointBone: {
    basicsId: basicsId.value,
  }
});

const checkedData = computed(() => {/* 질문을 선택한 항목 배열 */
  let checkedArr = [];
  checkedArr = checkedArr.concat(selectedValues.value.filter(val => (val !== undefined)));
  checkedArr = checkedArr.concat(selectedValues2.value.filter(val => (val !== undefined)));
  checkedArr = checkedArr.concat(selectedValues3.value.filter(val => (val !== undefined)));
  return checkedArr;
});

const nextDisabled = computed(() => {/*데이터가 다 입력되기 전까지는 하단의 다음 버튼이 비활성되도록 해주세요, true: 비활성*/
  let questionLength = (questionData.value.length + questionData2.value.length + questionData3.value.length)
  return checkedData.value.length !== questionLength ? true : false;
});

const questionData = ref([
  {fieldName: 'womac01', question: "걷기"},
  {fieldName: 'womac02', question: "계단 오르기"},
  {fieldName: 'womac03', question: "수면 시"},
  {fieldName: 'womac04', question: "앉아 있거나 혹은 누워있기"},
  {fieldName: 'womac05', question: "똑바로 서 있기"},
]);

const questionData2 = ref([
  {fieldName: 'womac06', question: "아침 경직"},
  {fieldName: 'womac07', question: "낮 동안의 경직"},
]);

const questionData3 = ref([
  {fieldName: 'womac08', question: "계단 내려오기"},
  {fieldName: 'womac09', question: "계단 올라오기"},
  {fieldName: 'womac10', question: "앉은 자세에서 일어나기"},
  {fieldName: 'womac11', question: "서기"},
  {fieldName: 'womac12', question: "무릎 굽히기"},
  {fieldName: 'womac13', question: "평지 걷기"},
  {fieldName: 'womac14', question: "자동차 타기와 내리기"},
  {fieldName: 'womac15', question: "쇼핑하기"},
  {fieldName: 'womac16', question: "양말신기"},
  {fieldName: 'womac17', question: "침대에서 일어나기"},
  {fieldName: 'womac18', question: "양말벗기"},
  {fieldName: 'womac19', question: "침대에 눕기"},
  {fieldName: 'womac20', question: "욕조에 들어가기와 나오기"},
  {fieldName: 'womac21', question: "앉기"},
  {fieldName: 'womac22', question: "화장실에 들어가기와 나오기"},
  {fieldName: 'womac23', question: "힘든 집안일"},
  {fieldName: 'womac24', question: "가벼운 집안일"},
]);

const answer = [
  {label: "불편하지 않다", value: 0},
  {label: "조금 불편하다", value: 1},
  {label: "보통이다", value: 2},
  {label: "많이 불편하다", value: 3},
  {label: "매우 많이 불편하다", value: 4},
];

const selectedValues = ref([]); /*선택된 값*/
const selectedValues2 = ref([]); /*선택된 값*/
const selectedValues3 = ref([]); /*선택된 값*/

const isOpen = ref([true, true, true]);

const open = (val) => { /*내용 열고 닫는*/
  isOpen.value[val[1]] = val[0];
};

const getTemporaryData = () => {
  axios.get(api + '/' + basicsId.value, {headers:header})
  .then(res => {
    if(res.data.data.jointBone) {
      initTmpData(res.data.data);
    }
  }).catch(error => {
    console.log(error)
  });
};

const initTmpData = (data) => {
  isModified.value = true;
  basicsId.value = data.jointBone.basicsId;
  seqId.value = data.jointBone.id;

  //if(analysisType.value == 'temporary') {        
    Object.assign(sendParam.value, data)

    delete sendParam.value.jointBone.createdDate;
    delete sendParam.value.jointBone.modifiedDate;

    let tmpData = {fieldName: '', answerValue: ''};

    for(let k in sendParam.value.jointBone) {
      if(k != 'basicsId' && k != 'id') {
        //분기필요
        switch(k){
          case 'womac01':
          case 'womac02':
          case 'womac03':
          case 'womac04':
          case 'womac05':
            selectedValues.value.push({fieldName: k, answerValue: sendParam.value.jointBone[k]});
            break;
          case 'womac06':
          case 'womac07':
            selectedValues2.value.push({fieldName: k, answerValue: sendParam.value.jointBone[k]});
            break;
          case 'womac08':
          case 'womac09':
          case 'womac10':
          case 'womac11':
          case 'womac12':
          case 'womac13':
          case 'womac14':
          case 'womac15':
          case 'womac16':
          case 'womac17':
          case 'womac18':
          case 'womac19':
          case 'womac20':
          case 'womac21':
          case 'womac22':
          case 'womac23':
          case 'womac24':
            selectedValues3.value.push({fieldName: k, answerValue: sendParam.value.jointBone[k]});
            break;              
        }
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
  console.log(toRaw(sendParam.value.jointBone));
  for(let k in selectedValues.value) {
    data = selectedValues.value[k];
    sendParam.value.jointBone[data.fieldName] = data.answerValue;
  }

  for(let k in selectedValues2.value) {
    data = selectedValues2.value[k];
    sendParam.value.jointBone[data.fieldName] = data.answerValue;
  }

  for(let k in selectedValues3.value) {
    data = selectedValues3.value[k];
    sendParam.value.jointBone[data.fieldName] = data.answerValue;
  }
  console.log(toRaw(sendParam.value.jointBone));
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
    <section class="container CheckupJointAndBone">
      <BaseStep :step="`step3`" class="CheckupJointAndBone--step"/>
      <div class="Checkup--contents-wrap">
        <div class="Checkup--contents-wrapT">
          <div class="CheckupJointAndBone--info">
            <p class="CheckupJointAndBone--p">
              <strong>관절 건강</strong>과 관련된 설문입니다
            </p>
          </div>

          <div class="CheckupJointAndBone--con">
            <div class="align--between">
              <p class="CheckupJointAndBone--p2">
                아래 활동 시 느끼는 증상
                정도에 답해주세요
              </p>
              <BaseOpener :order=0 @open="open"/>
            </div>
            <transition name="downUp">
              <div v-show="isOpen[0]" class="CheckupJointAndBone--div-wrap">
<!--                <hr class="gray2">-->
                <div v-for="(item, index) in questionData" :key="index" class="CheckupJointAndBone--div">
                  <p class="CheckupJointAndBone--q">
                    {{ item.question }}
                  </p>
                  <div class="CheckupJointAndBone--a-div">
                    <div v-for="(ite, idx) in answer" :key="idx" class="CheckupJointAndBone--for">
                      <label @click="nextStep($event, '.CheckupJointAndBone--div')" :for="'cjab' + index + idx" class="CheckupJointAndBone--label" :class="selectedValues[index] && selectedValues[index].answerValue === idx ? 'active' : ''">
                        <input v-model="selectedValues[index]" :value="{fieldName:item.fieldName, answerValue:ite.value}" type="radio" :name="'cjab' + index" :id="'cjab' + index + idx" class="CheckupJointAndBone--input" hidden="hidden">
                        <span v-html="ite.label" class="CheckupJointAndBone--span"></span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </transition>
          </div>

          <div class="CheckupJointAndBone--con">
            <div class="align--between">
              <p class="CheckupJointAndBone--p2">
                아래 시간에 경직을 느끼는
                정도를 선택해주세요
              </p>
              <BaseOpener :order=1 @open="open"/>
            </div>
            <transition name="downUp">
              <div v-show="isOpen[1]" class="CheckupJointAndBone--div-wrap">
                <div v-for="(item, index) in questionData2" :key="index" class="CheckupJointAndBone--div">
                  <p class="CheckupJointAndBone--q">
                    {{ item.question }}
                  </p>
                  <div class="CheckupJointAndBone--a-div">
                    <div v-for="(ite, idx) in answer" :key="idx" class="CheckupJointAndBone--for">
                      <label @click="nextStep($event, '.CheckupJointAndBone--div')" :for="'cjab2' + index + idx" class="CheckupJointAndBone--label" :class="selectedValues2[index] && selectedValues2[index].answerValue === idx ? 'active' : ''">
                        <input v-model="selectedValues2[index]" :value="{fieldName:item.fieldName, answerValue:ite.value}" type="radio" :name="'cjab2' + index" :id="'cjab2' + index + idx" class="CheckupJointAndBone--input" hidden="hidden">
                        <span v-html="ite.label" class="CheckupJointAndBone--span"></span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </transition>
          </div>

          <div class="CheckupJointAndBone--con">
            <div class="align--between">
              <p class="CheckupJointAndBone--p2">
                아래 활동 시 불편함을
                느끼는 정도를 선택해주세요
              </p>
              <BaseOpener :order=2 @open="open"/>
            </div>
            <transition name="downUp">
              <div v-show="isOpen[2]" class="CheckupJointAndBone--div-wrap">
                <div v-for="(item, index) in questionData3" :key="index" class="CheckupJointAndBone--div">
                  <p class="CheckupJointAndBone--q">
                    {{ item.question }}
                  </p>
                  <div class="CheckupJointAndBone--a-div">
                    <div v-for="(ite, idx) in answer" :key="idx" class="CheckupJointAndBone--for">
                      <label @click="nextStep($event, '.CheckupJointAndBone--div')" :for="'cjab3' + index + idx" class="CheckupJointAndBone--label" :class="selectedValues3[index] && selectedValues3[index].answerValue === idx ? 'active' : ''">
                        <input v-model="selectedValues3[index]" :value="{fieldName:item.fieldName, answerValue:ite.value}" type="radio" :name="'cjab3' + index" :id="'cjab3' + index + idx" class="CheckupJointAndBone--input" hidden="hidden">
                        <span v-html="ite.label" class="CheckupJointAndBone--span"></span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </transition>
          </div>
        </div>
        <div class="btn--bottom CheckupJointAndBone--btn-div">
          <button @click="tempSave" :disabled="nextDisabled" type="button" class="CheckupJointAndBone--btn">다음 <span class="answerNum">({{ checkedData.length }}<span>/</span>{{ (questionData.length + questionData2.length + questionData3.length) }})</span></button>
        </div>
      </div>
    </section>

</template>

<style lang="scss">

</style>