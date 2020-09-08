import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../views/login'
import index from '../views/index'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
Vue.use(VueRouter)

const routes = [
    {path: '/', redirect: '/login', hidden: true},
    {path: '/login', name: 'login', component: login, hidden: true},
    {
        path: '/index', meta: {title: '首页'}, component: index,
        children: [
            {
                path: '/index', name: 'index', meta: {
                    title: '首页',
                    url: '/index'
                },
                component: () => import('../views/Home'),
            },

        ]
    },

    {
        path: '/system',
        name: 'system',
        meta: {title: '系统管理'},
        component: index,
        children: [
            {path: 'roleManagement', name: 'roleManagement', meta: {title: '角色管理'}, component: () => import('../views/system/roleManagement'),},
            {path: 'userManagement', name: 'userManagement', meta: {title: '用户管理'}, component: () => import('../views/system/userManagement') ,},
            {path: 'menuManagement', name: 'menuManagement', meta: {title: '菜单管理'}, component: () => import('../views/system/menuManagement'),},
            {
                path: '/demo',
                name: 'demo',
                meta: {
                    title: 'demo',

                },
                component: () => import('../views/demo'),
            },

        ]
    },
]

const router = new VueRouter({
    mode: 'hash',
    base: process.env.BASE_URL,
    routes
})

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
export default router
