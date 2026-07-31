<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

/* 퍼블 확인용 데이터 없을 때 받을 값 */
const route = useRoute()
const noHistory = computed(() => {
  return route.meta.noHistory === true
})

const open = (e) => {
  const detail = e.currentTarget.closest('.MyPageCouponHistory--detail')
  const status = detail.querySelector('.MyPageCouponHistory--status')

  if (!detail || !status) return

  detail.classList.toggle('active')
}
</script>

<template>
  <section class="MyPageCouponHistory">
    <div v-if="noHistory" class="AnalyzeList--no-data"> <!-- v-if 퍼블 확인용 -->
      <span>분석권 사용 이력이 없습니다</span>
    </div>

    <div v-else class="MyPageCouponHistory--list">
      <div class="MyPageCouponHistory--card">
        <div class="MyPageCouponHistory--type">구매</div>
        <div class="MyPageCouponHistory--tit">마이웰니스 랩 건강 분석권</div>
        <div class="MyPageCouponHistory--info">
          <span>사용 가능 수량</span>
          <strong>2개</strong>
          <span>사용기한</span>
          <strong>~2026.09.12</strong>
        </div>
        <div class="MyPageCouponHistory--detail">
          <div @click="open" class="MyPageCouponHistory--trigger">
            <span>상세 내역 보기</span>
            <div class="MyPageCouponHistory--btn-wrap">
              <button type="button" aria-label="펼치기/닫기"></button>
            </div>
          </div>
          <transition name="downUp2">
            <div class="MyPageCouponHistory--status">
              <div>
                <p>사용 완료</p>
                <div class="MyPageCouponHistory--table">
                  <table>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>대상자</th>
                        <th>구매일</th>
                        <th>사용일</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>1</td>
                        <td>본인</td>
                        <td>26.04.15</td>
                        <td>26.05.20</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div>
                <p>양도 완료</p>
                <div class="MyPageCouponHistory--table">
                  <table>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>대상자</th>
                        <th>구매일</th>
                        <th>사용일</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>1</td>
                        <td>임아영</td>
                        <td>26.04.15</td>
                        <td>26.05.20</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div>
                <p>사용 가능</p>
                <div class="MyPageCouponHistory--table">
                  <table>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>구매일</th>
                        <th>사용기한</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>1</td>
                        <td>26.07.15</td>
                        <td>26.09.20</td>
                      </tr>
                      <tr>
                        <td>2</td>
                        <td>26.07.15</td>
                        <td>26.09.20</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </transition>
        </div>
      </div>

      <div class="MyPageCouponHistory--card">
        <div class="MyPageCouponHistory--type">양수</div>
        <div class="MyPageCouponHistory--tit">마이웰니스 랩 건강 분석권</div>
        <div class="MyPageCouponHistory--info">
          <span>사용 가능 수량</span>
          <strong>2개</strong>
          <span>사용기한</span>
          <strong>~2026.09.12</strong>
        </div>
        <div class="MyPageCouponHistory--detail">
          <div @click="open" class="MyPageCouponHistory--trigger">
            <span>상세 내역 보기</span>
            <div class="MyPageCouponHistory--btn-wrap">
              <button type="button" aria-label="펼치기/닫기"></button>
            </div>
          </div>
          <transition name="downUp2">
            <div class="MyPageCouponHistory--status">
              <div>
                <p>사용 완료</p>
                <div class="MyPageCouponHistory--table">
                  <table>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>양도자</th>
                        <th>구매일</th>
                        <th>사용일</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>1</td>
                        <td>임아영</td>
                        <td>26.04.15</td>
                        <td>26.05.20</td>
                      </tr>
                      <tr>
                        <td>2</td>
                        <td>오종현</td>
                        <td>26.04.15</td>
                        <td>26.05.20</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div>
                <p>사용 가능</p>
                <div class="MyPageCouponHistory--table">
                  <table>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>양도자</th>
                        <th>구매일</th>
                        <th>사용기한</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>1</td>
                        <td>박주연</td>
                        <td>26.04.15</td>
                        <td>26.09.20</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </transition>
        </div>
      </div>
      <div class="MyPageCouponHistory--card disabled"> <!-- 사용 가능 수량 0개 = .disabled -->
        <div class="MyPageCouponHistory--type">프로모션</div>
        <div class="MyPageCouponHistory--tit">마이웰니스 랩 건강 분석권 2026 프로모션 쿠폰</div>
        <div class="MyPageCouponHistory--info">
          <span>사용 가능 수량</span>
          <strong>0개</strong>
          <span>사용기한</span>
          <strong>-</strong>
        </div>
        <div class="MyPageCouponHistory--detail">
          <div @click="open" class="MyPageCouponHistory--trigger">
            <span>상세 내역 보기</span>
            <div class="MyPageCouponHistory--btn-wrap">
              <button type="button" aria-label="펼치기/닫기"></button>
            </div>
          </div>
          <transition name="downUp2">
            <div class="MyPageCouponHistory--status">
              <div>
                <p>사용 완료</p>
                <div class="MyPageCouponHistory--table">
                  <table>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>지급일</th>
                        <th>사용일</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>1</td>
                        <td>26.03.15</td>
                        <td>26.04.20</td>
                      </tr>
                      <tr>
                        <td>2</td>
                        <td>26.05.15</td>
                        <td>26.07.20</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div>
                <p>사용 가능</p>
                <span>사용 가능한 분석권이 없습니다.</span>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>

  </section>
</template>

<style lang="scss"></style>
