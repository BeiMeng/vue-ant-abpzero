import { asyncRouterMap, constantRouterMap } from '@/config/router.config'
import { PermissionCheckerService } from '@/abpZero/abp-vue-module/auth/permission-checker.service';
let _permission=new PermissionCheckerService();


import { UserLayout, BasicLayout, RouteView, BlankLayout, PageView } from '@/layouts'

 // demo
let demoRouterMap={
  path: '/demo',
  name: 'demo',
  redirect: '/form/base-form',
  component: PageView,
  meta: { title: '示例页面', keepAlive: true, icon: 'bulb'},
  children: [
      // forms
      {
        path: '/form',
        redirect: '/form/base-form',
        component: null,
        meta: { title: '表单页', icon: 'form' },
        children: [
          {
            path: '/form/base-form',
            name: 'BaseForm',
            component: () => import('@/views/demo/form/BasicForm'),
            meta: { title: '基础表单', keepAlive: true }
          },
          {
            path: '/form/step-form',
            name: 'StepForm',
            component: () => import('@/views/demo/form/stepForm/StepForm'),
            meta: { title: '分步表单', keepAlive: true }
          },
          {
            path: '/form/advanced-form',
            name: 'AdvanceForm',
            component: () => import('@/views/demo/form/advancedForm/AdvancedForm'),
            meta: { title: '高级表单', keepAlive: true}
          }
        ]
      },

      // Exception
      {
        path: '/exception',
        name: 'exception',
        component: null,
        redirect: '/exception/403',
        meta: { title: '异常页', icon: 'warning'},
        children: [
          {
            path: '/exception/403',
            name: 'Exception403',
            component: () => import(/* webpackChunkName: "fail" */ '@/views/shared/exception/403'),
            meta: { title: '403' }
          },
          {
            path: '/exception/404',
            name: 'Exception404',
            component: () => import(/* webpackChunkName: "fail" */ '@/views/shared/exception/404'),
            meta: { title: '404'}
          },
          {
            path: '/exception/500',
            name: 'Exception500',
            component: () => import(/* webpackChunkName: "fail" */ '@/views/shared/exception/500'),
            meta: { title: '500' }
          }
        ]
      },
      // list
      {
        path: '/list',
        name: 'list',
        component: null,
        redirect: '/list/table-list',
        meta: { title: '列表页', icon: 'table' },
        children: [
          {
            path: '/list/table-list/:pageNo([1-9]\\d*)?',
            name: 'TableListWrapper',
            hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
            component: () => import('@/views/demo/list/TableList'),
            meta: { title: '查询表格', keepAlive: true}
          },
          {
            path: '/list/basic-list',
            name: 'BasicList',
            component: () => import('@/views/demo/list/StandardList'),
            meta: { title: '标准列表', keepAlive: true }
          },
          {
            path: '/list/card',
            name: 'CardList',
            component: () => import('@/views/demo/list/CardList'),
            meta: { title: '卡片列表', keepAlive: true}
          },
          {
            path: '/list/search',
            name: 'SearchList',
            component: () => import('@/views/demo/list/search/SearchLayout'),
            redirect: '/list/search/article',
            meta: { title: '搜索列表', keepAlive: true },
            children: [
              {
                path: '/list/search/article',
                name: 'SearchArticles',
                component: () => import('@/views/demo/list/search/Article'),
                meta: { title: '搜索列表（文章）'}
              },
              {
                path: '/list/search/project',
                name: 'SearchProjects',
                component: () => import('@/views/demo/list/search/Projects'),
                meta: { title: '搜索列表（项目）'}
              },
              {
                path: '/list/search/application',
                name: 'SearchApplications',
                component: () => import('@/views/demo/list/search/Applications'),
                meta: { title: '搜索列表（应用）'}
              }
            ]
          }
        ]
      },
      // profile
      {
        path: '/profile',
        name: 'profile',
        component: null,
        redirect: '/profile/basic',
        meta: { title: '详情页', icon: 'profile' },
        children: [
          {
            path: '/profile/basic',
            name: 'ProfileBasic',
            component: () => import('@/views/demo/profile/basic/Index'),
            meta: { title: '基础详情页' }
          },
          {
            path: '/profile/advanced',
            name: 'ProfileAdvanced',
            component: () => import('@/views/demo/profile/advanced/Advanced'),
            meta: { title: '高级详情页'}
          }
        ]
      },       
      // result
      {
        path: '/result',
        name: 'result',
        component: null,
        redirect: '/result/success',
        meta: { title: '结果页', icon: 'check-circle-o'},
        children: [
          {
            path: '/result/success',
            name: 'ResultSuccess',
            component: () => import(/* webpackChunkName: "result" */ '@/views/demo/result/Success'),
            meta: { title: '成功', keepAlive: false, hiddenHeaderContent: true}
          },
          {
            path: '/result/fail',
            name: 'ResultFail',
            component: () => import(/* webpackChunkName: "result" */ '@/views/demo/result/Error'),
            meta: { title: '失败', keepAlive: false, hiddenHeaderContent: true}
          }
        ]
      },
      // // account
      {
        path: '/account',
        component: null,
        redirect: '/account/center',
        name: 'account',
        meta: { title: '个人页', icon: 'user', keepAlive: true},
        children: [
          {
            path: '/account/center',
            name: 'center',
            component: () => import('@/views/demo/account/center/Index'),
            meta: { title: '个人中心', keepAlive: true}
          },
          {
            path: '/account/settings',
            name: 'settings',
            component: () => import('@/views/demo/account/settings/Index'),
            meta: { title: '个人设置', hideHeader: true },
            redirect: '/account/settings/base',
            hideChildrenInMenu: true,
            children: [
              {
                path: '/account/settings/base',
                name: 'BaseSettings',
                component: () => import('@/views/demo/account/settings/BaseSetting'),
                meta: { title: '基本设置', hidden: true }
              },
              {
                path: '/account/settings/security',
                name: 'SecuritySettings',
                component: () => import('@/views/demo/account/settings/Security'),
                meta: { title: '安全设置', hidden: true, keepAlive: true }
              },
              {
                path: '/account/settings/custom',
                name: 'CustomSettings',
                component: () => import('@/views/demo/account/settings/Custom'),
                meta: { title: '个性化设置', hidden: true, keepAlive: true }
              },
              {
                path: '/account/settings/binding',
                name: 'BindingSettings',
                component: () => import('@/views/demo/account/settings/Binding'),
                meta: { title: '账户绑定', hidden: true, keepAlive: true }
              },
              {
                path: '/account/settings/notification',
                name: 'NotificationSettings',
                component: () => import('@/views/demo/account/settings/Notification'),
                meta: { title: '新消息通知', hidden: true, keepAlive: true }
              }
            ]
          }
        ]
      },           
      // other
      {
        path: '/other',
        name: 'otherPage',
        component: null,
        meta: { title: '其他组件', icon: 'slack' },
        redirect: '/other/icon-selector',
        children: [
          {
            path: '/other/icon-selector',
            name: 'TestIconSelect',
            component: () => import('@/views/demo/other/IconSelectorView'),
            meta: { title: 'IconSelector', icon: 'tool', keepAlive: true }
          },
          {
            path: '/other/list',
            component: RouteView,
            meta: { title: '业务布局', icon: 'layout' },
            redirect: '/other/list/tree-list',
            children: [
              {
                path: '/other/list/tree-list',
                name: 'TreeList',
                component: () => import('@/views/demo/other/TreeList'),
                meta: { title: '树目录表格', keepAlive: true }
              },
              {
                path: '/other/list/edit-table',
                name: 'EditList',
                component: () => import('@/views/demo/other/TableInnerEditList'),
                meta: { title: '内联编辑表格', keepAlive: true }
              },
              {
                path: '/other/list/user-list',
                name: 'UserList',
                component: () => import('@/views/demo/other/UserList'),
                meta: { title: '用户列表', keepAlive: true }
              },
              {
                path: '/other/list/role-list',
                name: 'RoleList',
                component: () => import('@/views/demo/other/RoleList'),
                meta: { title: '角色列表', keepAlive: true }
              },
              {
                path: '/other/list/system-role',
                name: 'SystemRole',
                component: () => import('@/views/demo/role/RoleList'),
                meta: { title: '角色列表2', keepAlive: true }
              },
              {
                path: '/other/list/permission-list',
                name: 'PermissionList',
                component: () => import('@/views/demo/other/PermissionList'),
                meta: { title: '权限列表', keepAlive: true }
              }
            ]
          }
        ]
      }

  ]
}




/**
 * 过滤账户是否拥有某一个权限，并将菜单从加载列表移除
 *
 * @param permission
 * @param route
 * @returns {boolean}
 */
function hasPermission (permission, route) {
  if (route.meta && route.meta.permission) {
    // let flag = false
    // for (let i = 0, len = permission.length; i < len; i++) {
    //   flag = route.meta.permission.includes(permission[i])
    //   if (flag) {
    //     return true
    //   }
    // }
    // return false
    return _permission.isGrantedAny(route.meta.permission);
  }
  return true
}

/**
 * 单账户多角色时，使用该方法可过滤角色不存在的菜单
 *
 * @param roles
 * @param route
 * @returns {*}
 */
// eslint-disable-next-line
function hasRole(roles, route) {
  if (route.meta && route.meta.roles) {
    return route.meta.roles.includes(roles.id)
  } else {
    return true
  }
}

function filterAsyncRouter (routerMap, permissionList) {
  const accessedRouters = routerMap.filter(route => {
    if (hasPermission(permissionList, route)) {
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children, permissionList)
      }
      return true
    }
    return false
  })
  return accessedRouters
}

//路由转换,将component为null的所有component不为null的下级转换到其平级，并删除
function warpAsyncRouters(routerMap){
  let route=routerMap.filter(p=>p.path=='/');
  if(route.length==0){
    console.error('路由定义错误,未按照约定规则定义！');
  }
  let menuRouters=route[0].children;
  let parent=null;
  childWarp(menuRouters,parent);

  function childWarp(routers,parent){
    for (let index = 0; index < routers.length; index++) {
      const element = routers[index];
      if(element.hasOwnProperty('component') && element.component==null && parent!=null){
        let d=pageChildWarp(element);
        if(d!=null){
          parent.children=parent.children.concat(d);
          _.pull(parent.children, element)
        }else{
          return
        }   
      }else if(element.children && element.children.length>0){
        parent=element;
        childWarp(element.children,parent)
      }else{
        continue
      }
    }

    function pageChildWarp(element){
      let list=[];
      if(element.children && element.children.length>0){
        for (let index = 0; index < element.children.length; index++) {
          const item = element.children[index];
          if(item.component!=null){
            list.push(item);
          }else{
            let d= pageChildWarp(item);
            if(d!=null){
              list=list.concat(d);
            }
          }
        }
        return list;
      }else{
        return null;
      }
    }
  }
}



const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: [],
    hasAddRouters:false,
    menus:[]
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.menus = routers
      let cloneRouters=_.cloneDeep(routers);
      warpAsyncRouters(cloneRouters);   //有component为null的多级菜单进行真实路由转换
      state.addRouters = cloneRouters
      state.routers = constantRouterMap.concat(cloneRouters)
      state.hasAddRouters=true
    }
  },
  actions: {
    GenerateRoutes ({ commit }, data) {
      return new Promise(resolve => {
        const { permissionList } = data        
        let allAsyncRouterMap=asyncRouterMap;
        if(process.env.NODE_ENV !== 'production'){    //开发环境加载demo页面
          allAsyncRouterMap[0].children.push(demoRouterMap)
        }        
        const accessedRouters = filterAsyncRouter(allAsyncRouterMap, permissionList)
        commit('SET_ROUTERS', accessedRouters)
        resolve()
      })
    }
  }
}

export default permission
