import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../views/login'
import index from '../views/index'
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

        ]
    },
]

const router = new VueRouter({
    mode: 'hash',
    base: process.env.BASE_URL,
    routes
})

export default router
