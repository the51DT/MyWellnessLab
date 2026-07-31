<script>

import { ref } from 'vue'

export default {
  name: 'NoticeList',
  data () {
    return {
      prefix: 'NoticeList', /* 231215 클래스 접두어 */ 
      noticeArray : [
        {
            new : true,
            fixed : false,
            title : "새로운 게시글",
            desc : "문장입니다",
            date : "2026.07.30"
        },
        {
            new : false,
            fixed : true,
            title : "고정된 공지사항입니다",
            desc : "문장입니다",
            date : "2026.07.25"
        },
        {
            new : false,
            fixed : true,
            title : "고정된 공지사항 제목",
            desc : "문장입니다",
            date : "2026.07.12"
        },
        {
            new : false,
            fixed : false,
            title : "공지사항 제목",
            desc : "문장입니다",
            date : "2026.07.09"
        },
        {
            new : true,
            fixed : true,
            title : "새로운 고정된 공지사항 제목새로운 고정된 공지사항 제목새로운 고정된 공지사항 제목새로운 고정된 공지사항 제목새로운 고정된 공지사항 제목새로운 고정된 공지사항 제목새로운 고정된 공지사항 제목새로운 고정된 공지사항 제목새로운 고정된 공지사항 제목새로운 고정된 공지사항 제목새로운 고정된 공지사항 제목새로운 고정된 공지사항 제목",
            desc : "문장입니다",
            date : "2026.07.09"
        },
        {
            new : true,
            fixed : true,
            title : "새로운 고정된 공지사항 제목새로운 고정된 공지사항 제목새로운 고정된 공지사항 제목새로운 고정된 공지사항 제목새로운 고정된 공지사항 제목새로운 고정된 공지사항 제목새로운 고정된 공지사항 제목새로운 고정된 공지사항 제목새로운 고정된 공지사항 제목새로운 고정된 공지사항 제목새로운 고정된 공지사항 제목새로운 고정된 공지사항 제목",
            desc : "문장입니다",
            date : "2026.07.09"
        },
        {
            new : true,
            fixed : true,
            title : "새로운 고정된 공지사항 제목새로운 고정된 공지사항 제목새로운 고정된 공지사항 제목새로운 고정된 공지사항 제목새로운 고정된 공지사항 제목새로운 고정된 공지사항 제목새로운 고정된 공지사항 제목새로운 고정된 공지사항 제목새로운 고정된 공지사항 제목새로운 고정된 공지사항 제목새로운 고정된 공지사항 제목새로운 고정된 공지사항 제목",
            desc : "문장입니다",
            date : "2026.07.09"
        },
        {
            new : true,
            fixed : true,
            title : "새로운 고정된 공지사항 제목새로운 고정된 공지사항 제목새로운 고정된 공지사항 제목새로운 고정된 공지사항 제목새로운 고정된 공지사항 제목새로운 고정된 공지사항 제목새로운 고정된 공지사항 제목새로운 고정된 공지사항 제목새로운 고정된 공지사항 제목새로운 고정된 공지사항 제목새로운 고정된 공지사항 제목새로운 고정된 공지사항 제목",
            desc : "문장입니다",
            date : "2026.07.09"
        },
        {
            new : true,
            fixed : true,
            title : "새로운 고정된 공지사항 제목새로운 고정된 공지사항 제목새로운 고정된 공지사항 제목새로운 고정된 공지사항 제목새로운 고정된 공지사항 제목새로운 고정된 공지사항 제목새로운 고정된 공지사항 제목새로운 고정된 공지사항 제목새로운 고정된 공지사항 제목새로운 고정된 공지사항 제목새로운 고정된 공지사항 제목새로운 고정된 공지사항 제목",
            desc : "문장입니다",
            date : "2026.07.09"
        },
        {
            new : true,
            fixed : true,
            title : "새로운 고정된 공지사항 제목새로운 고정된 공지사항 제목새로운 고정된 공지사항 제목새로운 고정된 공지사항 제목새로운 고정된 공지사항 제목새로운 고정된 공지사항 제목새로운 고정된 공지사항 제목새로운 고정된 공지사항 제목새로운 고정된 공지사항 제목새로운 고정된 공지사항 제목새로운 고정된 공지사항 제목새로운 고정된 공지사항 제목",
            desc : "문장입니다",
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

    <div :class="prefix + '--item--cover'" style="padding-top:16px;">
      <div
        :class="prefix + '--item'" style="padding:0 20px; display:flex; gap:8px; flex-direction:column;">
        <div
          v-for="(item, index) in noticeArray" :key="index"
          :class="prefix +'--item'" style="display:flex; border-radius:8px; padding:16px; flex-direction:column; background:#fff; gap:0;">
            <div :class="prefix +'--item-head'">
                <div :class="prefix +'--item-head'" style="display:flex; padding-bottom:8px; gap:6px;">
                    <div v-if="item.new === true" :class="prefix + '--ico-new'" style="width:20px; height:20px;">
                        <img src="/img/ico_new.png" alt="new">
                    </div>
                    <div v-if="item.fixed === true" :class="prefix + '--ico-pin'" style="width:20px; height:20px;">
                        <img src="/img/ico_pin.png" alt="pin">
                    </div>
                </div>                    
            </div>
            <div :class="prefix +'--item-body'" style="display:flex; gap:4px; flex-direction:column;">
                <div :class="prefix +'--item-body-tit'" style="font-weight:500; font-size:14px; line-height:21px; text-overflow: ellipsis; overflow: hidden; word-break: break-word; display: -webkit-box; -webkit-line-clamp: 2;-webkit-box-orient: vertical" >{{item.title}}</div>
                <div :class="prefix +'--item-body-date'" style="color:#666; font-weight:400; font-size:13px; line-height:19.5px;">{{item.date}}</div>
            </div>
        </div>
      </div>
    </div>    

  </section>

</template>

<style lang="scss">

</style>
