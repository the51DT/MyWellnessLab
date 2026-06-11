/** RFS Score Model */
class RFSScore {
  constructor() {
  // status (1: 양호, 2: 주의, 3: 위험)
    this.food_data = [
      {
        id: 0,
        key: "Rfs",
        name: "식사의 질",
        status: 0,
        popup_flag: false,
        max: 0,
        mean: 0,
        data: 0,
        imgSrc: "normal-reverse",
        imgSrcKor: "normal-reverse-kor",
        check: 0,
      },
      {
        id: 9,
        key: "Regularmeal",
        name: "규칙적인 식사",
        status: 0,
        popup_flag: false,
        max: 0,
        mean: 0,
        data: 0,
        imgSrc: "half3",
        imgSrcKor: "half3",
        check: 0,
      },
      {
        id: 1,
        key: "Multigrain",
        name: "잡곡류",
        status: 0,
        popup_flag: true,
        max: 0,
        mean: 0,
        data: 0,
        imgSrc: "half3",
        imgSrcKor: "half3",
        check: 0,
      },
      {
        id: 6,
        key: "Nuts",
        name: "견과류",
        status: 0,
        popup_flag: true,
        max: 0,
        mean: 0,
        data: 0,
        imgSrc: "half3",
        imgSrcKor: "half3",
        check: 0,
      },
      {
        id: 8,
        key: "Tea",
        name: "차류",
        status: 0,
        popup_flag: true,
        max: 0,
        mean: 0,
        data: 0,
        imgSrc: "half3",
        imgSrcKor: "half3",
        check: 0,
      },
      {
        id: 3,
        key: "Legumes",
        name: "두류 및 두유",
        status: 0,
        popup_flag: true,
        max: 0,
        mean: 0,
        data: 0,
        imgSrc: "half3",
        imgSrcKor: "half3",
        check: 0,
      },
      {
        id: 2,
        key: "Seafood",
        name: "생선류",
        status: 0,
        popup_flag: true,
        max: 0,
        mean: 0,
        data: 0,
        imgSrc: "half3",
        imgSrcKor: "half3",
        check: 0,
      },
      {
        id: 5,
        key: "Vegetable",
        name: "채소류",
        status: 0,
        popup_flag: true,
        max: 0,
        mean: 0,
        data: 0,
        imgSrc: "half3",
        imgSrcKor: "half3",
        check: 0,
      },
      {
        id: 7,
        key: "Fruit",
        name: "과일류",
        status: 0,
        popup_flag: true,
        max: 0,
        mean: 0,
        data: 0,
        imgSrc: "half3",
        imgSrcKor: "half3",
        check: 0,
      },
      {
        id: 4,
        key: "Dairyproducts",
        name: "우유/유제품류",
        status: 0,
        popup_flag: true,
        max: 0,
        mean: 0,
        imgSrc: "half3",
        imgSrcKor: "half3",
        data: 0,
        check: 0,
      },
    ];
    this.food_health_data = [
      {
        key: "Oxidation",
        name: "항산화",
        status: 0,
        status_msg: "",
        msg: "",
        imgSrc_bad: "rfs/factor/3",
        imgSrc_good: "rfs/factor/3",
        description: [
          "권장식품점수는 건강한 식습관을 측정하기 위한 지수로서, 다양한 건강에 유리한 식품군을 얼마나 섭취했는지를 나타냅니다. 이 점수는 다양한 영양소를 공급하는 식품군을 섭취할수록 높아지며, 채소, 과일, 곡물, 단백질원, 어류, 견과류 등이 권장식품으로써 고려됩니다. 높은 권장식품점수를 가진 개인은 다양한 영양소를 균형 있게 섭취하고 있을 가능성이 큽니다. 이는 전반적으로 건강한 식습관을 반영하며, 만성질환 예방에 도움이 될 수 있습니다.",
          "항산화능력은 셀레늄, 비타민 C, 비타민 E 등 항산화물질의 섭취와 관련이 있습니다. 항산화능력은 유해한 산소 라디칼을 제거하여 세포 손상을 예방하는 데 기여합니다. 이는 식물성 식품, 특히 채소와 과일에서 다량으로 발견되는 항산화물질을 섭취함으로써 향상될 수 있습니다. 혈액 내에서 활성산소를 감소시키고 혈관과 세포 손상을 예방하는 데 도움을 줄 수 있습니다. 따라서 항산화능력이 높은 식습관을 유지하는 것은 산화 스트레스로부터 세포를 보호하고, 만성질환의 발생 위험을 줄일 수 있습니다.",
          "(김로그) 님은 권장식품점수가 높고, 노화 억제 분석지수가 높습니다. 이는 다양한 영양소를 고루 섭취하고 항산화 능력을 강화하는 식습관이 전반적인 건강에 도움이 되고 있다는 것을 의미합니다.",
        ],
      },
      {
        key: "Physical_performance",
        name: "운동수행능력/지구력",
        status: 0,
        status_msg: "",
        msg: "",
        imgSrc_bad: "rfs/factor/3",
        imgSrc_good: "rfs/factor/3",
        description: [
          "운동 수행 능력이나 지구력은 운동 시간 동안 몸이 얼마나 효과적으로 작동하는지를 나타냅니다. 이는 근육의 강도, 지구력, 순발력 등과 관련이 있습니다.",
          "건강한 식습관이 신체 기능에 긍정적인 영향을 미칠 수 있습니다. 권장식품점수가 높을수록 건강에 좋은 다양한 음식을 섭취했다는 것을 의미합니다. 이는 영양소를 다양하게 섭취하여 균형 잡힌 식사를 통해 신체에 필요한 에너지와 영양소를 충분히 공급받았다는 것을 알려줍니다.",
          "권장식품점수가 높은 사람들은 균형 잡힌 식습관을 유지하고 있어 운동 수행 능력과 심폐 지구력 향상에 긍정적인 영향을 미칠 수 있다는 연구가 보고되었습니다.",
          "(김로그) 님은 권장식품점수가 높고, 피트니스 지수가 높습니다. 이는 운동 수행 능력과 심폐 지구력에 도움이 되는 다양한 식품을 골고루 섭취하고 있어 신체에 필요한 에너지와 영양소를 잘 공급하고 있다는 것을 의미합니다.",
        ],
      },
      {
        key: "Muscle",
        name: "근력",
        status: 0,
        status_msg: "",
        msg: "근육량 뿐 아니라 근육의 힘도 부족할 가능성이 높아요.",
        imgSrc_bad: "rfs/factor/3",
        imgSrc_good: "rfs/factor/3",
        description: [
          "건강한 삶을 위해서는 근육이 매우 중요합니다 근육량은 보통 30대에 정점에 이르고, 40세 이후 매년 1∼2%씩 감소하다 70대가 되면 자신의 최대 근육량에 비해 절반밖에 남지 않는다고 헙나다.",
          "따라서, 근육 건강을 유지하고 증진시키기 위해서는 균형 잡힌 영양소 섭취가 중요하며, 특히 단백질, 비타민, 미네랄 등의 영양소를 다양한 음식에서 충분히 공급받아야 합니다. 식사에서 적절한 양의 단백질을 섭취하는 것은 근육 건강을 유지하고 증진시키기 위해 중요합니다. 특히 비타민 D, 칼슘, 마그네슘 등의 영양소는 근육 수축과 이완, 에너지 생성에 관여하여 근육 건강에 긍정적인 영향을 미칩니다. 식물성 식품에서 얻을 수 있는 항산화 물질은 근육 손상을 예방하고 회복에 도움을 줄 수 있습니다.",
          "(김로그) 님은 권장식품점수가 높고, 근력(근육)가 높습니다. 이는 다양한 영양소를 고루 섭취하고 있어 근육을 만들고 기능을 유지하는데 도움이 되고 있다는 것을 의미합니다. 여기에 충분한 운동이 병행된다면 더 효과적으로 근육의 양과 질을 유지할 수 있습니다.",
        ],
      },
      {
        key: "Sleep_health",
        name: "수면건강",
        status: 0,
        status_msg: "",
        msg: "수면 시간도 부족하여 수면의 질이 낮아질 수 있어요.",
        imgSrc_bad: "rfs/factor/4",
        imgSrc_good: "rfs/factor/4",
        description: [
          "무엇을 먹는지가 수면의 양과 질에 중요한 영향을 미친다는 연구결과들이 많이 보고되었습니다. 한국인의 수면시간과 건강행태와 식생활 간의 관련성을 분석한 연구에 따르면, 수면이 부족하거나 또는 과다한 경우, 결식률이 높아 식생활이 불규칙하는 등 건강행태가 바람직하지 않아 저체중 또는 비만의 비율이 높은 것으로 보고하였다. 또한 수면의 질이 음식의 선택과 섭취에 영향을 미친다는 보고가 있었습니다. 식사의 질이 낮으면 수면의 질이 낮고, 비만한 경향이 있는 것으로 나타났습니다. 이러한 경향은 남성 보다 여성에서 더 두드러지는 것으로 나타났습니다.",
          "수면의 질이 혈압, 당뇨병, 비만, 심혈관 질환 등 건강 구석구석에 영향을 미친다는 연구 결과도 있습니다. 따라서, 건강 유지와 향상을 위하여 식사의 질 뿐 아니라 수면의 질의 향상이 중요합니다.",
          "(김로그) 님은 수면시간은 충분한 편이지만, 권장식품점수는 (주의가 필요합니다. / 위험한 편입니다). 이는 수면의 질을 지속적으로 유지하려면 건강에 좋은 영향을 미치는 권장식품을 선택하는 습관을 길러야 한다는 것을 의미합니다. 따라서, 만족스러운 수면을 위해서 우리는 과일과 채소, 전곡류, 견과류 등을 많이 먹고 가공식품을 덜 선택하는 습관을 기르면 좋습니다.",
        ],
      },
      {
        key: "Fatigure",
        name: "활력",
        status: 0,
        status_msg: "",
        msg: "삶의 질은 낮아서 우울의 위험도 함게 증가하고 있어요.",
        imgSrc_bad: "rfs/factor/5",
        imgSrc_good: "rfs/factor/5",
        description: [
          "식사의 질은 일상의 활력과 관련성이 있습니다. 올바른 식습관은 에너지 수준을 유지하고, 신체에 필요한 영양소를 제공하여 피로를 줄이고 에너지를 유지하는 데 도움을 줄 수 있습니다. 또한 아무것도 먹지 않고 2시간 이상 운동하는 습관, 전곡이나 견과류와 같은 식이섬유가 많은 음식을 섭취하지 않는 습관, 채소와 단백질 급원의 섭취가 부족한 식습관은 활력을 떨어뜨릴 수 있다고 합니다.",
          "높은 식사의 질은 식품 섭취의 다양성을 높이고, 스트레스의 위험성도 유의미하게 감소한 것을 관찰한 연구결과도 있습니다. 특별히 건강한 식습관이 우울증과 삶의 질에도 연관이 있다는 내용도 보고되어 있습니다. 또한 아침을 거르는 식습관은 스트레스 호르몬의 수치를 급증시켜 식욕을 증가시키고 수면의 질을 떨어뜨릴 수 있다고 합니다.",
          "(김로그) 님은 권장식품점수와 활력 수준이 모두 (주의가 필요합니다. / 위험한 편입니다.) 다양한 영양소를 공급하는 식품군을 적절하게 섭취하지 못 하고 있을 뿐 아니라 활력이 떨어져 전반적인 피로도가 높거나 삶의 질이 낮은 상태라고 볼 수 있습니다. 따라서, 다양한 권장식품을 섭취하는 습관을 길러야 할 뿐 아니라 운동, 수면 등 전반적인 생활습관을 점검하여야 합니다.",
        ],
      },
    ];
    this.food_msg = {
      clMessage: "",
      dqMessage: "",
      dqMessage_sub1: "",
      dqMessage_sub2: "",
    };

    // 각 항목 설명 및 팝업내용
    // 각 항목의 Order 는 PDF 화면에서 정렬을 나타냄
    // 각 항목의 name 은 PDF 화면에서 보여지는 이름
    this.food_description = [
      // 식사의 질
      { key: "Rfs", name: "식사의 질", order: 0, description: "" },
      // 규칙적인 식사
      { key: "Regularmeal", name: "규칙적인 식사", order: 0, description: "" },
      // 잡곡류
      {
        key: "Multigrain",
        name: "잡곡류",
        order: 3,
        description:
          "잡곡류에는 현미, 옥수수, 보리, 시리얼 등이 포함되며, 이들은 식이섬유, 비타민 B1, 니아신이 풍부합니다.",
        description_list: [
          {'title': "밥, 죽에 혼합", 'content': "다양한 잡곡류를 밥이나 죽에 혼합하여 섭취합니다."},
          {'title': "샐러드", 'content': "옥수수나 시리얼 등을 샐러드에 추가하여 섭취합니다."},
          {'title': "요거트, 우유와 함께", 'content': "다양한 시리얼들은 요거트와 우유와 함께 아침식사로 섭취할 수 있습니다."},
        ],
          
      },
      // 두류/두유
      {
        key: "Legumes",
        name: "두류/두유",
        order: 1,
        description:
          "두류및 두유에는 두부, 대두, 된장, 두유 등이 포함되며, 이들은 단백질, 불포화지방산이 풍부합니다.",
        description_list: [
          {"title": "반찬", "content": "두부는 구워서 스테이크처럼 먹거나 조림, 부침 등 다양한 요리로 활용 할 수 있고, 대두는 삶아 샐러드나 간식으로 먹기에 좋습니다."},
          {"title": "국물 요리", "content": "된장은 된장국이나 찌개로 활용하고, 두부는 국물 요리에 넣어 활용할 수 있습니다."},
          {"title": "소스, 양념", "content": "된장을 고기나 채소의 양념에 사용하거나, 두부를 갈아 소스로 활용하여 담백한 맛을 즐깁니다."},
        ],
      },
      // 채소류
      {
        key: "Vegetable",
        name: "채소류",
        order: 2,
        description:
          "채소류에는 양파, 토마토, 양배추, 상추, 당근 등이 포함되며, 이들은 식이섬유가 풍부합니다.",
        description_list: [
          {"title": "샐러드", "content": "신선한 양배추, 당근을 잘라 샐러드로 만들어 드레싱과 함께 섭취합니다."},
          {"title": "구이, 볶음", "content": "양파와 토마토는 굽거나 볶음 요리에 더해 풍미를 높이고, 양배추와 당근은 볶아서 다양한 요리에 곁들여 활용할 수 있습니다."},
          {"title": "주스, 스무디", "content": "토마토와 당근은 주스로 만들어 건강 음료로 즐기고, 양배추도 스무디에 넣어 섬유질을 보충할 수 있습니다."},
        ],
      },
      // 생선류
      {
        key: "Seafood",
        name: "생선류",
        order: 6,
        description:
          "생선류에는 멸치, 고등어, 명태, 연어, 조기, 꽁치, 방어, 임연수어 등이 포함되며, 이들은 단백질, 비타민D, EPA + DHA가 풍부합니다.",
        description_list: [
          {"title": "구이, 조림", "content": "조기와 임연수어는 간장과 함께 조림으로 만들어 요리하고, 고등어와 꽁치는 구이나 조림으로 요리하면 고소한 맛을 즐길 수 있습니다."},
          {"title": "국물 요리", "content": "멸치는 국물 육수로 활용하며, 명태는 맑은탕이나 매운탕 같은 국물 요리에 좋습니다."},
          {"title": "샐러드, 회", "content": "연어는 회로 섭취하거나, 샐러드 요리로 활용하면 신선한 맛을 즐길 수 있습니다."},
        ],
      },
      // 우유/ 유제품류
      {
        key: "Dairyproducts",
        name: "우유/유제품류",
        order: 8,
        description:
          "우유 및 유제품류에는 우유, 요구르트, 치즈 등이 포함되며, 이들은 칼슘이 풍부합니다.",
        description_list: [
          {"title": "간식, 음료", "content": "우유, 요구르트는 아침 음료나 간식으로 섭취할 수 있습니다."},
          {"title": "샐러드", "content": "치즈는 샐러드에 넣어 풍미와 영양을 더하고, 요구르트는 드레싱으로 활용하여 상큼함을 더할 수 있습니다."},
          {"title": "요리 재료", "content": "우유는 스프나 크림소스 요리에 사용하여 부드러운 맛을 내고, 치즈는 파스타, 피자, 그라탕 등에 넣어 활용할 수 있습니다."},
        ],
      },
      // 견과류
      {
        key: "Nuts",
        name: "견과류",
        order: 4,
        description:
          "견과류에는 헤이즐넛, 아몬드, 잣, 해바라기씨, 브라질너트, 호두, 땅콩, 피스타치오 등이 포함되며, 이들은 비타민 E와 불포화 지방산이 풍부합니다.",
        description_list: [
          {"title": "간식", "content": "헤이즐넛, 브라질너트, 땅콩은 가볍게 구워 휴대하기 좋은 건강 간식으로 섭취합니다."},
          {"title": "고명", "content": "아몬드와 잣은 샐러드, 파스타, 볶음 요리에 고명으로 뿌려 고소한 맛과 식감을 더합니다."},
          {"title": "소스, 드레싱", "content": "해바라기씨는 갈아 샐러드 드레싱이나 소스에 넣고, 호두와 피스타치오는 페스토 소스나 크림소스에 활용해 고소함을 더할 수 있습니다."},
        ],
      },
      // 차류
      {
        key: "Tea",
        name: "차류",
        order: 5,
        description:
          "차류에는 녹차, 구기자차, 라벤더차, 로즈마리차 등이 포함되며, 이들은 마그네슘, 비타민 K, 비타민 A가 풍부합니다.",
        description_list: [
          {"title": "단독 섭취", "content": "본연의 향과 맛을 살리기 위해 뜨거운 물에 우려 단독으로 섭취합니다. "},
          {"title": "블렌딩 차", "content": "녹차와 구기자차를 혼합해 즐기거나, 라벤더차와 로즈마리차를 블렌딩하여 풍미를 더한 차를 즐길 수 있습니다."},
          {"title": "음료 베이스", "content": "로즈마리차는 레몬이나 꿀을 추가하여 상쾌한 음료로 만들고, 녹차는 아이스 티로 즐길 수 있습니다. 라벤더차는 따뜻한 라떼로 만들어 부드럽게 즐길 수 있습니다."},
        ],
      },
      // 과일류
      {
        key: "Fruit",
        name: "과일류",
        order: 7,
        description:
          "과일류에는 귤, 딸기, 오렌지, 감, 키위, 바나나, 파인애플, 사과 등이 포함되며, 이들은 비타민C가 풍부합니다.",
        description_list: [
          {"title": "생과일 간식", "content": "신선한 과일의 껍질을 벗기거나 손질하여 그대로 간식으로 섭취합니다."},
          {"title": "샐러드", "content": "과일들을 샐러드에 넣어 달콤한 맛과 풍부한 영양을 더 할 수 있습니다."},
          {"title": "주스, 스무디", "content": "다양한 과일을 조합하여 스무디나 주스로 만들어 아침에 또는 간식으로 마시면 좋습니다."},
        ],
      },
    ];
    this.rfs_cal_data = 0;
    this.rfs_cut_data = 0;
    this.rfs_status = 0;
  }

  setData(data) {
    var STATUS_STR = { 1: "양호", 2: "주의", 3: "위험" };

    if (data.dqStatus) {
      this.food_data.forEach((element) => {
        for (let item in data.dqStatus) {
          if (element.key == item) {
            element.status = data.dqStatus[item];
            element.status_msg = STATUS_STR[element.status];
            // 부족이면 부족 요인 check =1
            if (element.status == 3) {
              element.check = 1;
            }
            element.max = data.dqMax[item];
            element.mean = data.dqCut[item];
            element.data = data.dqData[item];
          }
        }
      });
    }

    if (data.dqHealth) {
      this.food_health_data.forEach((element) => {
        for (let item in data.dqHealth) {
          if (element.key == item) {
            element.status = data.dqHealth[item];
          }
        }
      });
    }

    this.food_msg.clMessage = data.dqMsg.clMessage;
    this.food_msg.dqMessage = data.dqMsg.dqMessage;
    this.food_msg.dqMessage_sub1 = data.dqMsg.dqMessage_sub1;
    this.food_msg.dqMessage_sub2 = data.dqMsg.dqMessage_sub2;
    // 식사의 질 기준값
    // 환산식 : 코어엔진 (47점 만점) -> 100점 만점으로 환산
    // 이후 소수점 첫째 자리에서 반올림
    this.rfs_cal_data = Math.round((this.food_data[0].data / 47) * 100); // 식사의질 기준값
    this.rfs_cut_data = Math.round((data.dqCut.Rfs / 47) * 100); // 식사의질 기준값
    this.rfs_status = this.food_data[0].status;
    return this;
  }
}

export default RFSScore;
