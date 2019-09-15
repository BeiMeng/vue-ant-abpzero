<template>
  <div class="admin_Role">
      <crud warp dataName="role" :showQuery="false" :paged="false" :mainForm="mainForm" :mainFormRule="mainFormRule" 
      :apiUrl="apiUrl" :permissionNames="permissionNames" :handlerAddData="handlerAddData" 
      :handlerEditData="handlerEditData" :handlerGoList="handlerGoList" :handlerSaveData="handlerSaveData" addFromServe>
          <template slot="tableItems">
                <el-table-column label="角色名称" prop="displayName" header-align="center"></el-table-column> 
                <el-table-column label="系统"  header-align="center" align="center" width="120">
                    <template slot="header">
                      <el-tooltip class="item" effect="dark" content="系统角色不能删除" placement="top">
                        <span>系统</span>
                      </el-tooltip>
                    </template>                   
                    <template slot-scope="scope">
                        <el-tag type="success" v-if="scope.row.isStatic">是</el-tag>
                        <el-tag type="danger" v-else>否</el-tag>
                    </template> 
                </el-table-column>                  
                <el-table-column label="默认"  header-align="center" align="center" width="120">
                    <template slot="header">
                      <el-tooltip class="item" effect="dark" content="新建用户默认设置的角色" placement="top">
                        <span>默认</span>
                      </el-tooltip>
                    </template>                   
                    <template slot-scope="scope">
                        <el-tag type="success" v-if="scope.row.isDefault">是</el-tag>
                        <el-tag type="danger" v-else>否</el-tag>
                    </template> 
                </el-table-column> 
                <el-table-column label="创建时间" header-align="center" align="center" width="150">
                    <template slot-scope="scope">
                        {{dateTimeFormat(scope.row.creationTime)}}
                    </template>                        
                </el-table-column>    
          </template>
          <template slot="formItems">
                <el-tabs v-model="activeTab">
                  <el-tab-pane label="角色信息" name="role">
                    <div style="width:25vw;margin-left:30px">
                        <el-form-item label="角色名称" prop="displayName">
                            <el-input v-model="mainForm.displayName" placeholder=""></el-input>
                        </el-form-item> 
                        <el-form-item label="是否默认">
                            <el-switch v-model="mainForm.isDefault"  active-text='否' inactive-text='是' :active-value='false' :inactive-value='true'></el-switch>
                        </el-form-item>   
                    </div> 
                  </el-tab-pane>
                  <el-tab-pane label="权限" name="permission">
                    <permission-setting ref="permissionSetting" :treeData="permissionTreeData"></permission-setting>
                  </el-tab-pane>
                </el-tabs>                 
          </template>
      </crud>
  </div>
</template>

<script>
import permissionSetting from './components/permissionSetting'
export default {
  name: 'admim_role',
  components: {
      permissionSetting
  },  
  data() {
    return {
      permissionTreeData:[],
      activeTab:'role',
      mainForm:{
          displayName:'',
          isDefault:false
      },
      mainFormRule:{
          displayName: [
              { required: true, message: '角色名称为必须项', trigger: 'blur' },
              { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
          ],
      },
      apiUrl:{
          queryList:'/api/services/app/Role/GetRoles',
          getById:'/api/services/app/Role/GetRoleForEdit',
          del:'/api/services/app/Role/DeleteRole',
          save:'/api/services/app/Role/CreateOrUpdateRole'
      },
      permissionNames:{
          add:'Pages.Administration.Roles.Create',
          edit:'Pages.Administration.Roles.Edit',
          del:'Pages.Administration.Roles.Delete'
      }
    }
  },
  methods: {
        handlerAddData(result){
            this.$refs.permissionSetting.init();
            this.permissionTreeData = this.arrayToTreeConverter(result.permissions, 'parentName', 'name', null, 'children', false)
        },
        handlerEditData(result) {
            this.$refs.permissionSetting.init();
            this.permissionTreeData = this.arrayToTreeConverter(result.permissions, 'parentName', 'name', null, 'children', false)
            this.$refs.permissionSetting.setGrantedPermissions(result.grantedPermissionNames);  //abpzero的后端修改一下，只保留叶节点选中的数据即可
        },        
        handlerGoList(){
            this.activeTab="role";
        },
        handlerSaveData(data){
            data.grantedPermissionNames=this.$refs.permissionSetting.getPermissions();
            return data;
        }
  },
}
</script>

<style scoped>

</style>