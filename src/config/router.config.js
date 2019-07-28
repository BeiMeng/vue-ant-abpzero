// eslint-disable-next-line
import { UserLayout, BasicLayout, RouteView, BlankLayout, PageView } from '@/layouts'
import { bxAnaalyse } from '@/core/icons'


//注意事項
//1.路由的name名称必须与组件或页面的name属性相同，否则缓存无效
//2.有tab标签情况下，keepAlive默认为true,即页面全部缓存
//3.
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
        meta: { title: '首页', keepAlive: true, icon: bxAnaalyse, permission: [ 'Pages.Tenant.Dashboard' ] },
        children: [
          {
            path: '/dashboard/analysis',
            name: 'dashboard_analysis',
            hiddenHeaderContent:true,
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
        meta: { title: '系统管理', keepAlive: true, icon: bxAnaalyse, permission: [ 'Pages.Administration' ] },
        children: [
          {
            path: '/admin/user',
            name: 'admim_user',
            component: () => import('@/views/app/admin/User'),
            meta: { title: '用户管理', keepAlive: true, icon: 'user', permission: [ 'Pages.Administration.Users' ] }
          },
          {
            path: '/admin/role',
            name: 'admim_role',
            component: () => import('@/views/app/admin/Role'),
            meta: { title: '角色管理', keepAlive: true, icon: 'team', permission: [ 'Pages.Administration.Roles' ] }
          },
          {
            path: '/admin1',
            name: 'admin1',
            redirect: '/admin1/test',
            component: PageView,
            meta: { title: '系统管理1', keepAlive: true, icon: bxAnaalyse, permission: [ 'Pages.Administration' ] },
            children: [
              {
                path: '/admin/test',
                name: 'admin_test',
                component: () => import('@/views/app/admin/Test'),
                meta: { title: '用户管理1', keepAlive: true, icon: 'user', permission: [ 'Pages.Administration.Users' ] }
              },
              {
                path: '/admin/test1',
                name: 'admin_test1',
                component: () => import('@/views/app/admin/Test1'),
                meta: { title: '角色管理2', keepAlive: true, icon: 'team', permission: [ 'Pages.Administration.Roles' ] }
              }          
            ]
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
