import { asyncRouterMap, constantRouterMap } from '@/config/router.config'
import { PermissionCheckerService } from '@/abpZero/abp-vue-module/auth/permission-checker.service';
let _permission=new PermissionCheckerService();


import { UserLayout, BasicLayout, RouteView, BlankLayout, PageView } from '@/layouts'
import { bxAnaalyse } from '@/core/icons'
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

//根据后端返回的菜单动态生成路由
let rootCode='0000'; //顶级菜单编码
function createAsyncRouterMap(allMenus){
  let obj=createTree(allMenus,rootCode);
  let asyncRouterMapServer = [
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
          meta: { title: '首页', keepAlive: true, icon: 'home'},
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
      ]
    },
    {
      path: '*', redirect: '/404', hidden: true
    }
  ];
  obj.routers.forEach(element => {
    asyncRouterMapServer[0].children.push(element);
  });
  return asyncRouterMapServer; //从后端返回的菜单配置动态生成路由
}
function createTree(array,parentIdValue){
  let tree = [];
  let routers = [];
  let parentIdProperty='parentCode'; 
  let idProperty='menuCode'; 
   let childrenProperty='children';
  let nodes = _.filter(array, [parentIdProperty, parentIdValue]);

  _.forEach(nodes, node => {
      let d=new Object();
      d=_.cloneDeep(node);
      let obj=createTree(
        array,
        d[idProperty]
      )
      let children=obj.tree;
      let item;
      if(d.menuType==1){   //非页面,上级菜单路由配置
        item={
          path: `/${d.menuUrl}`,
          name: d.menuUrl,
          component: d.parentCode==rootCode?PageView:null,   //null 非页面且非顶级菜单
          meta: { title:d.menuName, keepAlive: true, icon: d.icon, permission: [ d.permission ] },
        }
      }else{  //页面
        let strArr=d.menuUrl.split('/');          
        if(d.parentCode==rootCode){   //顶级页面，与首页同一层级的路由配置
          item={
            path: `/${strArr[strArr.length-2]}/${strArr[strArr.length-1]}`,
            name: `${strArr[strArr.length-2]}_${strArr[strArr.length-1]}`,
            component: PageView,
            redirect: `/${strArr[strArr.length-2]}/${strArr[strArr.length-1]}`,   //必须设置redirect 点击tab才能对应到左侧菜单项
            hideChildrenInMenu: true, //设置子项隐藏
            meta: { title:d.menuName, keepAlive: true, icon: d.icon, permission: [ d.permission ] },
            children: [
              {
                path: `/${strArr[strArr.length-2]}/${strArr[strArr.length-1]}`,
                name: `${strArr[strArr.length-2]}_${strArr[strArr.length-1]}`,
                component: () => import(`@/views/app/${d.menuUrl}`),
                meta: { title:d.menuName, keepAlive: true}
              }
            ]
          }          
        }else{   //页面路由配置
          item={
            path: `/${strArr[strArr.length-2]}/${strArr[strArr.length-1]}`,
            name: `${strArr[strArr.length-2]}_${strArr[strArr.length-1]}`,
            component: () => import(`@/views/app/${d.menuUrl}`),
            //component: resolve => require([`@/views/app/${d.menuUrl}`], resolve),
            meta: { title:d.menuName, keepAlive: true, icon: d.icon, permission: [ d.permission ] }
          }
        }
      }
      d[childrenProperty] = children
      if(children.length>0){
        item[childrenProperty]=obj.routers
      }      
      tree.push(d);
      routers.push(item);  
  });

  return {tree,routers};
}






let menus=[
  {"menuId":99,"permission":"Pages.Tenants","menuCode":"1111","menuName":"租户管理","menuUrl":"admin/Tenant","menuType":2,"parentCode":"0000","isEnabled":1,"icon":"appstore","subMenu":null},
  // {"menuId":1,"menuCode":"1000","menuName":"节目源","menuUrl":"program","menuType":1,"parentCode":"0000","isEnabled":1,"icon":"appstore","subMenu":null},
  // {"menuId":2,"menuCode":"100001","menuName":"节目类型","menuUrl":"program/type","menuType":2,"parentCode":"1000","isEnabled":1,"icon":"user","subMenu":null},
  // {"menuId":4,"menuCode":"100002","menuName":"节目管理","menuUrl":"program/item","menuType":2,"parentCode":"1000","isEnabled":1,"icon":"user","subMenu":null},
  // {"menuId":6,"menuCode":"100004","menuName":"节目指南管理","menuUrl":"program/guide","menuType":2,"parentCode":"1000","isEnabled":1,"icon":"user","subMenu":null},
  // {"menuId":10,"menuCode":"1001","menuName":"套餐订阅","menuUrl":"package","menuType":1,"parentCode":"0000","isEnabled":1,"icon":"star","subMenu":null},
  // {"menuId":13,"menuCode":"100101","menuName":"套餐管理","menuUrl":"package/pmanage","menuType":2,"parentCode":"1001","isEnabled":1,"icon":"user","subMenu":null},
  // {"menuId":14,"menuCode":"100102","menuName":"套餐订购","menuUrl":"package/porder","menuType":2,"parentCode":"1001","isEnabled":1,"icon":"user","subMenu":null},
  // {"menuId":16,"menuCode":"100103","menuName":"销售统计","menuUrl":"package/sales","menuType":2,"parentCode":"1001","isEnabled":1,"icon":"user","subMenu":null},
  // {"menuId":17,"menuCode":"1003","menuName":"广告管理","menuUrl":"advert","menuType":1,"parentCode":"0000","isEnabled":1,"icon":"link","subMenu":null},
  // {"menuId":18,"menuCode":"100301","menuName":"启动页广告","menuUrl":"advert/adlaunch","menuType":2,"parentCode":"1003","isEnabled":1,"icon":"user","subMenu":null},
  // {"menuId":19,"menuCode":"100302","menuName":"映前广告","menuUrl":"advert/adstart","menuType":2,"parentCode":"1003","isEnabled":1,"icon":"user","subMenu":null},
  // {"menuId":21,"menuCode":"100303","menuName":"映中广告","menuUrl":"advert/adcenter","menuType":2,"parentCode":"1003","isEnabled":1,"icon":"user","subMenu":null},
  // {"menuId":22,"menuCode":"100304","menuName":"广告播放统计","menuUrl":"advert/adreport","menuType":2,"parentCode":"1003","isEnabled":1,"icon":"user","subMenu":null},
  {"menuId":23,"permission":"Pages.Administration","menuCode":"1004","menuName":"系统配置","menuUrl":"admin","menuType":1,"parentCode":"0000","isEnabled":1,"icon":"setting","subMenu":null},
  {"menuId":24,"permission":"Pages.Administration.Users","menuCode":"100401","menuName":"用户管理","menuUrl":"admin/User","menuType":2,"parentCode":"1004","isEnabled":1,"icon":"user","subMenu":null},
  {"menuId":25,"permission":"Pages.Administration.Roles","menuCode":"100402","menuName":"角色管理","menuUrl":"admin/Role","menuType":2,"parentCode":"1004","isEnabled":1,"icon":"user","subMenu":null},
  // {"menuId":26,"menuCode":"100403","menuName":"信源分区配置","menuUrl":"admin/signal","menuType":2,"parentCode":"1004","isEnabled":1,"icon":"user","subMenu":null},
  // {"menuId":27,"menuCode":"100404","menuName":"节目源码率配置","menuUrl":"admin/source","menuType":2,"parentCode":"1004","isEnabled":1,"icon":"user","subMenu":null},
  // {"menuId":30,"menuCode":"100406","menuName":"多级菜单","menuUrl":"admin_test","menuType":1,"parentCode":"1004","isEnabled":1,"icon":"user","subMenu":null},  
  // {"menuId":32,"menuCode":"10040601","menuName":"多级菜单1","menuUrl":"admin/test/test","menuType":2,"parentCode":"100406","isEnabled":1,"icon":"user","subMenu":null},
  // {"menuId":33,"menuCode":"10040602","menuName":"多级菜单2","menuUrl":"admin/test/test1","menuType":2,"parentCode":"100406","isEnabled":1,"icon":"user","subMenu":null},  
  // {"menuId":28,"menuCode":"100405","menuName":"移动端系统升级配置","menuUrl":"admin/app","menuType":2,"parentCode":"1004","isEnabled":1,"icon":"user","subMenu":null}
]

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
        let allAsyncRouterMap=createAsyncRouterMap(menus); 
        console.log(allAsyncRouterMap);       
        //let allAsyncRouterMap=asyncRouterMap;
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
