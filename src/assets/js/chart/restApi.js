import axios from "axios";
import { setInterceptors } from "./interceptors";
import { getCheckDateStr } from "@/utl/util";

function createInstanceProduct() {
  // Token값과 특정 url을 붙여서 셋팅
  const instance = axios.create({
    baseURL: `${process.env.VUE_APP_LOCAL_URL}`,
  });
  return setInterceptors(instance);
}

const callServer = createInstanceProduct();

export const foodSearch = async (req) => {
  const result = await callServer.post("/foodSearch", req);
  return result.data;
};

export const smokeData = async (req) => {
  req.smok_date = getCheckDateStr(new Date());
  const result = await callServer.post("/inpSmoke", req);
  return result.data;
};
export const drinkData = async (req) => {
  req.drink_date = getCheckDateStr(new Date());
  console.log("drinkData", req);
  const result = await callServer.post("/inpDrink", req);
  return result.data;
};

export const sleepData = async (req) => {
  req.sleep_date = getCheckDateStr(new Date());
  const result = await callServer.post("/inpSleep", req);
  return result.data;
};

export const mealData = async (req) => {
  const result = await callServer.post("/inpMeal", req);
  return result.data;
};

export const waterData = async (req) => {
  req.water_date = getCheckDateStr(new Date());
  const result = await callServer.post("/inpWater", req);
  return result.data;
};

export const activityData = async (req) => {
  const result = await callServer.post("/inpActivity", req);
  return result.data;
};

export const workData = async (req) => {
  const result = await callServer.post("/inpQOL_workTime", req);
  return result.data;
};

export const stressData = async (req) => {
  req.svyDate = getCheckDateStr(new Date());
  const result = await callServer.post("/inpQOL_stressSense", req);

  return result.data;
};

export const eq5dData = async (req) => {
  req.svyDate = getCheckDateStr(new Date());
  const result = await callServer.post("/inpQOL_EQ5D", req);
  return result.data;
};

export const eqVasData = async (req) => {
  const result = await callServer.post("/inpQOL_EQVAS", req);
  return result.data;
};

export const bdiData = async (req) => {
  const result = await callServer.post("/inpQOL_BDI", req);
  return result.data;
};

export const baiData = async (req) => {
  const result = await callServer.post("/inpQOL_BAI", req);
  return result.data;
};

export const whqolData = async (req) => {
  const result = await callServer.post("/inpQOL_WHQOL", req);
  return result.data;
};

export const healthSurveyData = async (req) => {
  console.log("healthservey", req);
  req.birth_date = getCheckDateStr(new Date());

  const result = await callServer.post("/inpHQues", req);
  return result.data;
};

export const inpHquesDs = async (req) => {
  console.log("inpHquesDs", req);
  const result = await callServer.post("/inpHQues_DS", req);
  return result.data;
};

export const healthSurveyDataA = async (req) => {
  const result = await callServer.post("/inpHQues_a", req);
  return result.data;
};

export const mainData = async (req) => {
  // console.log("mainData", req);
  const result = await callServer.post("/inpEHR", req);
  // console.log("mainDataRes", result);
  return result.data;
};

export const healthReport = async (req) => {
  console.log("healthreport", req);
  const result = await callServer.post("/rstHQ_DiagRepMHI1", req);
  return result.data;
};

export const eatingHabitReport = async (req) => {
  const result = await callServer.post("/rstHQ_DiagRepMHI1_R1", req);

  return result.data;
};

export const mealReport = async (req) => {
  const result = await callServer.post("/rstHE_DiagRep", req);
  return result.data;
};

export const dietReport = async (req) => {
  const result = await callServer.post("/rstDietARRep", req);
  return result.data;
};
export const phytoReport = async (req) => {
  const result = await callServer.post("/rstPhytoARRep", req);
  return result.data;
};

export const comphReport = async (req) => {
  const result = await callServer.post("/rstComphCkRep", req);
  return result.data;
};

export const readyToReport = async (req) => {
  const result = await callServer.post("/ReadyToReport", req);
  return result.data;
};

// 1. 기억력 (기억감퇴 평가 설문)
// API : inpHQuesSvySmcq
// 2. 눈 (눈 피로도 설문)
// API : inpHQuesSvyEsq
// 3. 코 과민반응 (비염 자가 진단 설문)
// API : inpHQuesSvyNt
// 4. 위 (소화불량 설문)
// API : inpHQuesSvyGis
// 5. 장 (장 건강 설문)
// API : inpHQuesSvyRome
// 6. 관절/뼈 (관절 건강 설문)
// API : inpHQuesSvyWomac
// 7. 면역 (면역력 자가 진단)
// API : inpHQuesSvyIt
// 8. 갱년기 여성 (쿠퍼만 갱년기 지수)
// API : inpHQuesSvyKi
// 9. 전립선 (전립선 건강)
// API : inpHQuesSvyIpss
export const reqSurvey = async (apiName, req) => {
  console.log("reqSurvey", apiName, req);
  const result = await callServer.post("/" + apiName, req);
  return result.data;
};

// opcode : 1 //개인 맞춤 건강기능식품 결과 조회
// opcode : 4 //개인 맞춤 건강기능식품 상태변화 조회
export const recommendReport = async (req) => {
  const result = await callServer.post("/mhnPNSReport", req);
  return result.data;
};

export const scrap = async (req) => {
  const result = await callServer.post("/scrap_nhis", req);
  return result.data;
};

export const GetHCRList = async (req) => {
  const result = await callServer.post("/GetHCRList", req);
  return result.data;
};

export const RegVerify = async (req) => {
  // {ssoToken:req.ssoToken}
  // const result = await callServer.post("/ReqVerify_qa", req);
  console.log("RegVerify", req);

  let url = "amwayCookies_01";

  if (process.env.NODE_ENV === "production") {
    if (!process.env.VUE_APP_IS_DEV) {
      url = "https://logme.amway.co.kr/LogmeApiR1/Rest/amwayCookies_01";
    } else {
      url = "https://logme.dev.amway.co.kr/LogmeApiR1/Rest/amwayCookies_01";
    }
  }
  let result;
  try {
    result = await callServer.post(url, req, { withCredentials: true });
  } catch (error) {
    console.log("result", error);
    return error;
  }

  return result.data;
};

export const RegVerifyDev = async (req) => {
  // {ssoToken:req.ssoToken}
  // const result = await callServer.post("/ReqVerify_qa", req);
  console.log("RegVerifyDev", req);
  let url = "amwayCookies_01";

  if (process.env.NODE_ENV === "production") {
    if (!process.env.VUE_APP_IS_DEV) {
      url = "https://logme.amway.co.kr/LogmeApiR1/Rest/amwayCookies_01";
    } else {
      url = "https://logme.dev.amway.co.kr/LogmeApiR1/Rest/amwayCookies_01";
    }
  }
  let result;
  try {
    result = await callServer.post(url, req, { withCredentials: true });
  } catch (error) {
    console.log("result222", error);
    return error;
  }
  return result.data;
};

export const DeleteUserInfoDev = async (req) => {
  // {ssoToken:req.ssoToken}
  // const result = await callServer.post("/ReqVerify_qa", req);
  console.log("DeleteUserInfoDEV", req);
  let url = "/DeleteUserInfo";

  if (process.env.NODE_ENV === "production") {
    if (!process.env.VUE_APP_IS_DEV) {
      url = "https://logme.amway.co.kr/LogmeApiR1/Rest/DeleteUserInfo";
    } else {
      url = "https://logme.dev.amway.co.kr/LogmeApiR1/Rest/DeleteUserInfo";
    }
  }

  let result;
  try {
    result = await callServer.post(url, req, { withCredentials: false });
  } catch (error) {
    return error;
  } // const result = await callServer.post(url, req, {});
  return result.data;
};

export const DeleteUserInfo = async (req) => {
  // {ssoToken:req.ssoToken}
  // const result = await callServer.post("/ReqVerify_qa", req);
  console.log("DeleteUserInfo", req);
  let url = "/DeleteUserInfo";
  // if (process.env.NODE_ENV === "production") {
  //   url = "https://logme.amway.co.kr/LogmeApiR1/Rest/DeleteUserInfo";
  // }

  if (process.env.NODE_ENV === "production") {
    if (!process.env.VUE_APP_IS_DEV) {
      url = "https://logme.amway.co.kr/LogmeApiR1/Rest/DeleteUserInfo";
    } else {
      url = "https://logme.dev.amway.co.kr/LogmeApiR1/Rest/DeleteUserInfo";
    }
  }

  let result;
  try {
    result = await callServer.post(url, req, { withCredentials: false });
  } catch (error) {
    return error;
  }

  // const result = await callServer.post(url, req, {});
  return result.data;
};
