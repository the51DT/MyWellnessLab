<script>
import { nextTick } from "vue";

export default {
  name: "TextDatePicker",
  emits: ["success-date-click"],
  props: {
    showDetail: {
      type: Boolean,
      default: false,
    },
    successDates: {
      type: Array,
      default: () => [],
    },
    monthCount: {
      type: Number,
      default: 6 /* 퍼블 확인용 이번 달 인증 횟수 */
    },
    periodNum: {
      type: Number,
      default: 70 /* 퍼블 확인용 전체 기간 */
    },
    totalCount: {
      type: Number,
      default: 28 /* 퍼블 확인용 인증 완료 횟수 */
    },
    pointColor: {
      type: String,
      default: 'green', /* pink || green */
    },
    titleText: {
      type: String,
    },
    missionRanges: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      selectDate: null,
      config: {},
      mask: {},
    };
  },
  mounted() {
    this.addMessages();
  },
  methods: {
    addMessages() {
      nextTick(() => {
        const container = this.$el.querySelector(".vc-container");
        if (!container) return;

        const pane = container.querySelector(".vc-pane");
        const weeks = pane?.querySelector(".vc-weeks");
        const header = pane?.querySelector(".vc-header");

        if (!pane || !weeks || !header) return;

        // 텍스트 영역 (중복 제거)
        const old = pane.querySelector(".calendar-text-wrap");
        if (old) old.remove();

        const wrap = document.createElement("div");
        wrap.className = "calendar-text-wrap";

        wrap.innerHTML = `
          <div class="desc">
            <p class="desc--text">
              이번 달 나의 미션 인증 횟수
              <strong class="clear-count">${this.monthCount}</strong>회
            </p>
            ${
              this.showDetail
                ? `<p class="desc--text">
                    전체 ${this.periodNum}일 중에
                    <b class="clear-day">${this.totalCount}</b>일 인증 완료했습니다.
                  </p>`
                : ""
            }
          </div>
        `;

        pane.insertBefore(wrap, weeks);

        // 날짜 success 처리
        const days = pane.querySelectorAll(".vc-day-content");
        const successSet = new Set(this.successDates);

        days.forEach((day) => {
          const label = day.getAttribute("aria-label");
          const parsedDate = this.parseDate(label);

          day.classList.remove("success", "today");
          day.onclick = null;
          day.style.cursor = "";

          if (successSet.has(parsedDate)) {
            day.classList.add("success");
            day.style.cursor = "pointer";

            day.onclick = () => {
              this.$emit("success-date-click", parsedDate);
            };
          }

          // today 처리
          const today = new Date();
          const todayStr = `${today.getFullYear()}-${String(
            today.getMonth() + 1
          ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

          if (parsedDate === todayStr) {
            day.classList.add("today");
          }
        });
      });
    },

    parseDate(dateString) {
      if (!dateString) return "";

      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
          2,
          "0"
        )}-${String(date.getDate()).padStart(2, "0")}`;
      }

      const parts = dateString.match(/\d+/g);
      if (!parts || parts.length < 3) return "";

      return `${parts[0]}-${parts[1].padStart(2, "0")}-${parts[2].padStart(
        2,
        "0"
      )}`;
    },
  },
  computed: {
    calendarAttributes () {
      return this.missionRanges.map((range, index) => {
        return {
          key: `mission-range-${index}`,
          highlight: {
            color: this.pointColor,
            fillMode: 'light'
          },
          dates: {
            start: range.start,
            end: range.end
          }
        }
      })
    }
  },
};
</script>

<template>
  <div class="text-date-picker" :class="`theme-${pointColor}`">
    <div v-if="titleText" class="text-date-picker--title">{{ titleText }}</div>
    <VDatePicker
      v-model="selectDate"
      mode="date"
      :attributes="calendarAttributes"
      :model-config="config"
      :masks="mask"
      @update:page="addMessages"
      is-required
    />
  </div>
</template>

<style lang="scss">
.text-date-picker {
  border-radius: 2.4rem;
  border: 1px solid #E5E5E5;
  background-color: white;
  width: 100%;
  overflow: hidden;
  &--title{
    margin-top: 1.8rem;
    font-size: 1.8rem;
    line-height: 1.5;
    font-weight: 500;
    color: #333;
    text-align: center;
    @media (min-width: 960px) {
      margin-top: 2rem;
      font-size: 2rem;
    }
    + .vc-container .vc-header{
      margin-top: .8rem;
    }
  }
  &.theme-green {
    --text-color: #146B5B;
    --main-color: #146B5B;
    --sub-color: #DEF7F4;
  }
  &.theme-pink {
    --text-color: #C91D56;
    --main-color: #EB608E;
    --sub-color: #FEE6EE;
  }
  .calendar-text-wrap {
    margin-top: 0.6rem;
    text-align: center;
    @media (min-width: 960px) {
      margin-top: .8rem;
    }
  }
  .desc--text {
    font-size: 1.4rem;
    color: #808080;
    line-height: 1.5;
    font-family: 'Pretendard', sans-serif;
    @media (min-width: 960px) {
      font-size: 1.6rem;
    }
  }
  .clear-count {
    font-size: 2rem;
    color: var(--text-color);
    @media (min-width: 960px) {
      font-size: 2.2rem;
    }
  }
  .clear-day {
    font-weight: 600;
    color: var(--text-color);
  }
  .vc-container {
    border: none;
    width: 100%;
  }
  .vc-pane{
    width: 100%;
  }
  .vc-header{
    margin-top: 1.8rem;
    @media (min-width: 960px) {
      margin-top: 2rem;
    }
  }
  .vc-arrow{
    background: transparent;
  }
  .vc-title{
    font-size: 2.2rem;
    font-weight: 600;
    line-height: 1.5;
    background: transparent;
    @media (min-width: 960px) {
      font-size: 2.4rem;
    }
  }
  .vc-day{
    &-content{
      width: 3.6rem;
      height: 3.6rem;
      font-size: 1.5rem;
      font-weight: 400;
      text-align: center;
      color: #333;
      font-family: 'Pretendard', sans-serif;
      &:not(.success){
        cursor: auto;
      }
      &.success {
        background: var(--main-color);
        color: #fff;
        font-weight: 700;
      }
      &.start {
        background: var(--main-color);
        color: #fff;
        font-weight: 700;
        &::after{
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translate(-50%, 100%);
          font-size: 1.1rem;
          line-height: 1.5;
          font-weight: 400;
          color: #333;
        }
      }
      &.today {
        background-color: transparent;
        border: .4rem solid var(--main-color);
        color: var(--main-color);
        font-weight: 700;
        &::after{
          content: '오늘';
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translate(-50%, 100%);
          font-size: 1.1rem;
          line-height: 1.5;
          font-weight: 400;
          color: #333;
        }
      }
      @media (min-width: 960px) {
        width: 4rem;
        height: 4rem;
        font-size: 1.8rem;
        &.start {
          &::after{
            bottom: -.2rem;
            font-size: 1.3rem;
          }
        }
        &.today {
          &::after{
            bottom: -.2rem;
            font-size: 1.3rem;
          }
        }
      }
    }
  }
  .vc-week{
    + .vc-week{
      margin-top: 1.7rem;
      @media (min-width: 960px) {
        margin-top: 2.5rem;
      }
    }
    &s{
      margin-top: 1.2rem;
      padding: 0 1.9rem 3.5rem;
      @media (min-width: 960px) {
        padding: 0 2.4rem 2rem;
      }
    }
    &days{
      margin-bottom: .4rem;
      @media (min-width: 960px) {
        margin-bottom: 1.2rem;
      }
    }
    &day{
      display: flex;
      justify-content: center;
      align-items: center;
      height: 3.6rem;
      padding: 0;
      font-size: 1.5rem;
      font-weight: 400;
      line-height: 1.5;
      color: #666;
      @media (min-width: 960px) {
        font-size: 2rem;
      }
    }
    &:has(.vc-day.is-not-in-month):not(:has(.vc-day:not(.is-not-in-month))){
      display: none;
    }
    .weekday-1:not(.is-not-in-month){
      .vc-day-content:not(.success, .start, .today){
        color: var(--main-color);
      }
    }
  }
  .vc-monthly{
    .is-not-in-month{
      *{
        opacity: 1;
        color: #999;
      }
    }
  }
  .vc-highlights{
    margin: 0 -.1rem;
    &:not(:has(.vc-highlight-base-start, .vc-highlight-base-end)){
      background-color: var(--sub-color);
    }
  }
  .vc-highlight{
    width: 3.6rem;
    height: 100%;
    @media (min-width: 960px) {
      width: 4rem;
    }
  }
  .vc-highlight-bg-light{
    background-color: var(--sub-color);
  }
  .vc-focus:focus-within{
    box-shadow: none;
  }
}
</style>