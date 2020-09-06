<template>
    <div class="navMenu height">
        <el-scrollbar style="height: 100%" class="height scrollbar">
            <el-menu
                    :router="true"
                    :collapse="isCollapse"
                    :collapse-transition="true"
                    :default-active="routerIndex"
                    unique-opened
                    mode="vertical"
                    class="el-menu-vertical-demo height"
                    background-color="#5093FC"
                    text-color="#fff">
                <el-menu-item class="mentHome" index="/index">
                    <i class="iconfont iconfeijifasong-"></i>
                    <template slot="title">
                        <span>首页</span>
                    </template>
                </el-menu-item>
                <!--                <el-menu-item index="/qqmap">-->
                <!--                    <i class="el-icon-s-promotion"></i>-->
                <!--                    <template slot="title">-->
                <!--                    <span>地图</span>-->
                <!--                    </template>-->
                <!--                </el-menu-item>-->

                <template  v-for="(item,index) in menuLists" >
                    <el-submenu    v-if="item.children.length > 0" :index="item.path">
                        <template slot="title">
                            <i class='iconfont' :class="item.imgUrl"></i>
                            <span>{{item.name}}</span>
                        </template>
                        <div v-for="(val,j) in item.children">
                            <el-submenu   class="second_level" v-if="val.children.length > 0" :index="val.path">
                                <div slot="title">
                                    <!--                                    <i class="el-icon-s-promotion"></i>-->
                                    {{val.name}}
                                </div>
                                <el-menu-item   class="third_level" v-for="(i,index2) in val.children" :key="index2" :index="i.path">
                                    {{i.name}}
                                </el-menu-item>
                            </el-submenu>
                            <el-menu-item  class="second_level" v-else :key="val.id" :index="val.path">
                                <template slot="title">
                                    <span>{{val.name}}</span>
                                </template>
                            </el-menu-item>
                        </div>
                    </el-submenu>
                    <el-menu-item  v-else  :key="item.id" :index="item.path">
                        {{item.name}}
                    </el-menu-item>
                </template>
            </el-menu>
        </el-scrollbar>
    </div>
</template>

<script>
    import menu from './amp.json'
    export default {
        name: 'NavMenu',
        data() {
            return {
                menuLists:[],
                nvaBarList: [],
            }
        },
        computed: {
            isCollapse() {
                return this.$store.state.sidebar
            },
            routerIndex() {
                return this.$route.path
            }
        },
        mounted() {
            // 刷新时以当前路由做为tab加入tabs
            var _t = this;
            if (_t.$route.name !== 'index' && _t.$route.name !== 'err') {
                // 非首页且非详情页
                _t.$store.commit('add_tabs', {route: '/index', title: '首页', name: 'index'});
                _t.$store.commit('add_tabs', {
                    route: _t.$route.path,
                    title: _t.$route.meta.title,
                    name: _t.$route.name
                });
                _t.$store.commit('set_active_index', _t.$route.name);
            } else {
                // 首页
                _t.$store.commit('add_tabs', {route: '/index', title: '首页', name: 'index'});
                _t.$store.commit('set_active_index', 'index');
            }
        },
        methods: {
            getNavbar() {
                var list = this.$router.options.routes.filter((item) => {
                    return !item.hidden
                });
                this.nvaBarList = list;
            },
            menuList() {

                //this.menuLists = JSON.parse(localStorage.getItem("DEVICE_MENU_LIST"));
                this.menuLists = menu;
            }
        },
        created() {
            this.$store.state.options = [];
            this.$store.state.activeIndex = '';
            this.menuList();
            this.getNavbar();
        }
    }
</script>

<style scoped="scoped">
    .el-menu-vertical-demo:not(.el-menu--collapse) {
        width: 225px;
        /*min-height: 400px;*/
    }

    body {
        height: 100%;
    }

    .height {
        /*height: 100%;*/
    }

    .navMenu {
        background:#5093FC;
        height: 100%;
        font-size: 15px;
    }

    .scrollbar {

    }
    .second_level {
        margin-left: 20px;
        overflow: initial !important;
    }
    .submenu_level {
        overflow: hidden;
    }
    .iconfont {
        margin-right: 5px;
        color: #fff;
        width: 11px;
        height: 11px;
        /*font-size: 16px;*/
    }

    /deep/ .el-menu {
        /*导航栏展开后子菜单宽度多出1px问题*/
        height: 100%;
        border-right-width: 0;
    }

    /deep/ .el-scrollbar {
        height: 100%;
    }


</style>
