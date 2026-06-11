

class HealthCondition {
    
    constructor() {

        this.CK_sleep_time = {name : "수면", status: 0, msg: "", }; // 수면시간
        this.CK_water_amt = {name : "수분", status: 0, msg: "", }; // 수분 섭취량
        this.CK_MH_stress = {name : "스트레스", status: 0, msg: "", }; // 스트레스
        this.CK_eq5d = {name : "삶의 질", status: 0, msg: "", }; // 삶의질
        this.CK_met = {name : "활동", status: 0, msg: "", }; // 활동량
        this.CK_rfs = {name: "식사의 질", status:0, msg: ""};   // 식사의 질
        this.CK_drink = {name : "음주", status: 0, msg: "", }; // 음주
        this.CK_smok = {name : "흡연", status: 0, msg: "", }; // 흡연
        

        this.CK_sleep_time.list = [
            "잠은 낮 동안 축적된 피로를 회복시키고, 감정을 안정시키며, 멜라토닌과 성장호르몬 등의 분비를 촉진합니다. 또한, 낮 동안 학습된 정보를 재정리하고 통합함으로써 기억을 강화하는 데 중요한 역할을 합니다.",
            "6시간 미만의 수면은 피로감, 집중력 저하, 운동능력 저하, 면역력 저하의 문제가 생길 수 있으며 만성적인 수면 부족은 고혈압, 당뇨병, 치매, 비만 등의 발병 위험을 높일 수 있습니다.",
            "성인의 추천 수면 시간은 하루 평균 7~9시간입니다.",
        ];

        this.CK_water_amt.list =[
            "우리 몸의 약 70%가 수분으로 이뤄져 있으며, 수분은 체액과 혈액을 구성 할 뿐 아니라 체온조절, 혈압 유지, 노폐물 제거에 중요한 역할을 합니다.",
            "체중 1~2%의 수분이 손실되는 경미한 탈수 상태에도 건강에 이상이 생길 수 있습니다. 특히, 신장결석, 비만, 당뇨병, 암 등의 위험과 연관이 있습니다."
        ];

        this.CK_eq5d.list =[
            "적정 수준의 스트레스는 유용한 자극이 되어 동기부여의 역할을 하기도 하지만, 과도한 스트레스는 만성 질환의 주요 위험 요인입니다.",
            "만성 스트레스는 스트레스 호르몬을 분비시켜 면역기능을 저하시키고, 두통, 불면증, 고혈압, 비만, 당뇨병, 근육긴장 등을 초래합니다.",
            "규칙적인 운동, 충분한 수면, 명상, 심호흡 등을 통해 스트레스를 해소하고 삶의 질을 유지하기 위해 마음관리를 해야 합니다.",
        ];

        this.CK_met.list =[
            "규칙적인 신체활동은 체력 증진과 함께 만성 질환 및 암 예방, 정신 건강 유지에 효과적입니다. <br/> 평소보다 숨을 더 차게 만드는 중강도 이상의 유산소 운동(빨리 걷기, 자전거, 수영, 요가, 복식 테니스)을 하루 최소 30분 이상 지속하여 심폐지구력을 기를 수 있습니다.",
            "또한 근력 운동은 하루 최소 20분, 일주일에 3회 정도 하는 것이 좋습니다. <br/> -고무밴드, 팔굽혀펴기, 윗몸일으키기, 벽밀기, 아령운동: 8~12회/세트, 3~5세트 반복 <br/> -피트니스센터 기구: 6 RM으로 10회 정도 또는 12 RM으로 10회 정도 2~3세트 추가 수행 <br/><h5>*근력운동은 본인의 숙련도에 따라 횟수와 세트를 적절히 증감하여 부상의 위험을 낮출 수 있도록 유의하세요. <br/>**RM이란? 본인이 정확한 운동 동작을 사용해서 1회 들어올릴 수 있는 무게의 최대치입니다. 즉, 6RM은 최대 6번 반복할 수 있는 무게를 뜻합니다.</h5>",
        ];

        this.CK_drink.list =[
            "음주는 여러 급∙만성 질환(췌장염, 알코올성 간염, 간경변, 뇌졸중, 뇌출혈, 고혈압, 각종 암 등)을 유발하거나 악화시킵니다.",
        ];

        this.CK_smok.list = [
            "흡연은 산화 스트레스를 높여 각종 암은 물론 심혈관계질환, 뇌출혈, 호흡기질환, 천식 등의 원인이 됩니다.",
        ];
        this.CK_MH_stress.list = [
            "적정 수준의 스트레스는 유용한 자극이 되어 동기부여의 역할을 하기도 하지만, 과도한 스트레스는 만성 질환의 주요 위험 요인입니다. 만성 스트레스는 스트레스 호르몬을 분비시켜 면역기능을 저하시키고, 두통, 불면증, 고혈압, 비만, 당뇨병, 근육긴장 등을 초래합니다. ",
            "규칙적인 운동, 충분한 수면, 명상, 심호흡 등을 통해 스트레스를 해소하고 삶의 질을 유지하기 위해 마음관리를 해야 합니다."
        ]
        this.CK_rfs.list= [
            "좋은 식사는 영양소가 균형 있게 다양하게 포함된 식단을 의미하며, 건강을 유지하기 위해 매우 중요합니다.",
            "식사의 질이 나쁘면 필수영양소의 부족으로 인한 영양실조가 발생하거나, 과다한 칼로리, 나트륨, 당, 포화지방 섭취에 따른 비만, 고혈압, 당뇨병, 이상지질혈증 등의 만성질환 위험이 증가합니다. 또한, 식습관은 우울감을 포함한 정신적 건강에도 영향을 미칩니다.",
            "제철 과일과 채소, 곡물, 단백질원 등 다양한 식품군을 조화롭게 섭취하는 것이 좋습니다."
        ]
    }

    setData(data, user_info = null){

        this.CK_sleep_time.status = data.comphckData.CK_sleep_time; // 수면시간
        this.CK_sleep_time.msg = data.comphckMsg.CK_sleep_time; // 수면시간

        this.CK_water_amt.status = data.comphckData.CK_water_amt; // 수분 섭취량
        this.CK_water_amt.msg = data.comphckMsg.CK_water_amt; // 수분 섭취량

        this.CK_eq5d.status = data.comphckData.CK_eq5d; // 삶의질
        this.CK_eq5d.msg = data.comphckMsg.CK_eq5d; // 삶의질

        this.CK_met.status = data.comphckData.CK_MET; // 활동량
        this.CK_met.msg = data.comphckMsg.CK_MET; // 활동량

        this.CK_drink.status = data.comphckData.CK_drink; // 음주
        this.CK_drink.msg = data.comphckMsg.CK_drink_amt; // 음주

        this.CK_smok.status = data.comphckData.CK_smok; // 흡연
        this.CK_smok.msg = data.comphckMsg.CK_smok; // 흡연

        this.CK_MH_stress.status = data.comphckData.CK_MH_stress; // 스트레스
        this.CK_MH_stress.msg = data.comphckMsg.CK_MH_stress; // 스트레스

        /** 성별 및 상태별로 메시지가 추가됨 */

        if(user_info) {
            // 남자인경우
            if(user_info.gender == 1) {
                this.CK_drink.list[this.CK_drink.list.length -1] += "남성의 적정음주량은 1회 음주 시 소주 7잔 미만입니다."

                if(user_info.age >= 50 && user_info.age <=74) {
                    this.CK_water_amt.list[this.CK_water_amt.list.length -1] += "하루 5잔 이상의 물을 섭취할 수 있도록 합니다. 대부분의 음료에는 당류, 나트륨, 카페인, 알코올 등이 있어 이뇨작용으로 체내 수분을 감소시키거나 갈증을 유발하므로, 물 위주로 섭취하는 것이 좋습니다."
                } else {
                    this.CK_water_amt.list[this.CK_water_amt.list.length -1] += "하루 6잔 이상의 물을 섭취할 수 있도록 합니다. 대부분의 음료에는 당류, 나트륨, 카페인, 알코올 등이 있어 이뇨작용으로 체내 수분을 감소시키거나 갈증을 유발하므로, 물 위주로 섭취하는 것이 좋습니다."
                }

            // 여자인경우
            } else {
                this.CK_drink.list[this.CK_drink.list.length -1] += "여성의 적정음주량은 1회 음주 시 소주 3잔 미만입니다.";
                this.CK_water_amt.list[this.CK_water_amt.list.length -1] += "하루 5잔 이상의 물을 섭취할 수 있도록 합니다. 대부분의 음료에는 당류, 나트륨, 카페인, 알코올 등이 있어 이뇨작용으로 체내 수분을 감소시키거나 갈증을 유발하므로, 물 위주로 섭취하는 것이 좋습니다."
            }

            // 흡연 상태가 안좋은경우
            if(this.CK_smok.status == 3) {
                this.CK_smok.list[this.CK_smok.list.length -1] += "금연을 위한 노력이 필요합니다.";

            // 흡연 상태가 양호한경우
            } else if(this.CK_smok.status == 1) {
                this.CK_smok.list[this.CK_smok.list.length -1] += " 지금처럼 유지해주세요.";
            }
                
        }

        return this;

    }

}
  
  export default HealthCondition;