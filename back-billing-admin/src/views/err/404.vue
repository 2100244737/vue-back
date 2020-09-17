<template>
    <div class="text">
        404 找不到此页面
        <el-button class="blueBtn" @click="backhandle">返回首页</el-button>
    </div>
</template>

<script>
    export default {
        name: "page404",
        data () {
            return {}
        },
        components: {},
        mounted () {
        },
        methods: {
            getData () {
                // 查询
            },
            backhandle () {
                this.$router.replace('/index')
            }
        },
        created () {

            this.getData()
        }
    }
</script>

<style scoped>
.text {
    color: red;
}
</style>