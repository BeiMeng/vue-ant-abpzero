import { asyncRouterMap, constantRouterMap } from '@/config/router.config'
import { PermissionCheckerService } from '@/abpZero/abp-vue-module/auth/permission-checker.service';
let _permission=new PermissionCheckerService();
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

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: [],
    hasAddRouters:false
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
      state.hasAddRouters=true
    }
  },
  actions: {
    GenerateRoutes ({ commit }, data) {
      return new Promise(resolve => {
        const { permissionList } = data
        const accessedRouters = filterAsyncRouter(asyncRouterMap, permissionList)
        commit('SET_ROUTERS', accessedRouters)
        resolve()
      })
    }
  }
}

export default permission
