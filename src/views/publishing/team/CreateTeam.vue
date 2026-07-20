<script setup>
import { onMounted, ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import BasePopup from '@/components/BasePopup.vue'

 /* 퍼블 확인용 챌린지/상시 구분 받을 값 challenge/regular */
const route = useRoute()
const teamClassification = ref(route.meta.teamClassification)
const teamManage = computed(() => { /* 퍼블 확인용 팀 관리 페이지인지 */
  return route.meta.teamManage === true
})
const challengeManage = computed(() => { /* 퍼블 확인용 챌린지 팀 관리 */
  return teamClassification.value === 'challenge' && teamManage.value === true
})
const regularManage = computed(() => { /* 퍼블 확인용 상시 팀 관리 */
  return teamClassification.value === 'regular' && teamManage.value === true
})

const leftArea = ref("")
const rightArea = ref("")
const imageUrl = ref(null)

const regularStartDate = ref("") /* 상시 시작일 */
watch(regularManage, (value) => {
  regularStartDate.value = value ? '2026-09-20' : ''
}, { immediate: true })
const regularEndDate = ref("") /* 상시 종료일 */
const regularNoEndDate = ref(false) /* 상시 종료일 없음 */
const targetRate = ref("100") /* 목표 인증률 */

const bottomObserver = ref(null)
const isBottom = ref(false) /* 퍼블 확인용 하단 도착 여부 */

const teamCreatePopup = ref(false) /* 팀 만들기 완료 팝업 */
const unableNamePopup = ref(false) /* 사용 불가한 팀명 팝업 */

watch(regularNoEndDate, (value) => {
  if (value) {
    regularEndDate.value = ""
  }
})

function onFileChange(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      imageUrl.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
}

onMounted(() => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      isBottom.value = entry.isIntersecting
    },
    {
      threshold: 1
    }
  )
  if (bottomObserver.value) {
    observer.observe(bottomObserver.value)
  }
})
</script>

<template>
  <section class="create-team">
    <div class="create-team-wrap">
      <div class="profile-wrap">
        <div class="upload-wrap">
          <input type="file" id="uploadIcon" class="upload-icon" @change="onFileChange" hidden />
          <label for="uploadIcon" class="upload-label">
            <img v-if="imageUrl" class="uploaded-img" :src="imageUrl" alt="업로드된 이미지" />
            <img v-else class="ico-logo" src="/img/img_profile_upload.png" alt="파일 업로드 등록 아이콘" />
          </label>
          <div class="upload-ico">
            <img :src="imageUrl ? '/img/ico_edit.svg' : '/img/ico_plus-white.svg'">
          </div>
        </div>
      </div>
      <div class="create-team-box">
        <div class="input-area">
          <div class="form-item">
            <h5 class="title">팀명</h5>
            <div class="inputField">
              <div class="inputField--wrap">
                <input type="text" class="inputField--input" placeholder="팀명을 입력해 주세요"/>
              </div>
            </div>
          </div>

          <div class="form-item">
            <h5 class="title">팀 구분</h5>
            <div class="radio-wrap">
              <div class="inputField--input--radio--wrap">
                <input type="radio" class="inputField--input inputField--input--radio" id="teamTypeChallenge" name="teamType" value="challenge" v-model="teamClassification"/>
                <label for="teamTypeChallenge" class="inputField--input--radio--label">
                  <span>챌린지</span>
                </label>
              </div>

              <div class="inputField--input--radio--wrap">
                <input type="radio" class="inputField--input inputField--input--radio" id="teamTypeRegular" name="teamType" value="regular" v-model="teamClassification"/>
                <label for="teamTypeRegular" class="inputField--input--radio--label">
                  <span>상시</span>
                </label>
              </div>
            </div>
          </div>

          <template v-if="teamClassification === 'challenge'">
            <!-- 기간 : type1 -->
            <div class="form-item">
              <h5 class="title">전체 기간</h5>
              <p class="desc--period all">2026.01.01~2026.02.28</p>
              <h5 class="period-title">1회차 진행</h5>
              <p class="desc--period">2026.01.01~2026.01.31</p>
              <h5 class="period-title">2회차 진행</h5>
              <p class="desc--period">2026.02.01~2026.02.28</p>
            </div>

            <div class="form-item">
              <h5 class="title">
                지정 미션 챌린지
                <span>하단 미션 선택 필수</span>
              </h5>
              <p class="desc--green">혈당조절</p>
              <p class="desc--mission">1회 이상 식후 15분 가볍게 걷기</p>
            </div>

            <div class="form-item">
              <h5 class="title">성공 조건</h5>
              <p class="desc--green">80% 이상</p>
            </div>

            <div class="form-item">
              <h5 class="title">참여 가능 팀원</h5>
              <p class="desc">10~200</p>
            </div>

            <!-- ABC 수령 case -->
            <div class="form-item">
              <h5 class="title">성공 보상</h5>
              <p class="desc">$보상명 20자까지 노출 가능$</p>
            </div>

            <div class="form-item">
              <h5 class="title">바우처명</h5>
              <p class="desc">$바우처명 20자까지 노출 가능$</p>
            </div>

            <div class="form-item">
              <h5 class="title">
                보상 수령 방법
                <span v-if="!challengeManage">팀 생성 이후 변경 불가</span>
              </h5>
              <div class="radio-wrap">
                <div class="inputField--input--radio--wrap">
                  <input type="radio" class="inputField--input inputField--input--radio" id="rewardTypeTeam" name="rewardType" value="team" checked :disabled="challengeManage"/>
                  <label for="rewardTypeTeam" class="inputField--input--radio--label">
                    <span>팀장이 수령</span>
                  </label>
                </div>

                <div class="inputField--input--radio--wrap">
                  <input type="radio" class="inputField--input inputField--input--radio" id="rewardTypeMember" name="rewardType" value="member" :disabled="challengeManage"/>
                  <label for="rewardTypeMember" class="inputField--input--radio--label">
                    <span>팀원 개별 수령</span>
                  </label>
                </div>
              </div>
            </div>

            <div class="form-item">
              <h5 class="title">보상 수령처</h5>
              <div class="select-wrap">
                <select class="circle" required :disabled="challengeManage">
                  <option value="" disabled selected>선택</option>
                  <option value="1">값1</option>
                  <option value="2">값2</option>
                  <option value="3">값3</option>
                </select>
              </div>
            </div>
            <!-- //ABC 수령 case -->
          </template>

          <template v-else-if="teamClassification === 'regular'">
            <!-- 기간 : type2 -->
            <div class="form-item">
              <h5 class="title">기간</h5>
              <div class="inputField--date--wrap create-team-date">
                <input type="date" class="inputField--input inputField--date" v-model="regularStartDate" required :data-placeholder="!regularManage ? '시작일 선택' : ''" id="regularStartDate" :readonly="regularManage"/>
                <span>~</span>
                <input type="date" class="inputField--input inputField--date" v-model="regularEndDate" :class="regularNoEndDate ? 'disabled' : ''" required data-placeholder="종료일 선택" id="regularEndDate"/>
              </div>

              <div class="form-item--sub">
                <div class="inputField--input--checkbox--wrap">
                  <input type="checkbox" class="inputField--input inputField--input--checkbox" id="regularNoEndDate" name="regularNoEndDate" v-model="regularNoEndDate" />
                  <label for="regularNoEndDate" class="inputField--input--checkbox--label">
                    <span>종료일 없음</span>
                  </label>
                </div>
              </div>
            </div>

            <div class="form-item">
              <h5 class="title">목표 인증률</h5>
              <div v-if="!regularManage" class="inputField--radio--wrap">
                <ul>
                  <li>
                    <input type="radio" name="targetRate" value="70" id="radio-select01" v-model="targetRate" />
                    <label for="radio-select01">70%</label>
                  </li>
                  <li>
                    <input type="radio" name="targetRate" value="75" id="radio-select02" v-model="targetRate" />
                    <label for="radio-select02">75%</label>
                  </li>
                  <li>
                    <input type="radio" name="targetRate" value="80" id="radio-select03" v-model="targetRate" />
                    <label for="radio-select03">80%</label>
                  </li>
                  <li>
                    <input type="radio" name="targetRate" value="85" id="radio-select04" v-model="targetRate" />
                    <label for="radio-select04">85%</label>
                  </li>
                  <li>
                    <input type="radio" name="targetRate" value="90" id="radio-select05" v-model="targetRate" />
                    <label for="radio-select05">90%</label>
                  </li>
                  <li>
                    <input type="radio" name="targetRate" value="95" id="radio-select06" v-model="targetRate" />
                    <label for="radio-select06">95%</label>
                  </li>
                  <li>
                    <input type="radio" name="targetRate" value="100" id="radio-select07" v-model="targetRate" />
                    <label for="radio-select07">100%</label>
                  </li>
                </ul>
              </div>
              <p v-if="regularManage" class="desc--green">100%</p>
            </div>

            <div class="form-item">
              <h5 class="title">참여 가능 팀원</h5>
              <p class="desc">1명~99명</p>
            </div>
          </template>
        </div>
      </div>
      <div class="sticky-btn-wrap" :class="{ 'is-bottom': isBottom }">
        <button class="sticky-btn" @click="unableNamePopup = true" :disabled="challengeManage">{{ challengeManage ? '수정' : '완료'}}</button> <!-- 팝업 퍼블 확인용으로 띄우기 -->
        <!-- <button class="sticky-btn" disabled>완료</button> -->
      </div>
      <div ref="bottomObserver" class="sticky-trigger"></div>
    </div>
  </section>

  <!-- 팀 만들기 완료 팝업 -->
  <BasePopup v-if="teamCreatePopup">
    <template v-slot:contents>
      <p class="pop-text-light">팀 만들기가 완료되었습니다.</p>
      <div class="pop-btn-wrap">
        <button type="button" @click="teamCreatePopup = false" class="pop-btn pop-btn--green">확인</button>
      </div>
    </template>
  </BasePopup>

  <!-- 사용 불가한 팀명 팝업 -->
  <BasePopup v-if="unableNamePopup">
    <template v-slot:contents>
      <p class="pop-text-light">사용이 불가한 팀명 입니다.<br>다시 입력해 주세요.</p>
      <div class="pop-btn-wrap">
        <button type="button" @click="unableNamePopup = false, teamCreatePopup = true" class="pop-btn pop-btn--green">확인</button> <!-- teamCreatePopup 팝업 퍼블 확인용으로 띄우기 -->
      </div>
    </template>
  </BasePopup>
</template>

<style lang="scss" scoped>
</style>
