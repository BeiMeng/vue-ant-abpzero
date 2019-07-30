<style lang='less'>
   .permission-tree{
        margin-left: 15px;
        overflow-y: auto;
        //background: $background;
        height: calc(100vh - 340px);
        .el-tree-node__expand-icon {
            font-size: 18px;
            color: #409EFF;
        }
        .el-tree-node__expand-icon.is-leaf {
            color: transparent;
            cursor: default;
        }
        .el-tree-node__label {
            font-size: 16px;
        }
        .el-tree-node {
            margin-top: 10px;
        }
        .el-tree-node:focus > .el-tree-node__content {
            background-color: #a0cffd;
        }       
   }
</style>
<style lang='less' scoped>
  .admin_permissionSetting{
    .leftTab{
      height: calc(100vh - 340px);
    }
  }
</style>

<template>
  <div class="admin_permissionSetting">
      <el-tabs v-model="activeTab" tab-position="left" class="leftTab">
        <el-tab-pane label="功能权限" name="funPerm">
                <el-tree ref="permissionTree" node-key="name" class="permission-tree" :data="permissionTreeData" :props="defaultProps" 
                show-checkbox :default-expanded-keys="defaultExpandedKeys" default-expand-all></el-tree>  
        </el-tab-pane>
        <el-tab-pane label="数据权限" name="dataPerm">
          开发中...
        </el-tab-pane>
      </el-tabs> 
  </div>
</template>

<script>
export default {
  name: 'admin_permissionSetting',
  data() { 
    return {
      activeTab:'funPerm',
      defaultExpandedKeys:[],
      permissionTreeData:[],
      defaultProps:{
          children: 'children',
          label: 'displayName'                
      },      
    }
  },
    mounted(){
        this.init();
        this.permissionTreeData=[];
        httpClient.get("/api/services/app/Common/GetAllPermissionTree")   //添加获取全部权限的接口
        .then(result => { 
            this.permissionTreeData.push(result)                 
        })          
    },
    methods: {
        init(){
            this.activeTab="funPerm";   
            this.$refs.permissionTree.setCheckedKeys([]);      
        },
        setGrantedPermissions(grantedPermissions){
            this.$refs.permissionTree.setCheckedKeys(grantedPermissions);
            this.defaultExpandedKeys=grantedPermissions;            
        },
        getPermissions(){
            let checkedNodes=this.$refs.permissionTree.getCheckedNodes(false,true);
            let grantedPermissionNames=checkedNodes.map((p)=>{
                return p.name
            });
            return grantedPermissionNames;            
        }      
    },  
 }
</script>