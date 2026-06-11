
<script setup>
import { HEALTH_DANGER_FACTOR_DESC } from "@/utils/textCollection.js";
import { randomRange,  } from "@/utils/common.js";
import { onMounted, ref, computed, watch } from "vue";
import { useI18n } from 'vue-i18n';

const { t } = useI18n()

const emit = defineEmits(['animationEnd'])
const props = defineProps({
  datas: Object,
  animationDirection: {
    type: String,
    default: 'inward', // 'outward': 중앙에서 바깥으로, 'inward': 가장자리에서 중앙으로
    validator: (value) => ['outward', 'inward'].includes(value)
  }
})
const list1 = ref(null)
const list2 = ref(null)
const list3 = ref(null)
const elementData = ref([]);
const animationTime = ref(0);

// setData 함수를 먼저 정의
const setData = async () => {
  // elementData 초기화
  elementData.value = []
  
  const result = { ...props.datas };
  
  for (let i in HEALTH_DANGER_FACTOR_DESC) {
    var obj = {};
    
    // name을 i18n 처리
    const factorCode = HEALTH_DANGER_FACTOR_DESC[i]['code'];
    const nameKey = `HealthDangerFactor.${factorCode}`;
    const translatedName = t(nameKey);
    
    // 번역이 키와 동일하면 (번역이 없는 경우) 원본 사용
    obj['name'] = translatedName === nameKey ? HEALTH_DANGER_FACTOR_DESC[i]['name'] : translatedName;
    
    // 안전장치: result에 해당 코드가 없거나 status가 없는 경우 기본값 사용
    const factorData = result[factorCode];
    
    obj['status'] = factorData && factorData.status ? factorData.status : 1; // 기본값: 정상
    
    // description은 성별에 따라 다르게 설정 (기본적으로 남성 설명 사용)
    obj['description'] = HEALTH_DANGER_FACTOR_DESC[i]['description_male'] || HEALTH_DANGER_FACTOR_DESC[i]['description_female'] || [];
    
    elementData.value.push(obj);
  }
};

// props.datas가 변경될 때마다 setData 실행
watch(() => props.datas, async (newDatas) => {
  if (newDatas && Object.keys(newDatas).length > 0) {
    await setData()
  }
}, { immediate: true })

onMounted(() => {
  startAnimation()
})
const startAnimation = () => {
  // AnalyzeHealthLightDetail의 구조에 맞게 수정
  const chartContainer = document.querySelector('.AnalyzeCheckupDataRecord--map')
  if (!chartContainer) {
    console.warn('차트 컨테이너를 찾을 수 없습니다.')
    return
  }
  
  // 컨테이너의 실제 크기를 정확하게 계산
  const containerRect = chartContainer.getBoundingClientRect();
  var centerX = containerRect.width / 2;
  var centerY = containerRect.height / 2;

  let offsetX = 0;
  if (window.innerWidth >= 1280) {
    offsetX = -(window.innerWidth - 1280) / 2;
  }
  
  const rate = 5;
  
  let count = 0;

  let listCount = 0;
  if (list1.value)
    for (let i = 0; i < list1.value.children.length; i++) {
      if (list1.value.children[i].classList.contains("none")) continue;
      listCount++;
    }
  if (list2.value)
    for (let i = 0; i < list2.value.children.length; i++) {
      if (list2.value.children[i].classList.contains("none")) continue;
      listCount++;
    }
  if (list3.value)
    for (let i = 0; i < list3.value.children.length; i++) {
      if (list3.value.children[i].classList.contains("none")) continue;
      listCount++;
    }

  var targetTime = 2 / listCount;

  if (props.animationDirection === 'inward') {
    // 사방에서 날아와서 중앙에서 사라지는 애니메이션
    const setInitialPositions = () => {
      if (list1.value) {
        for (let i = 0; i < list1.value.children.length; i++) {
          if (list1.value.children[i].classList.contains("none")) continue;
          
          // 랜덤한 화면 밖 위치 계산 (더 멀리)
          const side = Math.floor(Math.random() * 4); // 0: 상, 1: 우, 2: 하, 3: 좌
          let randX, randY;
          
          switch(side) {
            case 0: // 상단 (화면 위쪽 가장자리)
              randX = randomRange(-centerX, centerX);
              randY = -centerY; // 화면 위쪽 가장자리
              break;
            case 1: // 우측 (화면 오른쪽 가장자리)
              randX = centerX; // 화면 오른쪽 가장자리
              randY = randomRange(-centerY, centerY);
              break;
            case 2: // 하단 (화면 아래쪽 가장자리)
              randX = randomRange(-centerX, centerX);
              randY = centerY; // 화면 아래쪽 가장자리
              break;
            case 3: // 좌측 (화면 왼쪽 가장자리)
              randX = -centerX; // 화면 왼쪽 가장자리
              randY = randomRange(-centerY, centerY);
              break;
          }
          
          // 초기 위치 설정 (화면 밖)
          list1.value.children[i].style = 
            "width: 80px !important; height: 80px !important; " +
            "transform: translate(" + (randX + offsetX) + "px, " + randY + "px) scale(1); " +
            "opacity: 1; " +
            "transition: none;"; // 초기 설정 시에는 transition 없음
        }
      }
      
      if (list2.value) {
        for (let i = 0; i < list2.value.children.length; i++) {
          if (list2.value.children[i].classList.contains("none")) continue;
          
          const side = Math.floor(Math.random() * 4);
          let randX, randY;
          
          switch(side) {
            case 0:
              randX = randomRange(-centerX, centerX);
              randY = -centerY;
              break;
            case 1:
              randX = centerX;
              randY = randomRange(-centerY, centerY);
              break;
            case 2:
              randX = randomRange(-centerX, centerX);
              randY = centerY;
              break;
            case 3:
              randX = -centerX;
              randY = randomRange(-centerY, centerY);
              break;
          }
          
          list2.value.children[i].style = 
            "width: 80px !important; height: 80px !important; " +
            "transform: translate(" + (randX + offsetX) + "px, " + randY + "px) scale(1); " +
            "opacity: 1; " +
            "transition: none;";
        }
      }
      
      if (list3.value) {
        for (let i = 0; i < list3.value.children.length; i++) {
          if (list3.value.children[i].classList.contains("none")) continue;
          
          const side = Math.floor(Math.random() * 4);
          let randX, randY;
          
          switch(side) {
            case 0:
              randX = randomRange(-centerX, centerX);
              randY = -centerY;
              break;
            case 1:
              randX = centerX;
              randY = randomRange(-centerY, centerY);
              break;
            case 2:
              randX = randomRange(-centerX, centerX);
              randY = centerY;
              break;
            case 3:
              randX = -centerX;
              randY = randomRange(-centerY, centerY);
              break;
          }
          
          list3.value.children[i].style = 
            "width: 80px !important; height: 80px !important; " +
            "transform: translate(" + (randX + offsetX) + "px, " + randY + "px) scale(1); " +
            "opacity: 1; " +
            "transition: none;";
        }
      }
    };

    // 초기 위치 설정 (화면 밖)
    setInitialPositions();
    
    // 약간의 지연 후 애니메이션 시작
    setTimeout(() => {
      if (list1.value) {
        for (let i = 0; i < list1.value.children.length; i++) {
          if (list1.value.children[i].classList.contains("none")) continue;

          // 중앙으로 이동한 후 사라지는 애니메이션
          list1.value.children[i].style =
            "width: 80px !important; height: 80px !important; " +
            "transition: all " +
            (1 + targetTime * count) +
            "s cubic-bezier(0.6, -0.28, 0.735, 0.045); " +
            "transform: translate(0, 0) scale(0); " +
            "opacity: 0;";
          count++;
        }
      }
      
      if (list2.value) {
        for (let i = 0; i < list2.value.children.length; i++) {
          if (list2.value.children[i].classList.contains("none")) continue;

          list2.value.children[i].style =
            "width: 80px !important; height: 80px !important; " +
            "transition: all " +
            (1 + targetTime * count) +
            "s cubic-bezier(0.6, -0.28, 0.735, 0.045); " +
            "transform: translate(0, 0) scale(0); " +
            "opacity: 0;";
          count++;
        }
      }
      
      if (list3.value) {
        for (let i = 0; i < list3.value.children.length; i++) {
          if (list3.value.children[i].classList.contains("none")) continue;

          list3.value.children[i].style =
            "width: 80px !important; height: 80px !important; " +
            "transition: all " +
            (1 + targetTime * count) +
            "s cubic-bezier(0.6, -0.28, 0.735, 0.045); " +
            "transform: translate(0, 0) scale(0); " +
            "opacity: 0;";
          count++;
        }
      }
    }, 50); // 50ms 지연 후 애니메이션 시작

  } else {
    // 원래 로직: 중앙에서 바깥으로 나가는 애니메이션
    if (list1.value) {
      for (let i = 0; i < list1.value.children.length; i++) {
        if (list1.value.children[i].classList.contains("none")) continue;

        var randX = randomRange(-centerX / 2, centerX / 2);
        var randY = randomRange(-centerY / 2, centerY / 2);

        var posX =
          list1.value.children[i].getBoundingClientRect().left -
          centerX +
          randX +
          offsetX;
        var posY =
          list1.value.children[i].getBoundingClientRect().top -
          centerY +
          randY;

        list1.value.children[i].style =
          "width: 80px !important; height: 80px !important; " +
          "transition: all " +
          (1 + targetTime * count++) +
          "s cubic-bezier(0.6, -0.28, 0.735, 0.045);transform:translate(" +
          -posX * rate +
          "px," +
          -posY * rate +
          "px) scale(0)";
      }
    }
    
    if (list2.value) {
      for (let i = 0; i < list2.value.children.length; i++) {
        if (list2.value.children[i].classList.contains("none")) continue;

        var randX = randomRange(-centerX / 2, centerX / 2);
        var randY = randomRange(-centerY / 2, centerY / 2);

        var posX =
          list2.value.children[i].getBoundingClientRect().left -
          centerX +
          randX +
          offsetX;
        var posY =
          list2.value.children[i].getBoundingClientRect().top -
          centerY +
          randY;

        list2.value.children[i].style =
          "width: 80px !important; height: 80px !important; " +
          "transition: all " +
          (1 + targetTime * count++) +
          "s cubic-bezier(0.6, -0.28, 0.735, 0.045);transform:translate(" +
          -posX * rate +
          "px," +
          -posY * rate +
          "px) scale(0)";
      }
    }
    
    if (list3.value) {
      for (let i = 0; i < list3.value.children.length; i++) {
        if (list3.value.children[i].classList.contains("none")) continue;

        var randX = randomRange(-centerX / 2, centerX / 2);
        var randY = randomRange(-centerY / 2, centerY / 2);

        var posX =
          list3.value.children[i].getBoundingClientRect().left -
          centerX +
          randX +
          offsetX;
        var posY =
          list3.value.children[i].getBoundingClientRect().top -
          centerY +
          randY;

        list3.value.children[i].style =
          "width: 80px !important; height: 80px !important; " +
          "transition: all " +
          (1 + targetTime * count++) +
          "s cubic-bezier(0.6, -0.28, 0.735, 0.045);transform:translate(" +
          -posX * rate +
          "px," +
          -posY * rate +
          "px) scale(0)";
      }
    }
  }
  
  animationTime.value = 1 + targetTime * count; 
  
  // animationTime End send to parent
  setTimeout(() => {
    emit('animationEnd')
  }, animationTime.value * 1000);
}
const count = computed(() => {
  var obj = { warn: 0, danger: 0, normal: 0 };
  for (let i in  elementData.value) {
    if ( elementData.value[i]['status'] === 2) {
      obj.warn++;
    } else if (elementData.value[i]['status'] === 3) {
      obj.danger++;
    } else if (elementData.value[i]['status'] === 1) {
      obj.normal++;
    }
  }

  return obj;

})
</script>

<template>
    <div class="content" id="HealthNetworkAnimation" >
      <div class="content-child">
          <div class="check-list" v-if="count.normal > 0">
            <ul ref="list1">
              <li
                v-for="(item, i) in elementData"
                :key="i"
                :class="{
                  warn: item.status === 2,
                  danger: item.status === 3,
                  none: item.status !== 1,
                }"
              >
              
                <span>{{ item.name }}</span>
              </li>
             
            </ul>
          </div>
          <div class="check-list" v-if="count.warn > 0">
            <ul ref="list2">
              <li
                v-for="(item, i) in elementData"
                :key="i"
                :class="{
                  warn: item.status === 2,
                  danger: item.status === 3,
                  none: item.status !== 2,
                }"
              >
                <span>{{ item.name }}</span>
              </li>
            </ul>
          </div>
          <div class="check-list" v-if="count.danger > 0">
            <ul ref="list3">
              <li
                v-for="(item, i) in elementData"
                :key="i"
                :class="{
                  warn: item.status === 2,
                  danger: item.status === 3,
                  none: item.status !== 3,
                }"
              >
                <span>{{ item.name }}</span>
              </li>
            </ul>
          </div>
      </div>
    </div>
</template>

<style lang="scss" scoped>
.content {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
  pointer-events: none; // 클릭 이벤트를 차단하지 않도록
  overflow: hidden; // 추가: 넘치는 콘텐츠 숨김
}

.content-child {
  position: relative;
  width: 100%;
  height: 100%;
}

.check-list {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.check-list ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

/* 중복된 .check-list li 스타일 제거 - #HealthNetworkAnimation 안에 통합됨 */
#HealthNetworkAnimation {
  width: 100%;
  padding: 0;
  position: absolute;
  left: 0;
  right: 0;

  .check-list {
    > ul {
      /* @include flex(flex-start);
      gap: 15px 0px;
      justify-content: space-between;
      flex-wrap: wrap; */
      justify-content: center;
      align-content: center;

      display: grid;
      /* grid-template-columns: repeat(auto-fit, minmax(82px, 1fr)); */
      grid-template-columns: repeat(auto-fit, 80px);  // 100px에서 80px로 조정
      /* grid-auto-rows: 20px; */
      grid-gap: calcRem(25); /* 위아래 간격을 15에서 25로 증가 */
      /* max-width: 286px; */
      width: 100%;
      margin: 0 auto;
      li {
        cursor: pointer;
        align-self: center;
        justify-self: center;
        order: 3;
        width: calcRem(80) !important;     // 100에서 80으로 줄임
        height: calcRem(80) !important;    // 100에서 80으로 줄임
        background: url("/img/status-normal.png") center center
          no-repeat;
        background-size: contain;  // cover에서 contain으로 변경
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        border: none;  // 보더 제거
        border-radius: 4px;
        padding: 8px 12px;
        font-size: 10px;
        white-space: nowrap;
        pointer-events: none;
        transition: all 0.3s ease;

        span {
          text-align: center;
          font-size: calcRem(10);  // 12에서 10으로 줄임
          word-break: keep-all;
        }
        &.warn {
          order: 2;
          background: url("/img/status-warn.png") center center
            no-repeat;
          background-size: contain;  // cover에서 contain으로 변경
          border-color: #FDC840;
          /* background-color: rgba(253, 200, 64, 0.1); */
          h5 {
            color: #ffab4d !important;
          }
        }
        &.danger {
          order: 1;
          background: url("/img/status-danger.png") center center
            no-repeat;
          background-size: contain;  // cover에서 contain으로 변경
          border-color: #C2373F;
          /* background-color: rgba(194, 55, 63, 0.1); */
          h5 {
            color: #eb7291 !important;
          }
        }
      }
    }
  }
  .none {
    display: none !important;
  }

  .gap {
    flex: 1;
  }
  @keyframes center {
    0% {
      /* transform: scale(1); */

      opacity: 1;
    }

    50% {
      opacity: 1;
      /* transform: scale(1); */
    }
    65% {
      /* transform: scale(1.15); */
    }
    100% {
      opacity: 1;

      /* transform: scale(0); */
    }
  }
}

</style>