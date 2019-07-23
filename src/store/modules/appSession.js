
import { SessionServiceProxy } from '@/abpZero/shared/service-proxies/SessionServiceProxy';
let _sessionService=new SessionServiceProxy();
const appSession = {
    state: {
      //application: null,
      user:null,
      tenant:null,
      theme:null
    },
    mutations: {
        SET_APPSESSION(state, session) {
            //state.application = session.application
            state.user = session.user;
            state.tenant = session.tenant;
            state.theme = session.theme;             
        },         
    },
    actions: {
        init({commit,state}){
            return new Promise((resolve, reject) => {             
                _sessionService.getCurrentLoginInformations()
                .then(result=>{
                    commit('SET_APPSESSION', result)        
                    resolve(result.theme);              
                })
                .catch(function (error) {
                    reject(error);
                });              
            });
        }
    }       
}
export default appSession