<template>
<!--    封装弹框-->
    <div>
        <el-dialog
                :title="title"
                :visible.sync="visible"
                append-to-body
                :width = 'width'
                :top ='top'
                :close-on-click-modal="true"
                :close-on-press-escape="false"
                :before-close="cancel">
            <div slot="title" class="dialogTitle" v-if="!title">
                <slot name="title"></slot>
            </div>
            <slot name="content"></slot>
            <div slot="footer">
                <el-button class="redTableBtn" @click="cancel">取消</el-button>
                <el-button class="blueTableBtn"  @click="add">保存</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "formDialog",
        props: {
            dialogFlag: {
                default: false
            },
            title: {
                type: String,
                default: ''
            },
            width: {
                type: String,
                default: ''
            },
            top: {
                type: String,
                default: '15vh'
            },
        },
        data() {
            return {
                visible: false
            };
        },
        components: {},
        mounted() {
        },
        watch: {
            dialogFlag() {
                this.visible = this.dialogFlag;
            },
        },
        methods: {
            add() {
                this.$emit("add", false);
            },
            cancel () {
                this.$emit("cancel", false);
            }
        },
        created() {

        }
    }
</script>

<style scoped>

</style>