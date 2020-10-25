import {ChatServiceProxy} from '@/abpZero/shared/service-proxies/ChatServiceProxy'
let _chatService=new ChatServiceProxy()
const chat = {
    state: {
      friends:[],
      serverClientTimeDifference:null,
      userNameFilter:'',
      selectedFriend:{},
      isOpen:false,
      showChatMessage:false
    },
    mutations: {
        GET_FRIENDS(state, result) {
            state.friends = result;
            state.serverClientTimeDifference =  moment(abp.clock.now()).diff(result.serverTime, 'seconds');      
        },   
        ADD_FRIEND(state, friend) {
            state.friends.push(friend);         
        },   
        SET_USERNAMEFILTER(state, value) {
            state.userNameFilter=value;        
        }, 
        SET_SELECTEDFRIEND(state, value) {
            state.selectedFriend=_.cloneDeep(value);        
        },  
        SET_SHOWCHATMESSAGE(state, value) {
            state.showChatMessage=value;        
        },  
        SET_OPEN(state, value) {
            state.isOpen=value;        
        },                                       
    },
    actions: {
        getFriendsAndSettings({commit,state},callback){
            return new Promise((resolve, reject) => {   
                _chatService.getUserChatFriendsWithSettings()
                .then(result => {
                    commit('GET_FRIENDS',  result.friends)
                    resolve(result); 
                    callback();
                })                        
                .catch(function (error) {
                    reject(error);
                });              
            });
        }
    }       
}
export default chat