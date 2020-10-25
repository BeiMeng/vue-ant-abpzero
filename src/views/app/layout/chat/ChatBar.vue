<style lang='less' scoped>
  .app_layout_chatBar{
      display: inline-block;
  }
</style>
<style lang="less">
  .ant-drawer-close{
    width: 24px !important;
    height: 40px !important;
    line-height: 24px !important;
  }
</style>

<template>
  <div class="app_layout_chatBar action" @click="show">
        <span class="action">
            <a-icon type="message"></a-icon>
        </span>
    <a-drawer :headerStyle="{padding:'8px 6px'}" :bodyStyle="{padding:'6px 6px'}"
      placement="right"
      :closable="true"
      :visible="isOpen"
      :maskClosable="false"
      :mask="false"
      width="350px"
      @close="onClose"
    >
        <template slot="title">
            <a-icon type="arrow-left" @click="backFriendList" :style="`visibility:${showChatMessage?'visible':'hidden'}`"></a-icon>
        </template>
        <addChatFriends v-if="!showChatMessage"></addChatFriends>
        <chatFriendList  v-if="!showChatMessage"></chatFriendList>
        <chatMessageList v-if="showChatMessage"></chatMessageList>
    </a-drawer>          
  </div>
</template>

<script>
//todo 未实现功能点(后续功能用到了再优化，基本功能已全部实现)
//1.发送(链接/图片/文件)功能未添加
//2.多租户开启/关闭状态下聊天功能测试未完成
//3.根据VIP权限是否开启聊天功能未添加
//4.显示朋友列表时，朋友图片总是去数据库请求，此处需要优化
//5.整个聊天样式未调整(代码实现聊天列表的竖向滚动条自动调整)
//6.存储上次聊天窗口是否打开以及最后一个聊天人功能未添加
//7.页面顶部消息到达时，消息图标显示未读消息个数 功能未添加
import addChatFriends from  './AddChatFriends'
import chatFriendList from './ChatFriendList'
import chatMessageList from './ChatMessageList'

import { AppConsts } from '@/abpZero/shared/AppConsts'
import {ChatSide, ChatMessageReadState} from '@/abpZero/app/shared/common/chat/ChatState'
import {ChatServiceProxy} from '@/abpZero/shared/service-proxies/ChatServiceProxy'
import {ProfileServiceProxy} from '@/abpZero/shared/service-proxies/ProfileServiceProxy'
import { LocalStorageService } from '@/abpZero/shared/common/localStorage.Service'


let _chatService=new ChatServiceProxy()
let _profileService=new ProfileServiceProxy()
let _localStorageService = new LocalStorageService()

export default {
  name: 'app_layout_chatBar',
  components: {
      chatFriendList,
      chatMessageList,
      addChatFriends
  },
  data() { 
    return {
        loadingPreviousUserMessages:false,
    }
  },
  computed: {
    friends () {
        return this.$store.getters.friends
    },
    selectedFriend () {
        return this.$store.getters.selectedFriend
    },   
    isOpen () {
        return this.$store.getters.isOpen
    },      
    showChatMessage () {
        return this.$store.getters.showChatMessage
    }    
  },   
  created () {
      this.init();
  },
  methods: {
    show() {
        this.$store.commit('SET_OPEN', true);
    },
    onClose(){
        this.$store.commit('SET_SHOWCHATMESSAGE', false);
        this.$store.commit('SET_OPEN', false);
    },
    backFriendList(){       
        this.$store.commit('SET_SHOWCHATMESSAGE', false);  
        this.$store.commit('SET_SELECTEDFRIEND', null);       
    },
    getFriendOrNull(userId, tenantId) {
        const friends = _.filter(this.friends, friend => friend.friendUserId === userId && friend.friendTenantId === tenantId);
        if (friends.length) {
            return friends[0];
        }
        return null;
    },       
    markAllUnreadMessagesOfUserAsRead(user) {
        if (!user || !this.isOpen) {
            return;
        }
        const unreadMessages = _.filter(user.messages, m => m.readState === ChatMessageReadState.Unread);
        const unreadMessageIds = _.map(unreadMessages, 'id');
        if (!unreadMessageIds.length) {
            return;
        }
        const input = {};
        input.tenantId = user.friendTenantId;
        input.userId = user.friendUserId;
        _chatService.markAllUnreadMessagesOfUserAsRead(input).then(() => {
            _.forEach(user.messages, message => {
                if (unreadMessageIds.indexOf(message.id) >= 0) {
                    message.readState = ChatMessageReadState.Read;
                }
            });
            this.$store.commit('SET_SELECTEDFRIEND', user);
        });
    },    
    //通知栏显示未读聊天消息总数
    triggerUnreadMessageCountChangeEvent() { 
        let totalUnreadMessageCount = 0;
        if (this.friends) {
            totalUnreadMessageCount = _.reduce(this.friends, (memo, friend) => memo + friend.unreadMessageCount, 0);
        }
        abp.event.trigger('app.chat.unreadMessageCountChanged', totalUnreadMessageCount);
    }, 
    
    
    // loadLastState() {
    //     const self = this;
    //     _localStorageService.getItem('app.chat.isOpen', (err, isOpen) => {
    //         self.isOpen = isOpen;
    //         if (isOpen) {
    //             //this.mQuickSidebarOffcanvas.show();
    //             _localStorageService.getItem('app.chat.selectedUser', (err, selectedUser) => {
    //                 if (selectedUser && selectedUser.friendUserId) {
    //                     self.selectFriend(selectedUser);
    //                 }
    //             });
    //         }
    //     });
    // },  
    init() {
        this.registerEvents();
    },       
    registerEvents() {
        const self = this;
        function onMessageReceived(message) {
            const user = self.getFriendOrNull(message.targetUserId, message.targetTenantId);
            if (!user) {
                return;
            }
            user.messages = user.messages || [];
            user.messages.push(message);            
            if (message.side === ChatSide.Receiver) {
                user.unreadMessageCount += 1;
                message.readState = ChatMessageReadState.Unread;
                self.triggerUnreadMessageCountChangeEvent();
                //与发消息的用户正处于聊天窗口状态
                if (self.isOpen && self.selectedFriend !== null && user.friendTenantId === self.selectedFriend.friendTenantId && user.friendUserId === self.selectedFriend.friendUserId) {
                    self.markAllUnreadMessagesOfUserAsRead(user);
                    self.$store.commit('SET_SELECTEDFRIEND', user);
                }
                else {
                     self.$notify({
                         type:'info',
                         position:'bottom-right',
                         title:self.l('chatMessage'),
                         message:abp.utils.formatString('{0}: {1}', user.friendUserName, abp.utils.truncateString(message.message, 100)),
                         onClick:()=>{
                              if(!self.isOpen){
                                  self.$store.commit('SET_OPEN', true);
                              }
                              if(!self.showChatMessage){
                                  self.$store.commit('SET_SHOWCHATMESSAGE', true);
                              }                
                              self.$store.commit('SET_SELECTEDFRIEND', user);                                            
                         }
                     });
                }
            }else{
                self.$store.commit('SET_SELECTEDFRIEND', user);
            }
            //self.scrollToBottom();
        }
        //消息到达推送
        abp.event.on('app.chat.messageReceived', message => {
            onMessageReceived(message);
        });
        function onFriendshipRequestReceived(data, isOwnRequest) {
            if (!isOwnRequest) {
                abp.notify.info(self.l('UserSendYouAFriendshipRequest', data.friendUserName));
            }
            if (!_.filter(self.friends, f => f.friendUserId === data.friendUserId && f.friendTenantId === data.friendTenantId).length) {
                self.$store.commit('ADD_FRIEND', data);
            }
        }
        //添加好友与被添加好友推送
        abp.event.on('app.chat.friendshipRequestReceived', (data, isOwnRequest) => {
                onFriendshipRequestReceived(data, isOwnRequest);
        });
        function onUserConnectionStateChanged(data) {
            const user = self.getFriendOrNull(data.friend.userId, data.friend.tenantId);
            if (!user) {
                return;
            }
            user.isOnline = data.isConnected;
        }
        //是否登陆在线状态推送
        abp.event.on('app.chat.userConnectionStateChanged', data => {
                onUserConnectionStateChanged(data);
        });
        function onUserStateChanged(data) {
            const user = self.getFriendOrNull(data.friend.userId, data.friend.tenantId);
            if (!user) {
                return;
            }
            user.state = data.state;
        }
        //黑名单状态推送
        abp.event.on('app.chat.userStateChanged', data => {
                onUserStateChanged(data);
        });
        function onAllUnreadMessagesOfUserRead(data) {
            const user = self.getFriendOrNull(data.friend.userId, data.friend.tenantId);
            if (!user) {
                return;
            }
            user.unreadMessageCount = 0;
            self.triggerUnreadMessageCountChangeEvent();
        }
        //所有未读消息都已读推送
        abp.event.on('app.chat.allUnreadMessagesOfUserRead', data => {
                onAllUnreadMessagesOfUserRead(data);
        });
        function onReadStateChange(data) {
            const user = self.getFriendOrNull(data.friend.userId, data.friend.tenantId);
            if (!user) {
                return;
            }
            _.forEach(user.messages, message => {
                message.receiverReadState = ChatMessageReadState.Read;
            });
            self.$store.commit('SET_SELECTEDFRIEND', user);
        }
        //当前自己发送的消息对方已读推送
        abp.event.on('app.chat.readStateChange', data => {
                onReadStateChange(data);
        });
        function onConnected() {
            self.$store.dispatch('getFriendsAndSettings', () => {
                //self.loadLastState(); 配置上一次聊天功能状态，是否打开状态，最后聊天人
            })
        }
        //聊天功能会话已链接
        abp.event.on('app.chat.connected', () => {
            onConnected();
        });
    }          
  },
 }
</script>