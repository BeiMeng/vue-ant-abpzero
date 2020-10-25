<style lang='less' scoped>
  .app_layout_chatFriendList{

  }
</style>

<template>
  <div class="app_layout_chatFriendList">
      <h3>朋友列表</h3>
      <template v-for="(item) in getFilteredFriends(friendshipState.Accepted,userNameFilter)">
          <chatFriendListItem :friend="item" :key="item.friendUserId"></chatFriendListItem>
      </template>
      <h3>黑名单</h3>
      <template v-for="(item) in getFilteredFriends(friendshipState.Blocked,userNameFilter)">
          <chatFriendListItem :friend="item"  :key="item.friendUserId"></chatFriendListItem>
      </template>
  </div>
</template>

<script>
import chatFriendListItem from './ChatFriendListItem'
import {FriendshipState} from '@/abpZero/app/shared/common/chat/ChatState'
export default {
  name: 'app_layout_chatFriendList',
  components: {
      chatFriendListItem,
  },
  data() { 
    return {
        friendshipState:FriendshipState
    }
  },
  computed: {
    friends () {
        return this.$store.getters.friends
    },
    userNameFilter () {
        return this.$store.getters.userNameFilter
    }    
  },   
  methods: {
    getShownUserName(tenanycName, userName) {
        if (!abp.multiTenancy.isEnabled) {
            return userName;
        }
        return (tenanycName ? tenanycName : '.') + '\\' + userName;
    },    
    getFilteredFriends(state, userNameFilter) {
        const foundFriends = _.filter(this.friends, friend => friend.state === state &&
            this.getShownUserName(friend.friendTenancyName, friend.friendUserName)
                .toLocaleLowerCase()
                .indexOf(userNameFilter.toLocaleLowerCase()) >= 0);
        return foundFriends;
    }      
  },
 }
</script>