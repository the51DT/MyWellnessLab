<script setup>
import BasePopupTit from '@/views/publishing/BasePopupTit.vue'
import { computed, getCurrentInstance, ref } from 'vue'
import BasePopup from '@/views/publishing/BasePopup.vue'

const prefix = ref('MyPageServiceQuitPopup') /* 231212 클래스 접두어 */
const props = defineProps({
  isQuit: {
    type: Boolean,
    default: false
  }
})
const selectData = ref([
  { txt: '서비스가 유용하지 않습니다' },
  { txt: '더 이상 서비스를 이용 할 계획이 없습니다' },
  { txt: '개인 정보가 우려됩니다' },
  { txt: '기록을 모두 삭제하고 다시 시작하고 싶습니다' },
  { txt: '서비스 이용이 불편합니다' },
  { txt: '직접 입력' }
])
const selectedValue = ref() /* 231212 선택된 값 */
const instance = getCurrentInstance()
const isReal = ref(false) /* 231212 진짜 탈퇴하겠냐는 팝업 오프너 */
const isQuitOk = ref(false) /* 231212 탈퇴 후 팝업 오프너 */

function popupClose() {
  instance.emit('popupClose')
}
function popupQuit() {
  isReal.value = true
}
function popupQuitOk() {
  isQuitOk.value = true
}

const taDisabled = computed(() => {
  if (selectedValue.value === 5) {
    return false
  } else {
    return true
  }
})
</script>

<template>
  <base-popup-tit v-if="isQuit" @popupClose="popupClose">
    <template v-slot:title>
      서비스 탈퇴
    </template>
    <template v-slot:contents>
      <div :class="prefix">
        <div>
          <h2 :class="prefix + '--tit'">마이웰니스 랩 서비스를
            <strong>탈퇴</strong>하시겠습니까?
          </h2>
          <div :class="prefix + '--desc'">
            탈퇴 시 본인 계정으로 등록된 모든 서비스 이용에 대한 기록과 정보가 삭제되어 복구할 수 없으며 리포트 재발행이 불가합니다 (탈퇴 후 30일 가입제한)
          </div>
          <label for="agree" :class="prefix + '--agree'">
            <input type="checkbox" name="" id="agree" class="custom">
            <span></span>
            <span :class="prefix + '--agree-txt'">위의 안내사항을 읽고 이에 동의합니다</span>
          </label>
        </div>
        <hr :class="prefix + '--hr gray2'">
        <div>
          <h2 :class="prefix + '--tit'">마이웰니스 랩 서비스를 탈퇴하는
            <strong>이유</strong>를 선택해주세요
          </h2>
          <div :class="prefix + '--radio-wrap'">
            <div v-for="(item, index) in selectData">
              <label :for="index" :class="prefix + '--radio'">
                <input v-model="selectedValue" :value="index" type="radio" name="select" :id="index">
                <span class="radio--icon"></span>
                <span>{{ item.txt }}</span>
              </label>
            </div>
            <div v-if="selectedValue === 5">
              <textarea name="ta" id="" cols="30" rows="3" :class="prefix + '--ta'" :disabled="taDisabled"></textarea>
            </div>
          </div>
        </div>
        <div :class="prefix + '--btn-wrap'">
          <div>
            <button type="button" :class="prefix + '--btn cancel'">취소</button>
          </div>
          <div>
            <button @click="popupQuit" type="button" :class="prefix + '--btn'">탈퇴</button>
          </div>
        </div>

        <base-popup v-if="isReal" :class="prefix + '--real'">
          <template v-slot:contents>
            <p :class="prefix + '--real-txt'">마이웰니스 랩 서비스를
              탈퇴하시겠습니까?
            </p>
            <p :class="prefix + '--real-txt2'">(탈퇴 시, 기록이 사라져 복구할 수 없습니다)</p>
            <div :class="prefix + '--real--btn-wrap'">
              <button type="button" :class="prefix + '--real--btn cancel'">취소</button>
              <button @click="popupQuitOk" @mouseup="isReal = false" type="button"
                :class="prefix + '--real--btn'">탈퇴하기</button>
            </div>
          </template>
        </base-popup>

        <base-popup v-if="isQuitOk" :class="prefix + '--real'">
          <template v-slot:contents>
            <p :class="prefix + '--real-txt2'">서비스에서 탈퇴 되었습니다
            </p>
            <p :class="prefix + '--real-txt2'">그 동안 마이웰니스 랩을
              이용 해주셔서 감사합니다
            </p>
            <div :class="prefix + '--real--btn-wrap ok'">
              <button type="button" :class="prefix + '--real--btn'">확인</button>
            </div>
          </template>
        </base-popup>

      </div>
    </template>
  </base-popup-tit>
</template>

<style scoped></style>
