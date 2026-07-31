<script>
export default {
  name: 'NoticeList',
  data () {
    return {
      prefix: 'NoticeList', /* 클래스 접두어 */ 
      noticeArray : [ /* 퍼블 확인용 데이터 */ 
        {
            new : true,
            fixed : true,
            title : "고정된 공지사항입니다 고정된 공지사항입니다 고정된 공지사항입니다 공지사항 제목 두 줄 케이스",
            date : "2026.07.09"
        },
        {
            fixed : true,
            title : "고정된 공지사항입니다",
            date : "2026.07.09"
        },
        {
            fixed : true,
            title : "고정된 공지사항입니다",
            date : "2026.07.09"
        },
        {
            new : true,
            title : "공지사항입니다 공지사항입니다 공지사항입니다 공지사항 제목 두 줄 케이스",
            date : "2026.07.30"
        },
        {
            new : true,
            title : "공지사항입니다",
            date : "2026.07.30"
        },
        {
            title : "공지사항입니다",
            date : "2026.07.09"
        },
      ]
    }
  },
  methods: {   

  },
}

</script>

<template>
  <section :class="prefix">
    <div :class="prefix + '--item-cover'">
      <a v-for="(item, index) in noticeArray" :key="index" :class="prefix +'--item'" href="javascript:void(0)"> <!-- 202606 상세로 이동 필요 -->
        <div v-if="item.new || item.fixed" :class="prefix +'--item-head'">
          <div v-if="item.new" :class="prefix + '--ico'">
            <img src="/img/ico_new.png" alt="new">
          </div>
          <div v-if="item.fixed" :class="prefix + '--ico'">
            <img src="/img/ico_pin.png" alt="pin">
          </div>                    
        </div>
        <div :class="prefix +'--item-body'">
          <div :class="prefix +'--item-body-tit'">{{item.title}}</div>
          <div :class="prefix +'--item-body-date'">{{item.date}}</div>
        </div>
      </a>
    </div>
  </section>
</template>

<style lang="scss">

</style>
