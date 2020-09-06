<template>
    <div  class="loadings">
        <div class="loading-content">
            <div class="loading-spinner"></div>
            <p class="loading-text">初始化中，请稍后 <span class="shadow_dot"></span></p>
        </div>
    </div>
</template>

<script>
    export default {
        name: "index",
        data() {
            return {}
        },
        components: {},
        mounted() {
        },
        methods: {
            getData() {
                // 查询
            }
        },
        created() {
            this.$cookies.set('token','123456')
            this.getData()
        }
    }
</script>

<style scoped>
    .loadings {
        display: flex;
        justify-content: center;
        align-items: center;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        height: 100%;
        width: 100%;
        background:rgba(0,0,0,.6);
        z-index: 9999;
    }
    .loading-content {
        text-align: center;
        box-sizing: border-box;
        background:rgba(255,255,255,1);
        border-radius:12px;
        padding: 32px 7px 22px 7px;
        height: 220px;
        width: 220px;
        cursor: pointer;
    }
    .loading-content .loading-spinner {
        background: url("../../assets/img/loading.gif");
        background-size: cover;
        width: 206px;
        height: 111px;
    }
    .loading-text {
        margin-top: 22px;
        font-size:17px;
        font-weight:600;
        color:rgba(153,153,153,1);
        line-height:28px;
    }

    .shadow_dot {
        display: inline-block;
        width: 4px;
        height: 4px;
        margin-left: -5px;
        border-radius: 3px;
        box-shadow: 4px 0 currentColor, 11px 0 currentColor, 18px 0 currentColor;
        -webkit-animation: shadow_dot 4s infinite step-start both;
        animation: shadow_dot 4s infinite step-start both;
        *zoom: expression(this.innerHTML = '...'); /* IE7 */
    }
    .shadow_dot:before { content: '. . .';} /* IE8 */
    .shadow_dot::before { content: ' '; }
    .shadow_dot { margin-right: 8px; } /* IE9+,FF,CH,OP,SF */

    @-webkit-keyframes shadow_dot {
        25% { box-shadow: none; }
        50% { box-shadow: 4px 0 currentColor; }
        75% { box-shadow: 4px 0 currentColor, 11px 0 currentColor; }
    }
    @keyframes shadow_dot {
        25% { box-shadow: none; }
        50% { box-shadow: 4px 0 currentColor; }
        75% { box-shadow: 4px 0 currentColor, 11px 0 currentColor; }
    }
</style>