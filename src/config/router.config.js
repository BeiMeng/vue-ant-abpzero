// eslint-disable-next-line
import { UserLayout, BasicLayout, RouteView, BlankLayout, PageView } from '@/layouts'
import { bxAnaalyse } from '@/core/icons'





//注意事項
//1.路由的name名称必须与组件或页面的name属性相同，否则缓存无效
//2.多级菜单的component 为null(为了避免多次嵌套路由，导致keepAlive 失效问题)
//3.所有的页面路由全部定义在path为'/' 的children 下
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
        component: PageView,
        hideChildrenInMenu: true, //设置子项隐藏
        meta: { title: '首页', keepAlive: true, icon: bxAnaalyse},
        children: [
          {
            path: '/dashboard/analysis',
            name: 'dashboard_analysis',
            hiddenHeaderContent:true,
            component: () => import('@/views/app/dashboard/Analysis'),
            meta: { title: '首页', keepAlive: false,noClosable:true, hiddenHeaderContent: true }
          }
        ]
      },
      {
        path: '/quote',
        name: 'quote',
        redirect: '/sell/quote',
        component: PageView,
        hideChildrenInMenu: true, //设置子项隐藏
        meta: { title: '报价单', keepAlive: true, icon: bxAnaalyse },
        children: [
          {
            path: '/sell/quote',
            name: 'sell_quote',
            component: () => import('@/views/app/sell/Quote'),
            meta: { title: '报价单', keepAlive: true}
          }
        ]
      }

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
