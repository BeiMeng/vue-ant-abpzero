// ie polyfill
import '@babel/polyfill'

//import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/'
import { VueAxios } from './utils/request'

// mock
//import './mock'

import bootstrap from './core/bootstrap'
import './core/use'
import './permission' // permission control
import './utils/filter' // global filter

Vue.config.productionTip = false

// mount axios Vue.$http and this.$http
//Vue.use(VueAxios)

import './utils/dom/index'
import * as _ from 'lodash'
window._=_;
import * as moment from 'moment';
window.moment=moment;
import abpMixins from '@/abpZero/shared/abpMixin'

Vue.mixin(abpMixins) 


import HttpClient from '@/abpZero/utils/HttpClient'
window.httpClient=HttpClient

//import './auth'
/* eslint-disable no-new */
import appconfig from '@/abpZero/appconfig'
import { AppAuthService } from '@/abpZero/app/shared/common/auth/app-auth.service';
import { ChatSignalrService } from '@/abpZero/app/shared/common/chat/chat-signalr.service';
import { UrlHelper } from '@/abpZero/shared/helpers/UrlHelper';
import { AppPreBootstrap } from '@/abpZero/AppPreBootstrap';
import { SignalRHelper } from '@/abpZero/shared/helpers/SignalRHelper';
window._chatSignalrService=new ChatSignalrService();//全局单例
/* eslint-disable no-new */
(function () {

  abp.ui.setBusy();

  AppPreBootstrap.run(appconfig, () => {
      handleLogoutRequest(new AppAuthService()); 
      store.dispatch('init')  //初始化appSession
      .then((result) => {
          if (result.user) {
            //SignalRHelper.initSignalR();
            SignalRHelper.initSignalR(() => { _chatSignalrService.init(); });
          }        
          new Vue({
              render: h => h(App),
              router,
              store,
              created: bootstrap,
              mounted () {
                abp.ui.clearBusy();                  
              }
          }).$mount('#app')               
             
      }).catch(() => {})                            
  });

})();

function handleLogoutRequest(authService) {
  let currentUrl = UrlHelper.initialUrl;
  let returnUrl = UrlHelper.getReturnUrl();
  if (currentUrl.indexOf(('account/logout')) >= 0 && returnUrl) {
      authService.logout(true, returnUrl);
  }
}



// new Vue({
//   router,
//   store,
//   created: bootstrap,
//   render: h => h(App)
// }).$mount('#app')
