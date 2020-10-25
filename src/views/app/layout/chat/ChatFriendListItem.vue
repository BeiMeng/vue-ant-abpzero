<style lang='less' scoped>
  .app_layout_chatFriendListItem{

  }
</style>

<template>
  <div class="app_layout_chatFriendListItem" @click="selectFriendToChat">
      <el-avatar :src="profilePicture"></el-avatar>
      <span>{{friend.friendUserName}}</span>
                <i  v-if="friend.isOnline" class="el-icon-microphone"></i>
                <i  v-if="!friend.isOnline" class="el-icon-turn-off-microphone"></i>      
    <span v-if='friend.friendTenancyName'>{{friend.friendTenancyName}}</span>
    <span v-if='!friend.friendTenancyName'>Host</span>    
            <span v-if="friend.unreadMessageCount" class="kt-badge kt-badge--warning">
                {{friend.unreadMessageCount}}
            </span>      
  </div>
</template>

<script>
import { AppConsts } from '@/abpZero/shared/AppConsts'
import {ProfileServiceProxy} from '@/abpZero/shared/service-proxies/ProfileServiceProxy'
let _profileService=new ProfileServiceProxy()
export default {
  name: 'app_layout_chatFriendListItem',
  props: {
      friend: {
          type: Object,
          default: {}
      }
  },
  data() { 
    return {
        profilePicture:AppConsts.appBaseUrl + '/user.png'
    }
  },
  created () {
      this.setProfileImage();
  },
  methods: {
    selectFriendToChat(){
        this.$store.commit('SET_SELECTEDFRIEND', this.friend);           
        this.$store.commit('SET_SHOWCHATMESSAGE', true);        
    },
    setProfileImage(){  //每次加载都读库需要优化
        _profileService.getFriendProfilePicture(this.friend.userId, this.friend.tenantId).then((result) => {
            if (result && result.profilePicture) {
                this.profilePicture = 'data:image/jpeg;base64,' + result.profilePicture;
            }
        });
    }
  },
 }
</script>