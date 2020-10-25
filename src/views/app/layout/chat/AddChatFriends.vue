<style lang='less' scoped>
  .app_layout_AddChatFriends{
      .add-friend-btn{
          width: 100%;
          margin-top: 6px;
          margin-bottom: 6px;
      }
  }
</style>

<template>
  <div class="app_layout_AddChatFriends">
    <el-input placeholder="搜索/添加用户" v-model="userNameFilter">
        <i slot="suffix" class="el-input__icon el-icon-info" title="aaaaaaaa"></i>
    </el-input>
    <el-button type="primary"  class="add-friend-btn" @click="showUsers">添加朋友</el-button>
    <lookup ref="showUsers" title="选择用户" :queryForm="queryForm" :apiUrl="apiUrl" @getSelectedData="addFriendSelected" :multipleSelected="false">
        <template slot="queryItems">
            <el-form-item label="模糊搜索">
                <el-input v-model="queryForm.filter" placeholder="" clearable></el-input>
            </el-form-item>                              
        </template> 
        <template slot="tableItems">
            <el-table-column label="用户名" prop="userName" header-align="center"></el-table-column> 
            <el-table-column label="姓名" prop="name" header-align="center"></el-table-column>             
        </template>               
    </lookup>   
    
  </div>
</template>

<script>
import spTable from '@/eleComponents/spTable'
import lookup from '@/eleComponents/lookup'

import {FriendshipServiceProxy} from '@/abpZero/shared/service-proxies/FriendshipServiceProxy'
let _friendshipService=new FriendshipServiceProxy()
export default {
  name: 'app_layout_AddChatFriends',
  components: {
      spTable,
      lookup
  },
  data() { 
    return {
        userNameFilter:'',
        queryForm:{
            filter:''
        },
        apiUrl:'/api/services/app/User/GetUsers'
    }
  },
  watch: {
      userNameFilter(newValue, oldValue) {
          this.queryForm.filter=newValue;
          this.$store.commit('SET_USERNAMEFILTER', newValue)
      }
  },
  methods: {
    showUsers(){
        this.$refs.showUsers.show();
    },
    addFriendSelected(item) {
        const userId = item.id;
        const input = {};
        input.userId = parseInt(userId);
        input.tenantId = this.$store.state.appSession.tenant ? this.$store.state.appSession.tenant.id : null;
        _friendshipService.createFriendshipRequest(input).then(() => {
            this.userNameFilter = '';
        });
    }     
  },
 }
</script>