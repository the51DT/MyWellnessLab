<script>
export default {
  name: 'NoticeDetail',
  data () {
    return {
      prefix: 'NoticeDetail', /* 231215 클래스 접두어 */ 
    }
  },
  methods: {   

  },
}

</script>

<template>
  <section :class="prefix">
    <div :class="prefix + '--top'">
      <div :class="prefix + '--tit'">고정된 공지사항입니다 고정된 공지사항입니다 공지사항 제목 두 줄 케이스</div>
      <div :class="prefix + '--date'">2026.04.02</div>
    </div>
    <div :class="prefix + '--content'">
      공지사항 내용입니다.<br><br>
      Lorem ipsum, dolor sit amet consectetur adipisicing elit. Et deleniti repellendus perferendis assumenda dolore suscipit blanditiis neque mollitia necessitatibus, quasi iste est eaque rerum molestiae porro deserunt, culpa eum accusamus!<br><br>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure, aliquam necessitatibus. Praesentium aperiam dolorum, doloremque officiis quia alias sed earum, repudiandae, maxime molestias quos quaerat reprehenderit. Excepturi ab placeat veniam.<br><br>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi assumenda eius consequuntur, vel praesentium, incidunt vitae deleniti a atque temporibus, tempore veritatis quos delectus commodi enim. Excepturi dolorum inventore nostrum!<br><br>
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sint ducimus provident cupiditate at voluptates accusamus voluptatem. Tempora fugiat minus nisi, hic, ratione voluptatum earum quod aut veniam aliquid impedit dicta.<br><br>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore quaerat itaque omnis earum, placeat ipsam quas alias error, enim aspernatur perspiciatis aperiam voluptatibus. Officia expedita sit reiciendis esse? Cumque, nulla!<br><br>
      Lorem, ipsum dolor sit amet consectetur adipisicing elit. Atque reiciendis nihil officia consequuntur similique natus id dicta doloribus, sed quis esse temporibus error obcaecati necessitatibus quas veritatis nam earum magnam.<br><br>
      Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nostrum at ad nisi quam atque voluptatibus doloribus corporis enim distinctio saepe facere pariatur molestias minima, repellendus ipsa cupiditate maxime sunt exercitationem?<br><br>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae excepturi minus repellendus mollitia veniam nesciunt consequuntur nulla a suscipit aut, architecto animi necessitatibus laborum ea dolor dolorum odit nisi nemo.<br><br>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Perferendis voluptatem nulla fuga saepe eos odit nisi sapiente. Consequuntur dolore error veritatis? Nesciunt a dolore itaque! Earum dolore ullam placeat. Illum.
    </div>
  </section>
</template>

<style lang="scss">

</style>
