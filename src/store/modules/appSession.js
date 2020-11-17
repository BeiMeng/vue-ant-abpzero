
const appSession = {
    state: {
      //application: null,
      user:null,
      tenant:null,
      theme:null
    },
    mutations: {
        SET_APPSESSION(state, session) {
            state.user = session;          
        },         
    },
    actions: {
        init({commit,state},userInfo){
            commit('SET_APPSESSION', userInfo)  
        }
    }       
}
export default appSession