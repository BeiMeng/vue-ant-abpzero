//import Vue from 'vue'
import Vuex from 'vuex'

import app from './modules/app'
import user from './modules/user'
import permission from './modules/permission'
import appSession from './modules/appSession'
import tabView from './modules/tagsView'
import chat from './modules/chat'
import getters from './getters'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    app,
    user,
    permission,
    appSession,
    tabView,
    chat
  },
  state: {

  },
  mutations: {

  },
  actions: {

  },
  getters
})
