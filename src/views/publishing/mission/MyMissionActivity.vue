<script>
import { nextTick } from 'vue'
import BadgeDefault from '@/views/publishing/BadgeDefault.vue'
import pubMyMissionAct from "@/views/publishing/pubMyMissionAct.js";

export default {
  name: 'MyMissionActivity',
  components: {
    BadgeDefault,

  },
  data () {
    return {
      selectedBadge: null,
      isBadgeModalOpen: false,
      isConfiguredBadgeModal: false,
    }
  },
  setup() {

  },
  mounted() {
    nextTick(() => {
      pubMyMissionAct.layerOpen('badges_reward')
    })
  },
  methods: {
    openBadgeSetting() {
      this.$router.push({
        name: 'pubMyBadgeSetting',
        query: { hasBadges: 'true' },
      })
    },
    handleBadgeClick(event) {
      const badgeItem = event.target.closest('.badge-box')
      if (!badgeItem) return
      if (badgeItem.classList.contains('is-disabled')) return

      const titleElement = badgeItem.querySelector('.badge__name p')
      const imgElement = badgeItem.querySelector('img')
      const rawTitle = titleElement ? titleElement.textContent : '배지'

      this.selectedBadge = {
        title: rawTitle.replace(/\$/g, '').trim(),
        img: imgElement ? imgElement.getAttribute('src').split('/').pop() : '',
      }
      this.isConfiguredBadgeModal = false
      this.isBadgeModalOpen = true
    },
    openConfiguredBadgeModal() {
      this.selectedBadge = {
        title: '챌린지 러버',
        img: 'pin--ruby.svg',
      }
      this.isConfiguredBadgeModal = true
      this.isBadgeModalOpen = true
    },
    closeBadgeModal() {
      this.isBadgeModalOpen = false
      this.selectedBadge = null
      this.isConfiguredBadgeModal = false
    },  
  },
}

</script>

<template>
  <div class="activity bg-green">
    <div class="activity__area">
      <div class="activity__area-certified">
        <div>
          <p>최초 인증일</p>
          <p class="_date"><strong>$2025년 7월 5일$</strong></p>
        </div>
        <div>
          <p>미션별 누적 인증 기록</p>
          <a href=""><strong>자세히 보기</strong></a>
        </div>
        <div>
          <p>총 누적 인증 횟수</p>
          <p class="_count"><strong>$1,230$회</strong></p>
        </div>
      </div>
    </div>
    <div class="activity__area-terms-tab home">
      <div class="activity__area-profile">
        <h2>현재 나의 활동</h2>
        <p class="activity__area-profile-date">활동 기준일 : 2025년 9월 ~ 2026년 8월</p>
        
        <div class="badge__container">
          <BadgeDefault img="pin--diamond.svg" />
          <div class="badge__desc">
            <div class="badge__desc-info">
              <span class="badge__desc-my"> 다이아몬드 </span>            
              <button type="button" class="badges_reward_btn__open">
                <img src="/img/ico_tooltip_black.svg" alt="핀레벨 뱃지 설명 툴팁 오픈 버튼" />
              </button>
            </div>
            <div class="badge__desc-name">
              <span> 닉네임 영문 최대 20자 </span>
            </div>           
            <div class="badges_reward">
              <div class="badges_reward_btn">                
                <div class="badges_reward_btn__arrow"><span class="blind">상단 화살표</span></div>
                <div class="badges_reward_btn__pop">
                  
                  <span class="badges_reward_btn-txt"> 총 인증 횟수에 따라 것모닝핀이 올라갑니다. </span>
                  <button class="badges_reward_btn__pop__close"></button>
                  <div class="activity__area_badge-section">
                    <div class="badge-box-wrap">
                      <div class="badge-box">
                        <BadgeDefault pointColor="white" img="pin--beginner.svg">비기너</BadgeDefault>
                        <span> 0회</span>
                      </div>
                      <div class="badge-box">
                        <BadgeDefault pointColor="white" img="pin--rookie.svg">루키</BadgeDefault>
                        <span> 2회</span>
                      </div>
                      <div class="badge-box">
                        <BadgeDefault pointColor="white" img="pin--bronze_foundation.svg">브론즈 파운데이션</BadgeDefault>
                        <span> 5회</span>
                      </div>
                      <div class="badge-box">
                        <BadgeDefault pointColor="white" img="pin--bronze_builder.svg">브론즈 빌더</BadgeDefault>
                        <span> 8회</span>
                      </div>
                      <div class="badge-box">
                        <BadgeDefault pointColor="white" img="pin--silver_producer.svg">실버 프로듀서</BadgeDefault>
                        <span> 11회</span>
                      </div>
                      <div class="badge-box">
                        <BadgeDefault pointColor="white" img="pin--gold_producer.svg">골드 프로듀서</BadgeDefault>
                        <span> 31회</span>
                      </div>
                      <div class="badge-box">
                        <BadgeDefault pointColor="white" img="pin--platinum.svg">플래티늄</BadgeDefault>
                        <span> 51회</span>
                      </div>
                      <div class="badge-box">
                        <BadgeDefault pointColor="white" img="pin--ruby.svg">루비</BadgeDefault>
                        <span> 71회</span>
                      </div>
                      <div class="badge-box">
                        <BadgeDefault pointColor="white" img="pin--sapphire.svg">사파이어</BadgeDefault>
                        <span> 91회</span>
                      </div>
                      <div class="badge-box">
                        <BadgeDefault pointColor="white" img="pin--emerald.svg">에메랄드</BadgeDefault>
                        <span> 111회</span>
                      </div>
                      <div class="badge-box">
                        <BadgeDefault pointColor="white" img="pin--diamond.svg">다이아몬드</BadgeDefault>
                        <span> 131회</span>
                      </div>
                      <div class="badge-box">
                        <BadgeDefault pointColor="white" img="pin--exclutive_diamond.svg">수석 다이아몬드</BadgeDefault>
                        <span> 151회</span>
                      </div>
                      <div class="badge-box">
                        <BadgeDefault pointColor="white" img="pin--double_diamond.svg">더블 다이아몬드</BadgeDefault>
                        <span> 181회</span>
                      </div>
                      <div class="badge-box">
                        <BadgeDefault pointColor="white" img="pin--triple_diamond.svg">트리플 다이아몬드</BadgeDefault>
                        <span> 211회</span>
                      </div>
                      <div class="badge-box">
                        <BadgeDefault pointColor="white" img="pin--crown.svg">크라운</BadgeDefault>
                        <span> 241회</span>
                      </div>
                      <div class="badge-box">
                        <BadgeDefault pointColor="white" img="pin--founders_crown.svg">파운더스 크라운</BadgeDefault>
                        <span> 271회</span>
                      </div>
                      <div class="badge-box">
                        <BadgeDefault pointColor="white" img="pin--crown_ambassador.svg">크라운 앰배서더</BadgeDefault>
                        <span> 301회</span>
                      </div>
                      <div class="badge-box">
                        <BadgeDefault pointColor="white" img="pin--founders_crown_ambassador.svg">파운더스 크라운 앰배서더
                        </BadgeDefault>
                        <span> 316회</span>
                      </div>
                      <div class="badge-box">
                        <BadgeDefault pointColor="white" img="pin--founders_crown_ambassador_40.svg">파운더스 크라운 앰배서더 40
                        </BadgeDefault>
                        <span> 331회</span>
                      </div>
                      <div class="badge-box">
                        <BadgeDefault pointColor="white" img="pin--founders_crown_ambassador_50.svg">파운더스 크라운 앰배서더 50
                        </BadgeDefault>
                        <span> 346회</span>
                      </div>
                      <div class="badge-box">
                        <BadgeDefault pointColor="white" img="pin--founders_crown_ambassador_60.svg">파운더스 크라운 앰배서더 60
                        </BadgeDefault>
                        <span> 361회</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>        
      </div>
      <div class="activity__area_badge-section activity__area-record">
        <div class="para-title">
          <h5> 현재 기록 </h5>
          <button type="button" @click="$router.push({ name: 'pubMyMissionPrevious' })">
            이전 기록
            <div class="img-wrap">
              <img src="/img/ico_arrow_right_black.svg" alt="" />
            </div>
          </button>
        </div>
        <div class="activity__area-record-box-wrap">
          <div class="record-box">
            <div class="ico">
              <span class="blind">인증횟수 아이콘</span>
            </div>
            <div>
              <h5>인증횟수</h5>
            </div>
            <div>
              <p> 누적 </p>
              <p class="val"> 21개 </p>
            </div>
            <div>
              <p>최대 연속 </p>
              <p class="val"> 10개 </p>
            </div>
          </div>
          <div class="record-box">
            <div class="ico">
              <span class="blind">챌린지 아이콘</span>
            </div>
            <div>
              <h5>챌린지(회차)</h5>
            </div>
            <div>
              <p> 참여 수 </p>
              <p class="val"> 5회 </p>
            </div>
            <div>
              <p>성공 </p>
              <p class="val"> 4회 </p>
            </div>
          </div>
          <div class="record-box">
            <div class="ico">
              <span class="blind">최고 인증률 아이콘</span>
            </div>
            <div>
              <h5>최고 인증률</h5>
            </div>
            <div>
              <p> 상시 </p>
              <p class="val"> 80% </p>
            </div>
            <div>
              <p> 챌린지 </p>
              <p class="val"> 80% </p>
            </div>
          </div>
          <div class="record-box">
            <div class="ico">
              <span class="blind">최고 달성 랭킹 아이콘</span>
            </div>
            <div>
              <h5>최고 달성 랭킹</h5>
            </div>
            <div>
              <p> 상시 </p>
              <p class="val"> 1개 </p>
            </div>
            <div>
              <p> 챌린지 </p>
              <p class="val"> 3위 </p>
            </div>
          </div>
        </div>
      </div>
      <div class="activity__area_badge-section para-title">
        <h5> 배지 활동 </h5>
        <p> 총 <span class="val green"> 13개</span> 보유 </p>
      </div>
      <!--  대표 배지있을 시 -->
      <div class="represent__badge-wrap">
        <div class="represent__badge" @click="openConfiguredBadgeModal">
          <BadgeDefault img="pin--ruby.svg">
            챌린지 러버
          </BadgeDefault>
          <div class="btn">
            <button type="button" class="btn-text" title="대표 배지 설정" @click.stop="openBadgeSetting"> 대표 배지 설정</button>
            <button type="button" class="btn-modify" title="대표 배지 설정" @click.stop="openBadgeSetting"><span class="blind">대표 배지 설정</span></button>
          </div>
        </div>
      </div>
      <!-- 대표 배지없을 시 -->
      <div class="represent__badge-wrap">
        <div class="represent__badge no-represent">
          <p class="represent__badge-txt">획득한 배지에서 대표배지를<br/> 설정해주세요 </p>
          <div class="btn">
            <button type="button" class="btn-text" title="대표 배지 설정" @click="openBadgeSetting"> 대표 배지 설정</button>
            <button type="button" class="btn-modify" title="대표 배지 설정" @click="openBadgeSetting"><span class="blind">대표 배지 설정</span></button>
          </div>
        </div>
        <p class="represent__badge-subtxt">아직 획득한 배지가 없어요 </p>
      </div>

      <div class="activity__area_badge-section pt0">
        <div class="para-title-2rd">
          <h6> 연속인증 </h6>
        </div>
        <div class="badge-box-wrap home" @click="handleBadgeClick">
          <div class="badge-box">
            <BadgeDefault img="badge--mission_streak_10.svg">10일 연속 인증</BadgeDefault>
          </div>
          <div class="badge-box">
            <BadgeDefault img="badge--mission_streak_20.svg">20일 연속 인증</BadgeDefault>
          </div>
          <div class="badge-box">
            <BadgeDefault img="badge--mission_streak_30.svg">30일 연속 인증</BadgeDefault>
          </div>
          <div class="badge-box">
            <BadgeDefault img="badge--mission_streak_60.svg">60일 연속 인증</BadgeDefault>
          </div>
          <div class="badge-box">
            <BadgeDefault img="badge--mission_streak_90.svg">90일 연속 인증</BadgeDefault>
          </div>
          <div class="badge-box">
            <BadgeDefault img="badge--mission_streak_100.svg">100일 연속 인증</BadgeDefault>
          </div>
          <div class="badge-box">
            <BadgeDefault img="badge--mission_streak_180.svg">180일 연속 인증</BadgeDefault>
          </div>
          <div class="badge-box">
            <BadgeDefault img="badge--mission_streak_200.svg">200일 연속 인증</BadgeDefault>
          </div>
          <div class="badge-box">
            <BadgeDefault img="badge--mission_streak_240.svg">240일 연속 인증</BadgeDefault>
          </div>
          <div class="badge-box">
            <BadgeDefault img="badge--mission_streak_300.svg">300일 연속 인증</BadgeDefault>
          </div>
          <div class="badge-box">
            <BadgeDefault img="badge--mission_streak_365.svg">365일 연속 인증</BadgeDefault>
          </div>
        </div>
      </div>

      <div class="activity__area_badge-section">
        <div class="para-title-2rd">
          <h6> 챌린지 참여 </h6>
        </div>
        <div class="badge-box-wrap home" @click="handleBadgeClick">
          <div class="badge-box">
            <BadgeDefault img="badge--challenge_complete_1.svg"> 것모닝코리아 챌린지 1회 성공</BadgeDefault>
          </div>
          <div class="badge-box">
            <BadgeDefault img="badge--challenge_complete_2.svg"> 것모닝코리아 챌린지 2회 성공</BadgeDefault>
          </div>
          <div class="badge-box">
            <BadgeDefault img="badge--challenge_beginner.svg">챌린지 비기너</BadgeDefault>
          </div>
          <div class="badge-box">
            <BadgeDefault img="badge--challenge_perfect.svg">챌린지 퍼펙트</BadgeDefault>
          </div>
          <div class="badge-box">
            <BadgeDefault img="badge--challenge_final_sprint.svg">챌린지 막판스퍼트</BadgeDefault>
          </div>
          <div class="badge-box">
            <BadgeDefault img="badge--challenge_slow_aging.svg">저속노화 성공</BadgeDefault>
          </div>
        </div>
      </div>

      <div class="activity__area_badge-section">
        <div class="para-title-2rd">
          <h6> 팀장 </h6>
        </div>
        <div class="badge-box-wrap home" @click="handleBadgeClick">
          <div class="badge-box">
            <BadgeDefault img="badge--self_starter.svg">솔플 축하</BadgeDefault>
          </div>
          <div class="badge-box">
            <BadgeDefault img="badge--new_leader.svg">팀장</BadgeDefault>
          </div>
          <div class="badge-box">
            <BadgeDefault img="badge--proven_leader.svg">팀장의 자질</BadgeDefault>
          </div>
          <div class="badge-box">
            <BadgeDefault img="badge--inspiring_leader.svg">팀장의 정석</BadgeDefault>
          </div>
          <div class="badge-box">
            <BadgeDefault img="badge--elite_leader.svg">우수 팀장</BadgeDefault>
          </div>
          <div class="badge-box">
            <BadgeDefault img="badge--ultimate_leader.svg">혹독한 팀장</BadgeDefault>
          </div>
          <div class="badge-box">
            <BadgeDefault img="badge--flawless_leader.svg">가혹한 팀장</BadgeDefault>
          </div>
        </div>
      </div>

      <div class="activity__area_badge-section">
        <div class="para-title-2rd">
          <h6> 이벤트 배지 </h6>
        </div>
        <div class="badge-box-wrap home" @click="handleBadgeClick">
          <div class="badge-box">
            <BadgeDefault img="badge--event_figure_richDevos.svg">리치 디보스 탄생일</BadgeDefault>
          </div>
          <div class="badge-box">
            <BadgeDefault img="badge--event_figure_jayVanAndel.svg">제이 벤 엔델 탄생일</BadgeDefault>
          </div>
          <div class="badge-box">
            <BadgeDefault img="badge--amway_korea.svg">한국암웨이 창립기념일 </BadgeDefault>
          </div>
          <div class="badge-box">
            <BadgeDefault img="badge--amway_global.svg">파운더스데이 </BadgeDefault>
          </div>
          <div class="badge-box">
            <BadgeDefault img="badge--happy_new_year.svg">새해 첫날</BadgeDefault>
          </div>
          <div class="badge-box">
            <BadgeDefault img="badge--happy_chuseok.svg">추석</BadgeDefault>
          </div>
          <div class="badge-box">
            <BadgeDefault img="badge--mission_start.svg">첫 인증</BadgeDefault>
          </div>
          <div class="badge-box">
            <BadgeDefault img="badge--family_duo.svg">2대 것모너</BadgeDefault>
          </div>
          <div class="badge-box">
            <BadgeDefault img="badge--big_family.svg">다둥이</BadgeDefault>
          </div>
          <div class="badge-box">
            <BadgeDefault img="badge--family_day.svg">패밀리데이</BadgeDefault>
          </div>
          <div class="badge-box">
            <BadgeDefault img="badge--childrens_day.svg">어린이날</BadgeDefault>
          </div>
          <div class="badge-box">
            <BadgeDefault img="badge--octopus_mode.svg">문어발</BadgeDefault>
          </div>
          <div class="badge-box">
            <BadgeDefault img="badge--happy_birthday.svg">나의 생일</BadgeDefault>
          </div>
          <div class="badge-box">
            <BadgeDefault img="badge--returning_hero.svg">복귀왕</BadgeDefault>
          </div>
          <div class="badge-box">
            <BadgeDefault img="badge--early_bird.svg">얼리 것모너</BadgeDefault>
          </div>
          <div class="badge-box">
            <BadgeDefault img="badge--brunch_lover.svg">브런치 것모너</BadgeDefault>
          </div>
          <div class="badge-box">
            <BadgeDefault img="badge--womens_day.svg">세계 여성의날</BadgeDefault>
          </div>
          <div class="badge-box">
            <BadgeDefault img="badge--earth_day.svg">지구의 날</BadgeDefault>
          </div>
          <div class="badge-box">
            <BadgeDefault img="badge--halloween_hustler.svg">고스트 것모닝</BadgeDefault>
          </div>
          <div class="badge-box">
            <BadgeDefault img="badge--valentines_day.svg">스윗 것모닝</BadgeDefault>
          </div>
          <div class="badge-box">
            <BadgeDefault img="badge--liberation_day.svg">광복절</BadgeDefault>
          </div>
          <div class="badge-box">
            <BadgeDefault img="badge--summer_gutmoring.svg">썸머 것모닝</BadgeDefault>
          </div>
          <div class="badge-box">
            <BadgeDefault img="badge--winter_gutmoring.svg">윈터 것모닝</BadgeDefault>
          </div>
          <div class="badge-box">
            <BadgeDefault img="badge--merry_christmas.svg">메리 크리스마스</BadgeDefault>
          </div>
          <div class="badge-box">
            <BadgeDefault img="badge--best_teammate.svg">베스트 팀메이트</BadgeDefault>
          </div>
          <div class="badge-box">
            <BadgeDefault img="badge--family_power.svg">가족의 힘</BadgeDefault>
          </div>
          <div class="badge-box is-disabled">
            <BadgeDefault img="badge--lock.svg" pointColor="lock">$미획득 배지$</BadgeDefault>
          </div>
        </div>
      </div>
    </div>

  </div>



  <!-- <AppNav :activity="true"></AppNav> -->

  <div
    v-if="isBadgeModalOpen"
    class="badge-modal-layer"
    @click.self="closeBadgeModal"
  >
    <div class="badge-modal-card">
      <button class="badge-modal__close" type="button" @click="closeBadgeModal" aria-label="닫기">
        <span class="blind">닫기</span>
      </button>

      <div class="badge-modal__hero">
        <div class="badge-modal__thumb">
          <BadgeDefault v-if="selectedBadge" :img="selectedBadge.img" />
        </div>

        <span v-if="isConfiguredBadgeModal" class="badge-modal__tag">대표배지</span>

        <p class="badge-modal__title">
          {{ selectedBadge ? selectedBadge.title : '' }}
        </p>

        <p class="badge-modal__copy">
          배지를 획득하셨어요!
        </p>
      </div>

      <div class="badge-modal__guide">
        <span class="badge-modal__guide-tag">획득방법</span>
        <p class="badge-modal__guide-text">$미션 인증 {{ selectedBadge ? selectedBadge.title : '' }}$</p>
      </div>

      <button class="badge-modal__primary" type="button" @click="closeBadgeModal">
        {{ isConfiguredBadgeModal ? '대표배지 설정 해제' : '대표배지 설정' }}
      </button>
    </div>
  </div>
</template>

<style lang="scss">
.badge-box.is-disabled { /* 잠긴 배지일 경우 */
  opacity: 0.45;
  cursor: not-allowed;
}
</style>
