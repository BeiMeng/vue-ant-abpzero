// eslint-disable-next-line
import { UserLayout, BasicLayout, RouteView, BlankLayout, PageView } from '@/layouts'
import { bxAnaalyse } from '@/core/icons'

//默认有tab标签，keepAlive失效
export const asyncRouterMap = [
  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: { title: '首页' },
    redirect: '/dashboard/analysis',
    children: [
      // dashboard
      {
        path: '/dashboard',
        name: 'dashboard',
        redirect: '/dashboard/analysis',
        component: RouteView,
        hideChildrenInMenu: true, //设置子项隐藏
        meta: { title: '首页', keepAlive: true, icon: bxAnaalyse, permission: [ 'Pages.Tenant.Dashboard' ] },
        children: [
          {
            path: '/dashboard/analysis',
            name: 'Analysis',
            component: () => import('@/views/app/dashboard/Analysis'),
            meta: { title: '首页', keepAlive: false, permission: [ 'Pages.Tenant.Dashboard' ] }
          },
          // 外部链接
          {
            path: 'https://www.baidu.com/',
            name: 'Monitor',
            meta: { title: '监控页（外部）', target: '_blank' }
          },
          {
            path: '/dashboard/workplace',
            name: 'Workplace',
            component: () => import('@/views/demo/dashboard/Workplace'),
            meta: { title: '工作台', keepAlive: true, permission: [ 'dashboard' ] }
          }
        ]
      },

      // admin
      {
        path: '/admin',
        name: 'admin',
        redirect: '/admin/user',
        component: PageView,
        meta: { title: '系统管理', keepAlive: false, icon: bxAnaalyse, permission: [ 'Pages.Administration' ] },
        children: [
          {
            path: '/admin/user',
            name: 'User',
            component: () => import('@/views/app/admin/User'),
            meta: { title: '用户管理', keepAlive: false, icon: 'user', permission: [ 'Pages.Administration.Users' ] }
          }
        ]
      },

    ]
  },
  {
    path: '*', redirect: '/404', hidden: true
  }
]
/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "user" */ '@/views/account/Login')
      },
      {
        path: 'register',
        name: 'register',
        component: () => import(/* webpackChunkName: "user" */ '@/views/demo/user/Register')
      },
      {
        path: 'register-result',
        name: 'registerResult',
        component: () => import(/* webpackChunkName: "user" */ '@/views/demo/user/RegisterResult')
      }
    ]
  },

  {
    path: '/test',
    component: BlankLayout,
    redirect: '/test/home',
    children: [
      {
        path: 'home',
        name: 'TestHome',
        component: () => import('@/views/demo/Home')
      }
    ]
  },

  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/shared/exception/404')
  }

]
