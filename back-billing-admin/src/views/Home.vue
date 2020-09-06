<template>
  <div class="comtent">
    <img class="theme-img" src="../assets/img/ikon-home.png" alt="">
    <h1 class="slogan">欢迎使用 联网收费业务处理终端管理系统</h1>
  </div>
</template>
<script>
  export default {
    name: 'home',
    methods: {

    },
    created() {
      this.$store.commit('set_loading', false);
    }
  }
</script>
<style scoped>
  .comtent {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    height: calc(100vh - 160px);
    width: 100%;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 0px 11px 5px rgba(227, 227, 227, 0.5);
    border-radius: 10px;
  }

  .theme-img {
    display: inline-block;
    width:38vw;
    height: 55vh;
  }
  .theme {
    width: 671px;
    height: 619px;
    box-sizing: border-box;
    margin: 0 auto;
  }
  .slogan {
    display: inline-block;
    height:21px;
    margin-top: 52px;
    font-size:36px;
    font-weight:600;
    color:rgba(56,67,118,1);
    line-height:21px;
  }

</style>

