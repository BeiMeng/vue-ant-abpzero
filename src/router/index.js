//import Vue from 'vue'
//import Router from 'vue-router'
import { constantRouterMap } from '@/config/router.config'

//Vue.use(Router)


//解决message: "Navigating to current location ("/homePage") is not allowed",警告的问题
const VueRouterPush = VueRouter.prototype.push 
VueRouter.prototype.push = function push (to) {
    return VueRouterPush.call(this, to).catch(err => err)
}

export default new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
