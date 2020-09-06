<template>
    <el-breadcrumb class="app-breadcrumb" separator=">">

        <el-breadcrumb-item  :to="{ path: '/index' }"> <span :class="pathUrl =='/index'?'dot-bg':'dot'"></span> <span :class="pathUrl=='/index'?'home-bg':'home'">首页</span></el-breadcrumb-item>
        <el-breadcrumb-item v-for="(item, index) in getBreadcrumb" :key="index">
            <span :class="pathUrl == item.path?'dot-bg':'dot'"></span> <span :class="pathUrl== item.path?'home-bg':'home'">{{item.meta.title}}</span>
        </el-breadcrumb-item>
    </el-breadcrumb>
</template>

<script>
    export default {
        name: "Breadcrumb",
        data() {
            return {
                pathUrl: this.$route.path
            }
        },
        components: {},
        computed: {
            getBreadcrumb() {
                return this.$route.matched.filter(item => item.meta && item.meta.title && item.meta.title !== '首页'&& item.meta.title !== 'err');
            }
        },
        watch: {
            $route(to, from) {
                this.pathUrl = this.$route.path
            }
        },
        mounted() {
        },
        methods: {
            getData() {
                // 查询
            }
        },
        created() {
            this.getData()
        }
    }
</script>

<style scoped>
    .dot {
        display: inline-block;
        width:8px;
        height:8px;

        border-radius: 50px;
        background:rgba(224,224,224,1);
    }
    .dot-bg {
        display: inline-block;
        width:8px;
        height:8px;
        border-radius: 50px;

        background:linear-gradient(270deg,rgba(137,215,248,1) 0%,rgba(80,147,252,1) 100%);
        box-shadow:0px 0px 4px 0px rgba(134,211,248,0.5);
    }
    .app-breadcrumb  {
        display: inline-block;
        font-size: 16px;
        margin-left: 8px;
        text-align: center;
        padding-bottom: 5px;
        margin-bottom: 20px;
    }
    .home-bg {
        font-weight: 600;
        color:rgba(80,147,252,1);
    }
    .home {
        color:rgba(154,157,175,1);
        font-weight: 600;
    }

</style>
