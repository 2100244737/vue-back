import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI);

Vue.config.productionTip = false
import 'normalize.css/normalize.css';
// 引入自定义element 样式
import './assets/css/element.css';
// 引入自定义 全局样式
import './assets/css/customized.css';
// 引入全局样式
import './assets/css/global.css';

// 设置cookie
import vueCookie from 'vue-cookies'
// 引入vuex
import {store} from './uitls/vuex';
// 引入axios 接口
import axios from './uitls/axios';
Vue.prototype.$api = axios;
// 全局错误提示方法
Vue.prototype.alertDialogTip = (name, message) => {
    name.$alert(message, '温馨提示', {
        confirmButtonText: '确定',
    }).then(() => {
        return false;
    });
};
// 全局成功提示方法
Vue.prototype.alertMessageTip = (name, message) => {
    name.$message({
        message: message,
        type: 'success',
        offset: 150
    });
};
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
Vue.prototype.NProgress = NProgress
NProgress.inc(0.2);
NProgress.configure({
    minimum: 0.3
});
// 页面进度条
router.beforeEach((to, from, next) => {
    NProgress.start();
    next()
});

router.afterEach(transition => {
    NProgress.done();
});

Vue.use(vueCookie);

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
