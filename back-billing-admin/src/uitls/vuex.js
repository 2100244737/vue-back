//引入vue和Vuex
import Vue from 'vue'
import Vuex from 'vuex'
//引入之后，对vuex进行引用
import Cookies from 'vue-cookies'
Vue.use(Vuex);
//创建且声明一个对象
export const store = new Vuex.Store({
    state: {
        options: [], // 缓存页面路由集合(页签集合)
        activeIndex: '', // tab当前页面
        loading: true, // loading 等待
        sidebar: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : false,
    },
    computed: {},
    mutations: {
        toggleSideBar (state,data) {
            state.sidebar = !state.sidebar
            if (state.sidebar) {
                Cookies.set('sidebarStatus', 1)
            } else {
                Cookies.set('sidebarStatus', 0)
            }
        },

        set_loading(state, data) {
            // loading状态
            state.loading = data
        },
        setShow(state, value) {
            state.disabledShow = value
        },
        // 置空options和activeIndex
        resetState(state, value) {
            if (value) {
                state.options = [];
                state.activeIndex = '';
            }
        },
        // 添加tabs
        add_tabs(state, data) {
            var _t = this;
            _t.state.options.push(data);
            if (_t.state.options.length <= 8) {
                // 删除下标为 1 的 作用: 一直加,加到最多时删除 除首页之外的第一项
                // _t.state.options.push(data);
                // if (_t.state.options.length == '3') {
                //   MessageBox.alert('标签页数量到达最大值!请关闭其他标签!');
                // }
            }
        },
        // 删除全部
        deleteAll(state, val) {
            this.state.options = [];
            this.state.options.push(val)
        },
        // 删除tabs
        delete_tabs(state, name) {
            var _t = this;
            let index = 0;
            for (let option of state.options) {
                if (option.name === name) {
                    break;
                }
                index++;
            }
            _t.state.options.splice(index, 1);
        },
        // 设置当前激活的tab
        set_active_index(state, index) {
            var _t = this;
            _t.state.activeIndex = index;
        },
    }
})
