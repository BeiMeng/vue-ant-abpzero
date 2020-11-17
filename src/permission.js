//import Vue from 'vue'
import router from './router'
import store from './store'

import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
//import notification from 'ant-design-vue/es/notification'
import { setDocumentTitle, domTitle } from '@/utils/domUtil'
//import { ACCESS_TOKEN } from '@/store/mutation-types'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['login', 'register', 'registerResult'] // no redirect whitelist
import { LocalStorageService } from '@/abpZero/shared/common/localStorage.Service'
import { TokenService } from '@/abpZero/abp-vue-module/auth/token.service'
let _tokenService = new TokenService()
let _localStorageService = new LocalStorageService()

router.beforeEach((to, from, next) => {
  NProgress.start() // start progress bar
  to.meta && (typeof to.meta.title !== 'undefined' && setDocumentTitle(`${to.meta.title} - ${domTitle}`))
  const token = _tokenService.getToken();;
  if (token) {
    _localStorageService.getItem('userInfo', function (err, value) {
      if(value!=null)
      {
          store.dispatch('init',value);
      }
      /* has token */
      if (to.path === '/user/login') {
        next({ path: '/' })
        NProgress.done()
      } else {
          if(store.state.permission.hasAddRouters){
            if(to.meta.keepAlive){
              store.dispatch('addCachedView', to);
            }          
            next()
          }else{
            const permissionList = abp.auth.grantedPermissions   //暂时没用上,直接取
            store.dispatch('GenerateRoutes', { permissionList }).then(() => {
              // 根据roles权限生成可访问的路由表
              // 动态添加可访问路由表
              router.addRoutes(store.getters.addRouters)
              const redirect = decodeURIComponent(from.query.redirect || to.path)
              if(to.meta.keepAlive){
                store.dispatch('addCachedView', to);
              }
              if (to.path === redirect) {
                // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
                next({ ...to, replace: true })
              } else {
                // 跳转到目的路由
                next({ path: redirect })
              }
            })
          }
      }
    })
  } else {
    if (whiteList.includes(to.name)) {
      // 在免登录白名单，直接进入
      next()
    } else {
      next({ path: '/user/login', query: { redirect: to.fullPath } })
      NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
    }
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
