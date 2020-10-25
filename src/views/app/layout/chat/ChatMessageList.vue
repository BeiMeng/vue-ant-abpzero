<style lang='less' scoped>
  .app_layout_chatMessageList{
      .chatList{
          overflow-y: auto;
          height: 800px;
      }
  }
</style>

<template>
  <div class="app_layout_chatMessageList">
      {{selectedFriend.friendUserName}}
      <el-button type="warning" v-if="selectedFriend.state !== friendshipState.Blocked" @click="block">加入黑名单</el-button>
      <el-button type="success" v-if="selectedFriend.state == friendshipState.Blocked" @click="unblock">取消黑名单</el-button>
      <div class="chatList">
        <div v-for="(message,index) in selectedFriend.messages" :key="index">
            <div v-if="message.side === 1" style="text-align:right">
                <span class="kt-chat__datetime">
                    <span class="timeago">{{ getFixedMessageTime(message.creationTime)}}</span> {{receiverReadStateFormat(message.receiverReadState)}}
                </span>
                <a href="#" class="kt-chat__username">{{userInfo.userName}}</a>
                <chatMessageItem :message="message"></chatMessageItem>
                <span class="kt-media kt-media--circle kt-media--sm">
                    <!-- <img src="{{profilePicture}}" alt="image"> -->
                </span>
            </div>
            <div v-else style="text-align:left">
                <span class="kt-chat__datetime">
                    <span class="timeago">{{ getFixedMessageTime(message.creationTime)}}</span> {{receiverReadStateFormat(message.receiverReadState)}}
                </span>
                <a href="#" class="kt-chat__username">{{selectedFriend.friendUserName}}</a>
                <chatMessageItem :message="message"></chatMessageItem>
                <span class="kt-media kt-media--circle kt-media--sm">
                    <!-- <img src="{{profilePicture}}" alt="image"> -->
                </span>
            </div>
        </div>
      </div>
      <div class="sendMessage">
          <el-input v-model="chatMessage" type="textarea" placeholder=""></el-input>
          <el-button type="primary" @click="sendMessage">发送消息</el-button>
          <el-button type="primary" >发送(链接/图片/文件)</el-button>
      </div>
  </div>
</template>

<script>
import chatMessageItem from './ChatMessageItem'

import {FriendshipState} from '@/abpZero/app/shared/common/chat/ChatState'
import {FriendshipServiceProxy} from '@/abpZero/shared/service-proxies/FriendshipServiceProxy'
import {ChatSide, ChatMessageReadState} from '@/abpZero/app/shared/common/chat/ChatState'
import {ChatServiceProxy} from '@/abpZero/shared/service-proxies/ChatServiceProxy'
let _chatService=new ChatServiceProxy()
let _friendshipService=new FriendshipServiceProxy()
export default {
  name: 'app_layout_chatMessageList',
  components: {
      chatMessageItem,
  },
  data() {
    return {
        friendshipState:FriendshipState,
        loadingPreviousUserMessages:false,
        chatMessage:'',
        sendingMessage:false
    }
  },
  computed: {
    friends () {
        return this.$store.getters.friends
    },
    selectedFriend () {
        return this.$store.getters.selectedFriend
    },
    serverClientTimeDifference () {
        return this.$store.getters.serverClientTimeDifference
    },
    userInfo () {
        return this.$store.getters.userInfo
    },
    tenant () {
        return this.$store.getters.tenant
    },   
  },
  created () {
    this.selectFriend(this.selectedFriend);
  },
  methods: {
    receiverReadStateFormat(receiverReadState){
        if(receiverReadState==ChatMessageReadState.Read){
            return this.l('read');
        }else{
             return this.l('unRead')
        }
    },
    sendMessage(event) {
        if (!this.chatMessage) {
            return;
        }
        this.sendingMessage = true;
        const tenancyName = this.tenant ? this.tenant.tenancyName : null;
        _chatSignalrService.sendMessage({
            tenantId: this.selectedFriend.friendTenantId,
            userId: this.selectedFriend.friendUserId,
            message: this.chatMessage,
            tenancyName: tenancyName,
            userName: this.userInfo.userName,
            profilePictureId: this.userInfo.profilePictureId
        }, () => {
            this.chatMessage = '';
            this.sendingMessage = false;
        });
    },
    getFriendOrNull(userId, tenantId) {
        const friends = _.filter(this.friends, friend => friend.friendUserId === userId && friend.friendTenantId === tenantId);
        if (friends.length) {
            return friends[0];
        }
        return null;
    },
    loadMessages(user, callback) {
        this.loadingPreviousUserMessages = true;
        let minMessageId;
        if (user.messages && user.messages.length) {
            minMessageId = _.min(_.map(user.messages, m => m.id));
        }
        _chatService.getUserChatMessages(user.friendTenantId ? user.friendTenantId : undefined, user.friendUserId, minMessageId)
            .then(result => {
            if (!user.messages) {
                user.messages = [];
            }
            user.messages = result.items.concat(user.messages);
            this.markAllUnreadMessagesOfUserAsRead(user);
            if (!result.items.length) {
                user.allPreviousMessagesLoaded = true;
            }
            this.loadingPreviousUserMessages = false;
            if (callback) {
                callback();
            }
        });
    },
    selectFriend(friend) {
        const chatUser = this.getFriendOrNull(friend.friendUserId, friend.friendTenantId);
        if (!chatUser) {
            return;
        }
        this.chatMessage = '';
        if (!chatUser.messagesLoaded) {
            this.loadMessages(chatUser, () => {
                chatUser.messagesLoaded = true;
                this.$store.commit('SET_SELECTEDFRIEND', chatUser);
                console.log(chatUser);
                //this.adjustChatScrollbarHeight();
                //this.scrollToBottom();
                //this.chatMessageInput.nativeElement.focus();
            });
        }
        else {
            this.markAllUnreadMessagesOfUserAsRead(this.selectedFriend);
            //this.adjustChatScrollbarHeight();
            //this.scrollToBottom();
            //this.chatMessageInput.nativeElement.focus();
        }
    },
    getFixedMessageTime(messageTime) {
        return moment(messageTime).add(-1 * this.serverClientTimeDifference, 'seconds').format('YYYY-MM-DDTHH:mm:ssZ');
    },
    markAllUnreadMessagesOfUserAsRead(user) {
        if (!user) {
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
    block(user) {
        const blockUserInput = {};
        blockUserInput.tenantId = this.selectedFriend.friendTenantId;
        blockUserInput.userId = this.selectedFriend.friendUserId;
        _friendshipService.blockUser(blockUserInput).then(() => {
            abp.message.info(this.l('UserBlocked'));
        });
    },
    unblock(user) {
        const unblockUserInput = {};
        unblockUserInput.tenantId = this.selectedFriend.friendTenantId;
        unblockUserInput.userId = this.selectedFriend.friendUserId;
        _friendshipService.unblockUser(unblockUserInput).then(() => {
           abp.message.info(this.l('UserUnblocked'));
        });
    }
  },
 }
</script>