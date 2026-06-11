
/** 건강신호등 Model */
class HealthNetwork {
    
    constructor() {

        this.nodeList = null; // 노드리스트
        this.clusterList = null; // 클러스터 리스트
        this.edgeList = null // 엣지 리스트
        this.ncList = null // 노드 클러스터 리스트
        this.drug_msg = '' // 복용관련 메세지

        this.cluster_left_list = [
          {
            "name": "수면 건강",
            "index": 22,
            "zoomTop": -60,
            "zoomLeft": -10,
            "zoomScale": 3,
          },
          {
            "name": "눈 건강",
            "index": 6,
            "zoomTop": -100,
            "zoomLeft": -10,
            "zoomScale": 3,
          },
          {
            "name": "코 과민반응",
            "index": 23,
            "zoomTop": -140,
            "zoomLeft": 0,
            "zoomScale": 3,
          },
          {
            "name": "면역 기능",
            "index": 8,
            "zoomTop": -200,
            "zoomLeft": 0,
            "zoomScale": 3,
          },
          {
            "name": "과민 피부\n상태 개선",
            "index": 7,
            "zoomTop": -210,
            "zoomLeft": -0,
            "zoomScale": 3,
          },
          {
            "name": "간 건강",
            "index": 0,
            "zoomTop": -250,
            "zoomLeft": 0,
            "zoomScale": 2,
          },
          {
            "name": "항산화",
            "index": 17,
            "zoomTop": -330,
            "zoomLeft": 0,
            "zoomScale": 2,
          },
          {
            "name": "영양균형",
            "index": 24,
            "zoomTop": -400,
            "zoomLeft": -50,
            "zoomScale": 3,
          },
          {
            "name": "피부 건강",
            "index": 16,
            "zoomTop": -450,
            "zoomLeft": 0,
            "zoomScale": 3,
          },
          {
            "name": "위 건강",
            "index": 11,
            "zoomTop": -500,
            "zoomLeft": 0,
            "zoomScale": 2.5,
          },
          {
            "name": "장 건강",
            "index": 12,
            "zoomTop": -560,
            "zoomLeft": -10,
            "zoomScale": 3,
          },
          {
            "name": "관절/뼈 건강",
            "index": 2,
            "zoomTop": -600,
            "zoomLeft": -10,
            "zoomScale": 3,
          }
        ];
        this.cluster_right_list = [
          {
            "name": "기억력 개선",
            "index": 4,
            "zoomTop": -70,
            "zoomLeft": -65,
            "zoomScale": 3,
          },
          {
            "name": "긴장완화",
            "index": 5,
            "zoomTop": -120,
            "zoomLeft": -60,
            "zoomScale": 3,
          },
          {
            "name": "혈행 개선",
            "index": 21,
            "zoomTop": -120,
            "zoomLeft": -60,
            "zoomScale": 3,
          },
          {
            "name": "혈압 조절",
            "index": 19,
            "zoomTop": -150,
            "zoomLeft": -70,
            "zoomScale": 3,
          },
          {
            "name": "혈중 지질 개선",
            "index": 20,
            "zoomTop": -240,
            "zoomLeft": -70,
            "zoomScale": 3,
          },
          {
            "name": "체지방 조절",
            "index": 14,
            "zoomTop": -400,
            "zoomLeft": -100,
            "zoomScale": 3,
          },
          {
            "name": "혈당 조절",
            "index": 18,
            "zoomTop": -400,
            "zoomLeft": -60,
            "zoomScale": 3,
          },
          {
            "name": "운동수행능력\n/지구력 향상",
            "index": 10,
            "zoomTop": -470,
            "zoomLeft": -50,
            "zoomScale": 3,
          },
          {
            "name": "피로 개선",
            "index": 15,
            "zoomTop": -520,
            "zoomLeft": -50,
            "zoomScale": 3,
          },
          {
            "name": "근육(근력)",
            "index": 3,
            "zoomTop": -550,
            "zoomLeft": -80,
            "zoomScale": 3,
          },
          {
            "name": "전립선 건강",
            "index": 13,
            "zoomTop": -630,
            "zoomLeft": -70,
            "zoomScale": 3,
          },
          {
            "name": "갱년기\n여성건강",
            "index": 1,
            "zoomTop": -650,
            "zoomLeft": -60,
            "zoomScale": 3,
          }
        ];
        
    }

    setData(data){

        this.nodeList = data.nodeList
        this.clusterList = data.clusterList
        this.edgeList = data.edgeList
        this.ncList = data.ncList
        this.drug_msg = data.drug_Msg

        return this;
    }

}
  
  export default HealthNetwork;