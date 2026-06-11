
/** 나의 수면 습관 */
class HealthSleepHabits {
    
  constructor() {
  // status(1: 양호 , 3: 위험)
    this.data_list = [
      {id:0, key : 'sh', name: '수면의 질', status:0, popup_flag: true, data: 0, cal_data: 0},
      {id:1, key : '01', name: '주관적 수면의 질', status:0, popup_flag: true, data: 0, cal_data: 0},
      {id:2, key : '02', name: '수면 잠복기', status:0, popup_flag: true, data: 0, cal_data: 0},
      {id:3, key : '03', name: '수면 지속 시간', status:0, popup_flag: true, data: 0, cal_data: 0},
      {id:4, key : '04', name: '수면 효율성', status:0, popup_flag: true, data: 0, cal_data: 0},
      {id:5, key : '05', name: '수면 장애', status:0, popup_flag: true, data: 0, cal_data: 0},
      {id:6, key : '06', name: '수면제 사용', status:0, popup_flag: true, data: 0, cal_data: 0},
      {id:7, key : '07', name: '주간 기능 장애', status:0, popup_flag: true, data: 0, cal_data: 0},
    ]
    // 각 항목 설명 및 팝업내용 
    // order 는 PDF 에서 정렬 순서임
    this.data_description_list = [
      // 주관적 수면의 질
      {key : "01", order:1, description : '내가 주관적으로 느끼는 수면의 만족도', description_list : [
        '건강을 유지하고 활기찬 일상을 위해 수면의 질은 반드시 챙겨야 할 요소입니다.',
        '불안한 기분은 각성 상태를 유발합니다. 잠들기 전 긍정적인 감정을 떠올리도록 합니다.',
        '명상, 요가, 심호흡 등 간단한 이완 기법은 긴장을 풀고 잠들기 쉬운 상태를 만들어줍니다.',
        '불규칙한 식사는 수면 리듬에 영향을 줄 수 있으므로, 하루 세 끼를 일정한 시간에 섭취하는 것이 좋습니다.',
      ]},
      // 수면 잠복기
      {key : "02", order:2, description : '누워서부터 잠드는 데 걸리는 시간', description_list : [
        '수면 잠복기는 깊고 안정적인 수면을 돕는 데 중요한 역할을 합니다.',
        '점심 이후에는 카페인을 삼가고, 체리, 키위, 견과류, 아스파라거스 등을 섭취하면 수면에 도움이 됩니다',
        '자기 전에는 격렬한 운동이나 과식, 과도한 수분 섭취를 피하고, 가벼운 스트레칭이나 따뜻한 샤워로 몸을 이완시키는 것이 좋습니다.',
        '침실은 수면 전용 공간으로 사용하며, 잠들기 전 TV나 스마트폰 사용은 자제해야 합니다.'
      ]},
      // 수면 지속 시간
      {key : "03", order:3, description : '실제로 잠을 잔 시간', description_list : [
        '수면 지속시간은 충분한 회복과 심화 수면 단계를 위해 꼭 필요한 요소입니다.',
        '매일 같은 시간에 자고 일어나며, 낮잠은 30분 이내로 제한해 밤 수면에 영향을 주지 않도록 합니다.',
        '밤중에 깨어도 시계를 확인하지 않는 것이 좋습니다.',
        '술은 잠들 때는 도움이 될 수 있으나, 깊은 수면을 방해하고 자주 깨게 하므로 음주는 피하는 것이 좋습니다.',
      ]},
      // 수면 효율성
      {key : "04", order:4, description : '잠자리에 든 시간 대비 실제 수면 시간', description_list : [
        '수면 효율성이 낮으면 같은 시간 잠을 자도 충분한 회복이 어려워, 피로와 집중력 저하로 이어질 수 있습니다.',
        '밤 11시~새벽 3시 사이는 깊은 잠을 유도하는 멜라토닌 분비가 활발하므로 이 시간대에 숙면을 취할 수 있도록 합니다.',
        '침실을 완전히 어둡게 하고, 조용한 환경을 유지하며, 실내온도를 18~22℃로 맞추면 숙면에 도움이 됩니다.',
        '매운 음식은 체온을 높여 수면을 방해할 수 있으므로 취침 3~4시간 전에는 피하는 것이 좋습니다.',
      ]},
      // 수면 장애
      {key : "05", order:5, description : '수면을 방해하는 요소', description_list : [
        '잠들기 전 방해 요인을 줄여야 깊은 수면으로 이어지는 흐름이 끊기지 않습니다.',
        '카페인과 흡연은 이갈이를 유발해 수면의 질을 저하시킬 수 있으니 피해야 합니다.',
        '본인에게 맞는 베개와 매트리스를 사용하면 숙면에 도움이 됩니다.',
        '전자기기의 블루라이트는 뇌를 자극해 수면을 방해하므로, 취침 1시간 전부터는 사용을 줄이는 것이 좋습니다.',
      ]},
      // 수면제 사용
      {key : "06", order:6, description : '수면제 복용 여부', description_list : [
        '밤에 잠을 제대로 자지 못해 일상생활에 지장이 있다면, 일정 기간 동안 의사의 처방에 따라 수면제를 복용할 수 있습니다.',
        '수면제 복용 전, 전문가와 상담하여 적절한 용량과 복용 방법을 따르는 것이 중요합니다.',
        '일정한 기상 시간을 유지하면 자연스러운 수면 패턴을 형성하는 데 도움이 됩니다.',
        '수면제 없이도 숙면을 돕기 위해 명상이나 따뜻한 물로 샤워하는 습관을 들이면 좋습니다.',
      ]},
      // 주간 기능 장애
      {key : "07", order:7, description : '수면 부족으로 인한 일상 생활 장애', description_list : [
        '수면 부족은 집중력 저하, 피로 누적 등으로 일상 기능에 장애를 줄 수 있으므로 꾸준한 수면 리듬 유지가 필요합니다.',
        '30분 이내의 짧은 낮잠은 에너지를 회복하고 무너진 생체 리듬을 개선하거나 조절하는 데 도움이 됩니다.',
        '낮 동안 햇빛을 충분히 쬐어 생체 리듬을 조절되어 숙면에 도움이 됩니다.',
        '규칙적인 운동과 균형 잡힌 식단으로 신체 리듬을 일정하게 유지합니다.',
      ]}
    ]

    // 식사의질 메시지
    this.sleep_habit_msg = '';  
    
  }

  setData(data){

    /** 21점 만점 기준 -> 100점 만점 기준으로 환산한 식 */
    if(data.shData){
      this.data_list.forEach((element)=>{
        for(let item in data.shData){

          if(`PSQIK_C${element.key}` == item) {
            element.cal_data = Math.round(100-((data.shData[item] / 21 ) * 100));
          } 
        }  
      })
    }
    if(data.shData){
      this.data_list.forEach((element)=>{
        for(let item in data.shData){

          if(`PSQIK_C${element.key}` == item) {
            element.data = data.shData[item];
          } 
        }  
      })
    }

    if(data.shStatus){
      this.data_list.forEach((element)=>{
        for(let item in data.shStatus){

          if(`PSQIK_T${element.key}` == item) {
            element.status = data.shStatus[item];
          } 
        }  
      })
    }
    // 수면의 질
    this.data_list[0].data = data.shData.sh;
    this.data_list[0].cal_data = Math.round(100-((data.shData.sh / 21 ) * 100)) ;
    this.data_list[0].status = data.shStatus.sh_status;
    // 수면의 질 판정 메시지
    this.sleep_habit_msg = data.shMsg.shMessage; 
    return this;
  }
}
  
export default HealthSleepHabits;