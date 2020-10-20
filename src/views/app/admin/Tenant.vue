<style lang='less' scoped>
  .admin_Tenant{

  }
</style>

<template>
  <div class="admin_Tenant">
      <crud :warp="false"  :queryForm="queryForm" :showQuery="true" :paged="true" useUpdateForm :mainForm="mainForm" :mainFormRule="mainFormRule"
       :updateForm="updateForm" :updateFormRule="updateFormRule"
      :apiUrl="apiUrl" :permissionNames="permissionNames"  :addFromServe="false" :handlerQueryParams="handlerQueryParams">
          <template slot="queryItems">
                <el-form-item label="租户名称或租户编码">
                    <el-input v-model="queryForm.filter" placeholder="" clearable></el-input>
                </el-form-item> 
                <el-form-item label="创建时间">
                    <el-date-picker
                    v-model="queryForm.timeRange"
                    type="datetimerange"
                    :picker-options="pickerOptions"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    align="right" clearable >
                    </el-date-picker>                    
                </el-form-item>                               
          </template>      
          <template slot="tableItems">
                <el-table-column label="租户编码" prop="tenancyName" header-align="center">
                    <template slot-scope="scope">
                        <span>{{scope.row.tenancyName}}</span>
                        <i class="el-icon-coin" style="margin-left:6px;font-size:18px;color: #409eff;" v-if="scope.row.connectionString"></i>
                    </template>                     
                </el-table-column> 
                <el-table-column label="租户名称" prop="name" header-align="center"></el-table-column>           
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
          </template>
          <template slot="formItems">
            <el-form-item label="租户编码" prop="tenancyName">
                <el-input v-model="mainForm.tenancyName" placeholder=""></el-input>
            </el-form-item>               
            <el-form-item label="租户名称" prop="name">
                <el-input v-model="mainForm.name" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="独立数据库">
                <el-switch v-model="useSelfDb"  active-text='否' inactive-text='是' :active-value='false' :inactive-value='true'></el-switch>
            </el-form-item>                
            <el-form-item label="数据库链接字符串" prop="connectionString" v-if="useSelfDb">
                <el-input v-model="mainForm.connectionString" placeholder=""></el-input>
            </el-form-item> 
           <el-form-item label="管理员邮箱" prop="adminEmailAddress">
                <el-input v-model="mainForm.adminEmailAddress" placeholder=""></el-input>
            </el-form-item>    
            <el-form-item label="随机密码">
                <el-switch v-model="setRandomPassword"  active-text='否' inactive-text='是' :active-value='false' :inactive-value='true'></el-switch>
            </el-form-item> 
            <el-form-item label="密码" prop="adminPassword" v-if="!setRandomPassword">
                <el-input v-model="mainForm.adminPassword" placeholder="" show-password></el-input>
            </el-form-item> 
            <el-form-item label="密码(核对)" prop="againAdminPassword" v-if="!setRandomPassword">
                <el-input v-model="mainForm.againAdminPassword" placeholder="" show-password></el-input>
            </el-form-item>                               
            <el-form-item label="是否激活">
                <el-switch v-model="mainForm.isActive"  active-text='否' inactive-text='是' :active-value='false' :inactive-value='true'></el-switch>
            </el-form-item>       
          </template> 
          <template slot="updateFormItems">
            <el-form-item label="租户编码" prop="tenancyName">
                <el-input v-model="updateForm.tenancyName" placeholder="" disabled></el-input>
            </el-form-item>               
            <el-form-item label="租户名称" prop="name">
                <el-input v-model="updateForm.name" placeholder=""></el-input>
            </el-form-item>   
            <el-form-item label="数据库链接字符串" prop="connectionString" v-if="updateForm.connectionString">
                <el-input v-model="updateForm.connectionString" placeholder=""></el-input>
            </el-form-item>
            <div style="padding-left:50px;">
                 <el-alert v-if="updateForm.connectionString" :closable="false" style="font-size:16px" title="通知：在更改租户的数据库连接字符串之前，应将租户数据库移到新的位置。更改连接字符串并不会移动数据库。" type="warning" effect="dark"></el-alert>
            </div>           
            <el-form-item label="是否激活">
                <el-switch v-model="updateForm.isActive"  active-text='否' inactive-text='是' :active-value='false' :inactive-value='true'></el-switch>
            </el-form-item>                
          </template>             
      </crud>
  </div>
</template>

<script>
export default {
  name: 'admin_Tenant',
  data() { 
    var validatePassAgain = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.mainForm.adminPassword) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
    };
    var checkEmail = (rule, value, callback) => {
        const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
        if (!value) {
        return callback(new Error('邮箱不能为空'))
        }
        setTimeout(() => {
        if (mailReg.test(value)) {
            callback()
        } else {
            callback(new Error('请输入正确的邮箱格式'))
        }
        }, 100)
    }       
    return {
        useSelfDb:false,
        setRandomPassword:false,
        pickerOptions: {
            shortcuts: [{
                text: '最近一周',
                onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                picker.$emit('pick', [start, end]);
                }
                }, {
                    text: '最近一个月',
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                    picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近三个月',
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                    picker.$emit('pick', [start, end]);
                    }
            }]
        },       
        queryForm:{
            filter:"",
            timeRange:[]       
        },        
        mainForm:{
            tenancyName:'',
            name:'',
            connectionString:'',
            adminEmailAddress:'',
            adminPassword:'',
            againAdminPassword:'',
            isActive:true
        },
        mainFormRule:{
            tenancyName: [
                { required: true, message: '租户编码为必须项', trigger: 'blur' },
                { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
            ],            
            name: [
                { required: true, message: '租户名称为必须项', trigger: 'blur' },
                { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
            ],
            connectionString: [
                { required: true, message: '数据库链接字符串为必须项', trigger: 'blur' },
                { min: 2, max: 500, message: '长度在 2 到 500 个字符', trigger: 'blur' }
            ],
            adminPassword: [
                { required: true, message: '密码为必须项', trigger: 'blur' },
                { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
            ],
            againAdminPassword: [
                { validator: validatePassAgain, trigger: 'blur' }
            ],
            adminEmailAddress: [
                { validator: checkEmail, trigger: 'blur' }
            ]                            
        },
        updateForm:{
            tenancyName:'',
            name:'',
            connectionString:'',
            isActive:false
        },
        updateFormRule:{
            name: [
                { required: true, message: '租户名称为必须项', trigger: 'blur' },
                { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
            ],
            connectionString: [
                { required: true, message: '数据库链接字符串为必须项', trigger: 'blur' },
                { min: 2, max: 500, message: '长度在 2 到 500 个字符', trigger: 'blur' }
            ]            
        },        
        apiUrl:{
            queryList:'/api/services/app/Tenant/GetTenants',
            getById:'/api/services/app/Tenant/GetTenantForEdit',
            add:'/api/services/app/Tenant/CreateTenant',
            edit:'/api/services/app/Tenant/EditTenant',
            del:'/api/services/app/Tenant/DeleteTenant'
        },
        permissionNames:{
            add:'Pages.Tenants.Create',
            edit:'Pages.Tenants.Edit',
            del:'Pages.Tenants.Delete'
        }
    }
  },
  methods: {
    handlerQueryParams(params) {
    params.creationDateStart=params.timeRange[0];
    params.creationDateEnd=params.timeRange[1];
    return params;
    },
    handlerSaveData(data,pageState){
        if(this.pageState=="edit"){
            if(this.setRandomPassword){
                data.adminPassword=null
            }
        }
        return data;
    },       
  },
 }
</script>