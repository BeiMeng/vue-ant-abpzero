<style lang="less" scoped>
  .admim_user{

  }
</style>

<template>
  <div class="admim_user">      
      <crud :queryForm="queryForm" :mainForm="mainForm" :apiUrl="apiUrl" :permissionNames="permissionNames" dataName="user">
          <template slot="queryItems">
                <el-form-item label="模糊搜索">
                    <el-input v-model="queryForm.filter" placeholder=""></el-input>
                </el-form-item>                                
          </template>      
          <template slot="tableItems">
                <el-table-column label="用户名" prop="userName" header-align="center"></el-table-column>                   
          </template>
          <template slot="formItems">
                <el-form-item label="用户名" prop="userName">
                    <el-input v-model="mainForm.userName" placeholder=""></el-input>
                </el-form-item> 
          </template>                    
      </crud>

  </div>
</template>

<script>

export default {
  name: 'admim_user',
  components:{
      
  },
  data() {      
    return {
        queryForm:{
            filter: ''            
        },
        apiUrl: {
            queryList: '/api/services/app/User/GetUsers',
            getById: '/api/services/app/User/GetUserForEdit',
            del: '/api/services/app/User/DeleteUser',
            save: '/api/services/app/User/CreateOrUpdateUser'
        },
        permissionNames: {
            add: 'Pages.Administration.Users.Create',
            edit: 'Pages.Administration.Users.Edit',
            del: 'Pages.Administration.Users.Delete'
        },
        mainForm:{
            userName: ''
        },        
        request: {
            url: '/api/services/app/AuditLog/GetAuditLogs',
            type: 'get'
        },
        pageSize: 10
    }
  },
  mounted(){
      //this.loadTableData();
  },
  methods: {
        loadTableData () {
            let params = {
                startDate: moment().add(-10, 'days')._d,
                endDate: new Date()
            }
            this.$refs.pagin.query(params)
        }
  },
 }
</script>