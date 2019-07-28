const tagsView = {
  state: {
    cachedViews: []
  },
  mutations: {

    ADD_CACHED_VIEW: (state, view) => {
      if (state.cachedViews.includes(view.name)){
        return
      }
      if(view.name){
        state.cachedViews.push(view.name)
      }      
    },
    DEL_CACHED_VIEW: (state, view) => {
      for (const i of state.cachedViews) {
        if (i === view.name) {
          const index = state.cachedViews.indexOf(i)
          state.cachedViews.splice(index, 1)
          break
        }
      }
    },
    DEL_OTHERS_CACHED_VIEWS: (state, view) => {     
      for (const i of state.cachedViews) {
        if (i === view.name) {
          const index = state.cachedViews.indexOf(i)
          state.cachedViews = state.cachedViews.slice(index, index + 1)
          break
        }
      }
    },

    DEL_ALL_CACHED_VIEWS: state => {
      state.cachedViews = []
    }

  },
  actions: {
    addView({ dispatch }, view) {
      dispatch('addCachedView', view)
    },
    addCachedView({ commit }, view) {
      commit('ADD_CACHED_VIEW', view)
    },

    delView({ dispatch, state }, view) {
      return new Promise(resolve => {
        dispatch('delCachedView', view)
        resolve({
          cachedViews: [...state.cachedViews]
        })
      })
    },
    delCachedView({ commit, state }, view) {
      return new Promise(resolve => {
        commit('DEL_CACHED_VIEW', view)
        resolve([...state.cachedViews])      
      })
    },

    delOthersViews({ dispatch, state }, view) {
      return new Promise(resolve => {
        dispatch('delOthersCachedViews', view)
        resolve({
          cachedViews: [...state.cachedViews]
        })
      })
    },
    delOthersCachedViews({ commit, state }, view) {
      return new Promise(resolve => {
        commit('DEL_OTHERS_CACHED_VIEWS', view)
        resolve([...state.cachedViews])
      })
    },

    delAllViews({ dispatch, state }, view) {
      return new Promise(resolve => {
        dispatch('delAllCachedViews', view)
        resolve({
          cachedViews: [...state.cachedViews]
        })
      })
    },
    delAllCachedViews({ commit, state }) {
      return new Promise(resolve => {
        commit('DEL_ALL_CACHED_VIEWS')
        resolve([...state.cachedViews])
      })
    }
  }
}

export default tagsView
