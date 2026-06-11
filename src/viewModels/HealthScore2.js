class HealthScore2 {
  constructor() {
    // 사용자 연령대의 건강나의 최소, 평균, 최대 값
    this.hqReference = {
      age: 0,
      min: 0,
      mean: 0,
      max: 0,
    };
    // 건강 속도 , 상태 (1:느림, 2:보통, 3:빠름)
    this.hq_ar = {
      aging_rate: 0,
      status: 0,
    };

    // 건강 유형 , 상태 (1 : 건강한, 2 : 보통의, 3 : 위험한)
    this.hq_htype = {
      health_type: "",
      msg: "",
      status: 0,
    };

    // 건강 유형 메시지 (hs: 건강상태, lh: 생활습관, sol: 솔루션, total: 총점)
    this.hq_htype.msg = {
      msg_hs: "",
      msg_lh: "",
      msg_sol: "",
      msg_total: "",
    };

    // 건강나이
    this.hq_reage = {
      msg: "", // 나의 건강속도에 대한 설명
      percent: 0, // 동일 연령대에서 나의 건강나이 비율
      reage: 0, // AI가 계산한 건강나이
    };

    // 노화억제지수
    this.hq_oxi = {
      mean: 0, // 동일 성별, 연령대의 평균
      msg: "", // 나의 노화억제지수에 대한 설명
      percent: 0, // 동일 연령대에서 나의 노화억제지수 비율
      score: 0.0, //  노화억제지수
      status: 0, // 노화억제지수 상태 (1:좋은 편입니다, 2:보통입니다, 3:나쁜 편입니다)
      t_mean: 0.0, // 한국인 노화억제지수 평균
      t_status: 0, // 한국인 노화억제지수 상태 (1 : 높은, 2 : 비슷한, 3 : 낮은)
    };

    // 만능질환억제지수
    this.hq_met = {
      mean: 0, // 동일 성별, 연령대의 평균
      msg: "", // 나의 노화억제지수에 대한 설명
      percent: 0, // 동일 연령대에서 나의 노화억제지수 비율
      score: 0.0, //  노화억제지수
      status: 0, // 노화억제지수 상태 (1:좋은 편입니다, 2:보통입니다, 3:나쁜 편입니다)
      t_mean: 0.0, // 한국인 노화억제지수 평균
      t_status: 0, // 한국인 노화억제지수 상태 (1 : 높은, 2 : 비슷한, 3 : 낮은)
    };

    // 근육밸런스지수
    this.hq_musBal = {
      mean: 0, // 동일 성별, 연령대의 평균
      msg: "", // 나의 노화억제지수에 대한 설명
      percent: 0, // 동일 연령대에서 나의 노화억제지수 비율
      score: 0.0, //  노화억제지수
      status: 0, // 노화억제지수 상태 (1:좋은 편입니다, 2:보통입니다, 3:나쁜 편입니다)
      t_mean: 0.0, // 한국인 노화억제지수 평균
      t_status: 0, // 한국인 노화억제지수 상태 (1 : 높은, 2 : 비슷한, 3 : 낮은)
    };

    this.hq_musMass = {
      bodypartData: {},
      exerciseData: [],
      fatData: {},
      mass_per: 0.0, // 나의 총 근육량 비율 (%)
      mean: 0.0, // 한국인 근육량 평균
      msgData: {}, // 메시지 목록
      percent: 0, // 동일 성별 · 연령대에서 나의 근육량 순위
      status: 0, // 내 근육량 비율 (%) 판정 결과 (1 : 충족 , 3 : 부족)
      t_mean: 0.0, // 한국인 근육량 평균
      t_status: 0, // 동일 성별 · 연령대기준 근육량 판정 결과 (1 : 평균이상 , 3 : 평균 미만)
    };
    this.hq_musMass.bodypartData = {
      llg: 0.0, // 나의 왼다리 근육량
      llg_percent: 0.0, //나의 왼다리 근육량 비율 (%)
      llg_status: 0, // 나의 왼다리 근육량 비율 (%) 판정 결과 (1 : 충족 , 3 : 부족)
      lrm: 0.0, // 나의 왼팔 근육량
      lrm_percent: 0.0, // 나의 왼팔 근육량 비율 (%)
      lrm_status: 0, // 나의 왼팔 근육량 비율 (%) 판정 결과 (1 : 충족 , 3 : 부족)
      rlg: 0.0, // 나의 오른다리 근육량
      rlg_percent: 0.0, // 나의 오른다리 근육량 비율 (%)
      rlg_status: 0, // 나의 오른다리 근육량 비율 (%) 판정 결과 (1 : 충족 , 3 : 부족)
      rrm: 0.0, // 나의 오른팔 근육량
      rrm_percent: 0.0, // 나의 오른팔 근육량 비율 (%)
      rrm_status: 0, //  나의 오른팔 근육량 비율 (%) 판정 결과 (1 : 충족 , 3 : 부족)
      trk: 0.0, // 나의 몸통 근육량
      trk_percent: 0.0, // 나의 몸통 근육량 비율 (%)
      trk_status: 0, // 나의 몸통 근육량 비율 (%) 판정 결과 (1 : 충족 , 3 : 부족)
      bb_status: 0, // 좌우불균형 판정 (1: 정상 , 3: 좌불균형)
    };
    this.hq_musMass.fatData = {
      bf: 0.0, // 나의 체지방량
      bf_percent: 0.0, // 나의 체지방률 (%)
      bf_status: 0, // 체지방률 (%) 판정 (1: 정상 , 2:주의 , 3:위험)
    };
    this.hq_musMass.msgData = {
      msg_common: "", // 나의 근육량 비율 (%) 응답 메시지 (공통),
      msg_1: "", // 나의 근육량 비율 (%) 응답 메시지 (만성질환 억제 분석 지수와 노화억제 분석 지수에 영향)
      msg_2: "", // 나의 근육량 비율 (%) 응답 메시지 (근육 밸런스 지수에 영향)
    };

    this.health_reg_date = ""; // 건강판정 등록일자
    this.health_status_color = ""; // 나의 건강위치 색상
    this.health_status_msg = ""; // 나의 건강위치 메시지
    this.bodypartData = []; // 나의 근육량 비율 (%)
  }

  setData(data) {
    // 사용자 연령대의 건강나의 최소, 평균, 최대 값
    this.hqReference.age = data.hqReference.age;
    this.hqReference.min = data.hqReference.min;
    this.hqReference.mean = data.hqReference.mean;
    this.hqReference.max = data.hqReference.max;

    // 건강 속도 , 상태 (1:느림, 2:보통, 3:빠름)
    this.hq_ar.aging_rate = Number(data.hq_ar.aging_rate).toFixed(2);
    this.hq_ar.status = data.hq_ar.status;

    // 건강 유형 , 상태 (1 : 건강한, 2 : 보통의, 3 : 위험한)
    this.hq_htype.health_type = data.hq_htype.health_type;
    this.hq_htype.status = data.hq_htype.status;

    // 건강 유형 메시지 (hs: 건강상태, lh: 생활습관, sol: 솔루션, total: 총점)
    this.hq_htype.msg.msg_hs = data.hq_htype.msg.msg_hs;
    this.hq_htype.msg.msg_lh = data.hq_htype.msg.msg_lh;
    this.hq_htype.msg.msg_sol = data.hq_htype.msg.msg_sol;
    this.hq_htype.msg.msg_total = data.hq_htype.msg.msg_total;

    // 건강나이
    this.hq_reage.msg = data.hq_reage.msg;
    this.hq_reage.percent = data.hq_reage.percent;
    this.hq_reage.reage = Number(data.hq_reage.reage).toFixed(0);

    // 노화억제지수
    // status 1 : 좋음, 2 : 보통, 3 : 나쁨
    this.hq_oxi.mean = Number(data.hq_oxi.t_mean).toFixed(0);
    this.hq_oxi.msg = data.hq_oxi.msg;
    this.hq_oxi.percent = data.hq_oxi.percent;
    this.hq_oxi.score = Number(data.hq_oxi.score).toFixed(0);
    this.hq_oxi.status = data.hq_oxi.status;
    this.hq_oxi.t_mean = Number(data.hq_oxi.mean).toFixed(0);
    this.hq_oxi.t_status = data.hq_oxi.t_status;

    // 만능질환억제지수
    // status 1 : 좋음, 2 : 보통, 3 : 나쁨
    this.hq_met.mean = Number(data.hq_met.t_mean).toFixed(0);
    this.hq_met.msg = data.hq_met.msg;
    this.hq_met.percent = data.hq_met.percent;
    this.hq_met.score = Number(data.hq_met.score).toFixed(0);
    this.hq_met.status = data.hq_met.status;
    this.hq_met.t_mean = data.hq_met.mean;
    this.hq_met.t_status = data.hq_met.t_status;

    // 근육밸런스지수
    // status 1 : 좋음, 2 : 보통, 3 : 나쁨
    this.hq_musBal.mean = Number(data.hq_musBal.t_mean).toFixed(0);
    this.hq_musBal.msg = data.hq_musBal.msg;
    this.hq_musBal.percent = data.hq_musBal.percent;
    this.hq_musBal.score = Number(data.hq_musBal.score).toFixed(0);
    this.hq_musBal.status = data.hq_musBal.status;
    this.hq_musBal.t_mean = data.hq_musBal.mean;
    this.hq_musBal.t_status = data.hq_musBal.t_status;

    // 근육량
    this.hq_musMass.exerciseData = data.hq_musMass.exerciseData;
    this.hq_musMass.mass_per = data.hq_musMass.mass_per;
    this.hq_musMass.mean = data.hq_musMass.mean;
    this.hq_musMass.msgData = data.hq_musMass.msgData;
    this.hq_musMass.percent = data.hq_musMass.percent;
    this.hq_musMass.status = data.hq_musMass.status;
    this.hq_musMass.t_mean = data.hq_musMass.t_mean;
    this.hq_musMass.t_status = data.hq_musMass.t_status;

    this.hq_musMass.bodypartData.llg = data.hq_musMass.bodypartData.LLG;
    this.hq_musMass.bodypartData.llg_percent =
      data.hq_musMass.bodypartData.LLG_percent;
    this.hq_musMass.bodypartData.llg_status =
      data.hq_musMass.bodypartData.LLG_status;
    this.hq_musMass.bodypartData.lrm = data.hq_musMass.bodypartData.LRM;
    this.hq_musMass.bodypartData.lrm_percent =
      data.hq_musMass.bodypartData.LRM_percent;
    this.hq_musMass.bodypartData.lrm_status =
      data.hq_musMass.bodypartData.LRM_status;
    this.hq_musMass.bodypartData.rlg = data.hq_musMass.bodypartData.RLG;
    this.hq_musMass.bodypartData.rlg_percent =
      data.hq_musMass.bodypartData.RLG_percent;
    this.hq_musMass.bodypartData.rlg_status =
      data.hq_musMass.bodypartData.RLG_status;
    this.hq_musMass.bodypartData.rrm = data.hq_musMass.bodypartData.RRM;
    this.hq_musMass.bodypartData.rrm_percent =
      data.hq_musMass.bodypartData.RRM_percent;
    this.hq_musMass.bodypartData.rrm_status =
      data.hq_musMass.bodypartData.RRM_status;
    this.hq_musMass.bodypartData.trk = data.hq_musMass.bodypartData.TRK;
    this.hq_musMass.bodypartData.trk_percent =
      data.hq_musMass.bodypartData.TRK_percent;
    this.hq_musMass.bodypartData.trk_status =
      data.hq_musMass.bodypartData.TRK_status;
    this.hq_musMass.bodypartData.bb_status =
      data.hq_musMass.bodypartData.bb_status;

    this.hq_musMass.fatData.bf = data.hq_musMass.fatData.bf;
    this.hq_musMass.fatData.bf_percent = data.hq_musMass.fatData.bf_percent;
    this.hq_musMass.fatData.bf_status =
      data.hq_musMass.fatData.bf_percent_status;

    this.hq_musMass.msgData.msg_common = data.hq_musMass.msgData.msg_common;
    this.hq_musMass.msgData.msg_1 = data.hq_musMass.msgData.msg_1;
    this.hq_musMass.msgData.msg_2 = data.hq_musMass.msgData.msg_2;

    var HEALTH_COLOR = { 1: "초록색", 2: "노랑색", 3: "빨강색" };
    var HEALTH_STR = { 1: "좋은", 2: "보통", 3: "주의가 필요한" };

    this.health_status_color = HEALTH_COLOR[this.hq_htype.status];
    this.health_status_msg = HEALTH_STR[this.hq_htype.status];
    this.health_reg_date = data.reg_date;
    /** 나의 근육량 PDF 페이지에 표시 */
    this.bodypartData = [
      {
        order: 1,
        name: "몸통",
        status: this.hq_musMass.bodypartData.trk_status,
        value: this.hq_musMass.bodypartData.trk,
        percent: this.hq_musMass.bodypartData.trk_percent,
      },
      {
        order: 2,
        name: "왼팔",
        status: this.hq_musMass.bodypartData.lrm_status,
        value: this.hq_musMass.bodypartData.lrm,
        percent: this.hq_musMass.bodypartData.lrm_percent,
      },
      {
        order: 3,
        name: "오른팔",
        status: this.hq_musMass.bodypartData.rrm_status,
        value: this.hq_musMass.bodypartData.rrm,
        percent: this.hq_musMass.bodypartData.rrm_percent,
      },
      {
        order: 4,
        name: "왼다리",
        status: this.hq_musMass.bodypartData.llg_status,
        value: this.hq_musMass.bodypartData.llg,
        percent: this.hq_musMass.bodypartData.llg_percent,
      },
      {
        order: 5,
        name: "오른다리",
        status: this.hq_musMass.bodypartData.rlg_status,
        value: this.hq_musMass.bodypartData.rlg,
        percent: this.hq_musMass.bodypartData.rlg_percent,
      },
    ];

    return this;
  }
}

export default HealthScore2;
