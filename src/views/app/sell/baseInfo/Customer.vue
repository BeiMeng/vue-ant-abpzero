<style lang='less' scoped>
  .sell_customer{

  }
</style>

<template>
  <div class="sell_customer">
      <crud dataName="customer" :mainFormRule="mainFormRule" :queryForm="queryForm" :mainForm="mainForm" :apiUrl="apiUrl" :permissionNames="permissionNames" :handlerTableDatas="handlerTableDatas">
          <template slot="queryItems">
                <el-form-item label="模糊搜索">
                    <el-input v-model="queryForm.filter" placeholder="" clearable></el-input>
                </el-form-item>   
                <el-form-item label="名称">
                    <el-input v-model="queryForm.nameFilter" placeholder="" clearable></el-input>
                </el-form-item>  
                <el-form-item label="电话">
                    <el-input v-model="queryForm.phoneFilter" placeholder="" clearable></el-input>
                </el-form-item>   
                <el-form-item label="启用">
                    <el-switch v-model="queryForm.isActive"  active-text='否' inactive-text='是' :active-value='false' :inactive-value='true'></el-switch>
                </el-form-item>                                                                           
          </template>
          <template slot="moreBtns">
            <el-button type="info" icon="el-icon-download" @click="ExportExcel">导出Excel</el-button>
          </template>      
          <template slot="tableItems">
                <el-table-column label="名称" prop="name" header-align="center"></el-table-column> 
                <el-table-column label="电话" prop="phone" header-align="center"></el-table-column>     
                <el-table-column label="邮箱" prop="email" header-align="center"></el-table-column> 
                <el-table-column label="启用"  header-align="center" align="center" width="120">
                    <template slot-scope="scope">
                        <el-tag type="success" v-if="scope.row.isActive">是</el-tag>
                        <el-tag type="danger" v-else>否</el-tag>
                    </template> 
                </el-table-column>                
                <el-table-column label="收货地址" prop="address" header-align="center"></el-table-column>
                <el-table-column label="备注" prop="remark" header-align="center"></el-table-column>     
          </template>
          <template slot="formItems">
               <div style="width:40vw;margin-left:20%">
                    <el-form-item label="名称" prop="name">
                        <el-input v-model="mainForm.name" placeholder=""></el-input>
                    </el-form-item> 
                    <el-form-item label="电话" prop="phone">
                        <el-input v-model="mainForm.phone" placeholder=""></el-input>
                    </el-form-item> 
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="mainForm.email" placeholder=""></el-input>
                    </el-form-item>
                    <el-form-item label="收货地址" prop="address">
                        <el-input v-model="mainForm.address" placeholder="" type="textarea" :autosize="{ minRows: 3}"></el-input>
                    </el-form-item>
                    <el-form-item label="备注" prop="remark">
                        <el-input v-model="mainForm.remark" placeholder="" type="textarea" :autosize="{ minRows: 4}"></el-input>
                    </el-form-item>  
                    <el-form-item label="是否启用">
                        <el-switch v-model="mainForm.isActive"  active-text='否' inactive-text='是' :active-value='false' :inactive-value='true'></el-switch>
                    </el-form-item>                                                                                                
               </div>
          </template>
      </crud>
  </div>
</template>

<script>
import { FileDownloadService } from '@/abpZero/utils/file-download.service.js'
let _fileDownloadService = new FileDownloadService()
export default {
  name: 'sell_customer',
  data() {
      return {
        queryForm:{
              filter:"",
              name:'',
              phone:'',
              isActive:true
        },
        apiUrl: {
            queryList: '/api/services/app/Customers/GetAll',
            getById: '/api/services/app/Customers/GetCustomerForEdit',
            add: '/api/services/app/Customers/CreateOrEdit',
            edit: '/api/services/app/Customers/CreateOrEdit',
            del: '/api/services/app/Customers/Delete'
        },
        permissionNames: {
            add: 'Pages.Sell.Customers.Create',
            edit: 'Pages.Sell.Customers.Edit',
            del: 'Pages.Sell.Customers.Delete'
        },
        mainForm:{
            name:'',
            phone:'',
            email:'',
            address:'',
            remark:'',
            isActive:true
        },
        mainFormRule:{
            name: [
                { required: true, message: '名称为必须项', trigger: 'blur' },
                { min: 2, max: 200, message: '长度在 2 到 200 个字符', trigger: 'blur' }
            ], 
            phone: [
                { required: true, message: '电话为必须项', trigger: 'blur' },
                { min: 11, max: 11, message: '长度为11个字符', trigger: 'blur' }
            ]                    
        },          
      }
  },
  methods: {
    handlerTableDatas(datas) {
      return datas.map(p=>{
         return p.customer
      })
    },
    ExportExcel () {
        let params =this.queryForm;
        let getCustomersToExcelUrl = '/api/services/app/customers/GetCustomersToExcel'
        httpClient.get(getCustomersToExcelUrl, {
            params: params
        })
        .then(result => {
            _fileDownloadService.downloadTempFile(result)
        })
    },
  },
 }
</script>