// ie polyfill
import '@babel/polyfill'

//import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/'

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


//import './auth'
/* eslint-disable no-new */
/* eslint-disable no-new */
(function () {

  abp.ui.setBusy();

  new Vue({
    render: h => h(App),
    router,
    store,
    created: bootstrap,
    mounted () {
      abp.ui.clearBusy();                  
    }
  }).$mount('#app')  

})();

