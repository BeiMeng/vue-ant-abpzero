const getters = {
  device: state => state.app.device,
  theme: state => state.app.theme,
  color: state => state.app.color,
  token: state => state.user.token,
  avatar: state => {
    if(state.appSession.user.profilePictureId){
      return '/user.png'
    }else{
      return '/user.png'
    }
  },
  nickname: state => state.appSession.user.name,
  welcome: state => state.user.welcome,
  roles: state => state.user.roles,
  userInfo: state => state.appSession.user,
  tenant: state => state.appSession.tenant,
  addRouters: state => state.permission.addRouters,
  multiTab: state => state.app.multiTab,
  friends:state => state.chat.friends,
  userNameFilter:state => state.chat.userNameFilter,
  selectedFriend:state => state.chat.selectedFriend,
  showChatMessage:state => state.chat.showChatMessage,
  isOpen:state => state.chat.isOpen,    
  serverClientTimeDifference:state => state.chat.serverClientTimeDifference, 
}

export default getters
