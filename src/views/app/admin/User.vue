<style lang="less" scoped>
  .admim_user{

  }
</style>

<template>
  <div class="admim_user">      
      <crud warp dataName="user" :queryForm="queryForm" :mainForm="mainForm" :mainFormRule="mainFormRule" :apiUrl="apiUrl" :permissionNames="permissionNames" :pageSize="pageSize"
        :handlerAddData="handlerAddData" :handlerEditData="handlerEditData" :handlerSaveData="handlerSaveData" :handlerGoList="handlerGoList">
          <template slot="queryItems">
                <el-form-item label="模糊搜索">
                    <el-input v-model="queryForm.filter" placeholder="" clearable></el-input>
                </el-form-item> 
                <el-form-item label="选择角色">
                   <el-select v-model="queryForm.role" placeholder="" clearable>
                     <el-option v-for="item in roleList" :key="item.key" :label="item.displayName" :value="item.id"></el-option>
                   </el-select>
                </el-form-item> 
                <el-form-item label="锁定的用户">
                    <el-switch v-model="queryForm.onlyLockedUsers"  active-text='否' inactive-text='是' :active-value='false' :inactive-value='true'></el-switch>
                </el-form-item>                             
          </template>      
          <template slot="tableItems">
                <el-table-column label="用户名" prop="userName" header-align="center"></el-table-column> 
                <el-table-column label="姓名" prop="name" header-align="center"></el-table-column> 
                <el-table-column label="邮箱" prop="emailAddress" header-align="center"></el-table-column> 
                <el-table-column label="手机号" prop="phoneNumber" header-align="center"></el-table-column>
                <el-table-column label="邮箱验证"  header-align="center" align="center" width="120">
                    <template slot-scope="scope">
                        <el-tag type="success" v-if="scope.row.isEmailConfirmed">已验证</el-tag>
                        <el-tag type="danger" v-else>未验证</el-tag>
                    </template> 
                </el-table-column>                  
                <el-table-column label="激活"  header-align="center" align="center" width="120">
                    <template slot-scope="scope">
                        <el-tag type="success" v-if="scope.row.isActive">是</el-tag>
                        <el-tag type="danger" v-else>否</el-tag>
                    </template> 
                </el-table-column> 
                <el-table-column label="创建时间" header-align="center" align="center" width="150">
                    <template slot-scope="scope">
                        {{dateTimeFormat(scope.row.creationTime)}}
                    </template>                        
                </el-table-column>
                <el-table-column label="权限设置" header-align="center" align="center" width="80" v-if="isGranted(permissionNames.permission)">
                    <template slot-scope="scope">
                        <i class="el-icon-setting rowSetting" @click="permissionSetting(scope.row)"></i>
                    </template>                        
                </el-table-column>             
          </template>
          <template slot="formItems">
                <el-tabs  v-model="activeTab">
                  <el-tab-pane label="用户信息" name="user">
                    <div style="width:25vw;margin-left:30px">
                        <el-form-item label="用户名" prop="userName">
                            <el-input v-model="mainForm.userName" placeholder=""></el-input>
                        </el-form-item> 
                        <el-form-item label="姓名" prop="name">
                            <el-input v-model="mainForm.name" placeholder=""></el-input>
                        </el-form-item>   
                        <el-form-item label="邮箱" prop="emailAddress">
                            <el-input v-model="mainForm.emailAddress" placeholder=""></el-input>
                        </el-form-item>                           
                        <el-form-item label="手机号" prop="phoneNumber">
                            <el-input v-model="mainForm.phoneNumber" placeholder=""></el-input>
                        </el-form-item>                                                
                        <el-form-item label="随机密码">
                            <el-switch v-model="mainForm.setRandomPassword"  active-text='否' inactive-text='是' :active-value='false' :inactive-value='true'></el-switch>
                        </el-form-item> 
                        <el-form-item label="密码" prop="password" v-if="!mainForm.setRandomPassword">
                            <el-input v-model="mainForm.password" placeholder=""></el-input>
                        </el-form-item> 
                        <el-form-item label="密码(核对)" prop="againPassword" v-if="!mainForm.setRandomPassword">
                            <el-input v-model="mainForm.againPassword" placeholder=""></el-input>
                        </el-form-item>  
                        <el-form-item label="是否激活">
                            <el-switch v-model="mainForm.isActive"  active-text='否' inactive-text='是' :active-value='false' :inactive-value='true'></el-switch>
                        </el-form-item>                                                                                                 
                    </div> 
                  </el-tab-pane>
                  <el-tab-pane label="角色" name="role">
                    <el-checkbox-group v-model="selectedRoleList">
                        <el-checkbox :label="item.name" v-for="item in roleList" :key="item.key">{{item.displayName}}</el-checkbox>
                    </el-checkbox-group>
                  </el-tab-pane>
                </el-tabs>          
          </template>                    
      </crud>

  </div>
</template>

<script>
//abpzero User表字段Surname设置为可为空
export default {
  name: 'admim_user',
  components:{
      
  },
  data() {      
    return {
        roleList:[],
        selectedRoleList:[],
        activeTab:'user',
        queryForm:{
              filter:"",
              role:null,
              onlyLockedUsers:false        
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
            userName:'',
            name:'',
            emailAddress:'',
            phoneNumber:'',
            password:'',
            againPassword:'',
            isActive:'',
            setRandomPassword:false
        },  
        mainFormRule:{
            userName: [
                { required: true, message: '用户名为必须项', trigger: 'blur' },
                { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
            ],
        },              
        request: {
            url: '/api/services/app/AuditLog/GetAuditLogs',
            type: 'get'
        },
        pageSize: 10
    }
  },
  mounted(){
        httpClient.get("/api/services/app/Role/GetRoles")
        .then(result => { 
            this.roleList=result.items;                 
        })  
  },
  methods: {
    handlerAddData(result){
        let inRoles=result.roles.filter(p=>p.isAssigned);
        this.selectedRoleList=inRoles.map(p=>{return p.roleName});  
    },
    handlerEditData(result) {
        let inRoles=result.roles.filter(p=>p.isAssigned);
        this.selectedRoleList=inRoles.map(p=>{return p.roleName});  
    },      
    handlerSaveData(data){
        data.assignedRoleNames=this.selectedRoleList;
        data.setRandomPassword=this.mainForm.setRandomPassword;
        return data;
    }, 
    handlerGoList(){
        this.activeTab="user";
    }         
  },
 }
</script>