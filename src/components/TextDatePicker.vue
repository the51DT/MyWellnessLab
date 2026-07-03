<script>
import { nextTick } from "vue";

export default {
  name: "TextDatePicker",
  props: {
    showDetail: {
      type: Boolean,
      default: false,
    },
    successDates: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      selectDate: null,
      selectedColor: "orange",
      attributes: [],
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

        // -----------------------------
        // 1. 텍스트 영역 (중복 제거)
        // -----------------------------
        const old = pane.querySelector(".calendar-text-wrap");
        if (old) old.remove();

        const wrap = document.createElement("div");
        wrap.className = "calendar-text-wrap";

        wrap.innerHTML = `
          <div class="desc">
            <p class="desc--text">
              이번 달 나의 미션 인증 횟수
              <strong class="clear-count">6</strong>회
            </p>
            ${
              this.showDetail
                ? `<p class="desc--text">
                    전체 70일 중에
                    <b class="clear-day">28</b>일 인증 완료했습니다.
                  </p>`
                : ""
            }
          </div>
        `;

        pane.insertBefore(wrap, weeks);

        // -----------------------------
        // 2. 날짜 success 처리
        // -----------------------------
        const days = pane.querySelectorAll(".vc-day-content");
        const successSet = new Set(this.successDates);

        days.forEach((day) => {
          const label = day.getAttribute("aria-label");
          const parsedDate = this.parseDate(label);

          if (successSet.has(parsedDate)) {
            day.classList.add("success");
          }

          // start 예시
          if (parsedDate === "2026-07-01") {
            day.classList.add("start");
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
};
</script>

<template>
  <div class="text-date-picker">
    <VDatePicker
      v-model="selectDate"
      mode="date"
      :isToday="true"
      :attributes="attributes"
      :model-config="config"
      :masks="mask"
      :color="selectedColor"
      @update:page="addMessages"
      is-required
    />
  </div>
</template>

<style lang="scss">
.text-date-picker {
  .calendar-text-wrap {
    margin-top: 0.6rem;
  }
  .desc--text {
    font-size: 1.4rem;
    color: #808080;
    line-height: 1.5;
    font-family: 'Pretendard', serif;
  }
  .clear-count {
    font-size: 2rem;
    color: #146B5B;
  }
  .clear-day {
    font-weight: 600;
    color: #146B5B;
  }
  .vc-container {
    border-radius: 2.4rem;
    border: 1px solid #E5E5E5;
    background-color: white;
    width: 100%;
  }
  .vc-pane{
    width: 100%;
  }
  .vc-header{
    margin-top: 1.8rem;
  }
  .vc-arrow{
    background: transparent;
  }
  .vc-title{
    font-size: 2.2rem;
    font-weight: 600;
    line-height: 1.5;
    background: transparent;
  }
  .vc-day{
    pointer-events: none;
    &-content{
      width: 3.6rem;
      height: 3.6rem;
      font-size: 1.5rem;
      font-weight: 400;
      text-align: center;
      color: #333;
      font-family: 'Pretendard', serif;
      &.success {
        background: #146B5B;
        color: #fff;
        font-weight: 700;
      }
      &.start {
        background: #146B5B;
        color: #fff;
        font-weight: 700;
        &::after{
          content: 'Start';
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
        border: .4rem solid #146B5B;
        color: #146B5B;
        font-weight: 700;
        &::after{
          content: 'Today';
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
    }
  }
  .vc-week{
    + .vc-week{
      margin-top: 1.7rem;
    }
    &s{
      margin-top: 1.2rem;
      padding: 0 1.9rem 3.5rem;
    }
    &days{
      margin-bottom: .4rem;
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
    }
    &:has(.vc-day.is-not-in-month):not(:has(.vc-day:not(.is-not-in-month))){
      display: none;
    }
    .weekday-1:not(.is-not-in-month){
      .vc-day-content:not(.success, .start, .today){
        color: #146B5B;
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
}
</style>