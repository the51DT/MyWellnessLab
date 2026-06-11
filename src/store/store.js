/* eslint-disable no-undef */
import { defineStore } from "pinia";
import JoinData from "@/viewModels/JoinData.js";

// for session
export const sessionStore = defineStore({
  id: "session",
  state: () => ({
    joinAddDataCurrentPage: 0,
    service_id: "",
    user_id: "",
    user_name: "",
    user_birthdate: "",
    user_gender: 0,
    user_cellphone: "",
    user_status: 0,
    lifestyle_page: 0, // 생활습관 설문 페이지 번호 저장
    health_checkup_page: 0, // 건강검진 설문 페이지 번호 저장
    rfs_page: 0, // 식사의 질 설문 페이지 번호 저장
    health_interest_page: 0, // 건강 관심 분야 설문 페이지 번호 저장
    access_token: "", // access token for service api
    refresh_token: "", // refresh token for service api∂
    s_code: 0,
    report_id: 0,
  }),
  _actions: {
    setLogin(user_id) {
      this.user_id = user_id;
    },
    setReportId(report_id) {
      this.report_id = report_id;
    },
    getReportId() {
      return this.report_id;
    },
    setScode(s_code) {
      this.s_code = s_code;
    },
    getScode() {
      return this.s_code;
    },
    setHealthInterestPage(page) {
      this.health_interest_page = page;
    },
    getHealthInterestPage() {
      return this.health_interest_page;
    },
    setLifeStylePage(page) {
      this.lifestyle_page = page;
    },
    getLifeStylePage() {
      return this.lifestyle_page;
    },
    setHealthCheckupPage(page) {
      this.health_checkup_page = page;
    },
    getHealthCheckupPage() {
      return this.health_checkup_page;
    },
    setRFSPage(page) {
      this.rfs_page = page;
    },
    getRFSPage() {
      return this.rfs_page;
    },
    setServiceId(service_id) {
      this.service_id = service_id;
    },
    getServiceId() {
      return this.service_id;
    },
    setUserName(name) {
      this.user_name = name;
    },
    setUserBirthDate(birthdate) {
      this.user_birthdate = birthdate;
    },
    getUserBirthDate() {
      return this.user_birthdate;
    },
    setUserGender(value) {
      this.user_gender = value;
    },
    getUserGender() {
      return this.user_gender;
    },
    setUserStatus(status) {
      this.user_status = status;
    },
    getUserStatus() {
      return this.user_status;
    },
    getUserName() {
      return this.user_name;
    },
    setAddJoinDataPage(val) {
      this.joinAddDataCurrentPage = val;
    },
    getAddJoinDataPage() {
      return this.joinAddDataCurrentPage;
    },
    setToken(access_token, refresh_token) {
      this.access_token = access_token;
      this.refresh_token = refresh_token;
    },
    getToken() {
      return {
        access_token: this.access_token,
        refresh_token: this.refresh_token,
      };
    },
    cleanToken() {
      this.access_token = "";
      this.refresh_token = "";
    },
    async isLogined() {
      if (this.user_id === "") {
        return false;
      } else {
        return true;
      }
    },
    logout() {
      this.health_checkup_page = 0;
      this.lifestyle_page = 0;
      this.rfs_page = 0;
      this.health_interest_page = 0;
      this.user_id = "";
      this.user_name = "";
      this.user_birthdate = "";
      this.user_gender = 0;
      this.user_cellphone = "";
    },
    setUserInfo(data) {
      this.user_gender = data.sex;
      this.user_birthdate = data.birthdate;
      this.user_name = data.name;
      this.user_cellphone = data.cellphone;
    },
    setInitDataPage() {
      this.health_checkup_page = 0;
      this.lifestyle_page = 0;
      this.rfs_page = 0;
      this.health_interest_page = 0;
    },
    getUserInfo() {
      return this;
    },
  },
  get actions() {
    return this._actions;
  },
  set actions(value) {
    this._actions = value;
  },
  persist: { storage: sessionStorage },
});

// for join data
export const userDataStore = defineStore({
  id: "joinData",
  state: () => ({
    joinDataState: new JoinData(),
  }),
  actions: {
    setUserDataAll(data) {
      for (var key in data) {
        this.joinDataState[key] = data[key];
      }
    },
    /** SET User State */
    setUserData(key, val) {
      this.joinDataState[key] = val;
    },
    getJoinDataState() {
      return this.joinDataState;
    },
    /** Get User State */
    getJoinAddData() {
      return this.joinDataState.getJoinAddData();
    },
    resetStore() {
      this.joinDataState = new JoinData();
    },
  },
  persist: { storage: sessionStorage },
});

// for loading
export const loadingStore = defineStore({
  id: "loading",
  state: () => ({
    isLoading: false,
  }),
  actions: {
    setLoading(val) {
      this.isLoading = val;
    },
    getLoading() {
      return this.isLoading;
    },
  },
});

// for footerMenu
export const footerMenuStore = defineStore({
  id: "footerMenu",
  state: () => ({
    isFooterMenu: false,
    isReload: false,
    currentPath: "",
  }),
  actions: {
    setReload(val) {
      this.isReload = val;
    },
    getReload() {
      return this.isReload;
    },
    setPath(val) {
      this.currentPath = val;
    },
    getPath() {
      return this.currentPath;
    },
    setFooterMenu(val) {
      this.isFooterMenu = val;
    },
    getFooterMenu() {
      return this.isFooterMenu;
    },
  },
  persist: { storage: sessionStorage },
});

export const snackBarStore = defineStore({
  id: "snackBar",
  state: () => ({
    title: "",
    subtitle: "",
    message: "",
    active_flag: false,
    height: 450,
    width: 640,
    okFunction: null,
    cancleFunction: null,
  }),
  actions: {
    setStore(
      title,
      subtitle,
      message,
      width,
      height,
      okFunction,
      cancleFunction
    ) {
      this.title = title == null || title == undefined ? "" : title;
      this.subtitle = subtitle == null || subtitle == undefined ? "" : subtitle;
      this.message = message == null || message == undefined ? "" : message;

      if (width != null && width != "" && width != undefined) {
        this.width = width;
      } else {
        this.width = 640;
      }
      if (height != null && height != "" && height != undefined) {
        this.height = height;
      } else {
        this.height = 450;
      }
      this.active_flag = true;

      if (okFunction != null && okFunction != "" && okFunction != undefined) {
        this.okFunction = okFunction;
      } else {
        this.okFunction = null;
      }
      if (
        cancleFunction != null &&
        cancleFunction != "" &&
        cancleFunction != undefined
      ) {
        this.cancleFunction = cancleFunction;
      }
    },
    getStore() {
      return this;
    },
    setReady() {
      this.title = "안내";
      this.subtitle =
        "현재 준비중인 서비스입니다. <br/> 고객센터(070-4488-1733)에 문의해주세요";
      this.message = "";
      this.height = "35%";
      this.active_flag = true;
    },
    setBack(okFunction) {
      this.title = "안내";
      this.subtitle =
        "이 페이지를 벗어나면 변경사항이 저장되지 않습니다. <br/> 정말로 나가시겠습니까?";
      this.message = "";
      // this.okFunction = okFunction
      if (okFunction != null && okFunction != "" && okFunction != undefined) {
        this.okFunction = okFunction;
      } else {
        this.okFunction = null;
      }
      this.height = "35%";
      this.active_flag = true;
    },
    setError(message, okFunction) {
      this.title = "안내";
      this.subtitle = message == null || message == undefined ? "" : message;
      this.message = "";
      this.height = "30%";
      this.active_flag = true;
      // this.okFunction = okFunction
      if (okFunction != null && okFunction != "" && okFunction != undefined) {
        this.okFunction = okFunction;
      } else {
        this.okFunction = null;
      }
    },
    setInActive() {
      this.active_flag = false;
    },
  },
});
