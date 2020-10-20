<style lang='less' scoped>
  .sell_product{

  }
</style>

<template>
  <div class="sell_product">
      <crud dataName="product" :mainFormRule="mainFormRule" :queryForm="queryForm" :mainForm="mainForm" :apiUrl="apiUrl" :permissionNames="permissionNames" :handlerTableDatas="handlerTableDatas">
          <template slot="queryItems">
                <el-form-item label="模糊搜索">
                    <el-input v-model="queryForm.filter" placeholder="" clearable></el-input>
                </el-form-item>   
                <el-form-item label="名称">
                    <el-input v-model="queryForm.nameFilter" placeholder="" clearable></el-input>
                </el-form-item>  
                <el-form-item label="编码">
                    <el-input v-model="queryForm.codeFilter" placeholder="" clearable></el-input>
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
                <el-table-column label="编码" prop="code" header-align="center"></el-table-column>     
                <el-table-column label="库存数量" prop="count" header-align="center"></el-table-column> 
                <el-table-column label="成本价" prop="cost" header-align="center"></el-table-column>
                <el-table-column label="国内批发价" prop="internalPrice" header-align="center"></el-table-column>
                <el-table-column label="国外批发价" prop="externalPrice" header-align="center"></el-table-column>
                <el-table-column label="代发价" prop="insteadPrice" header-align="center"></el-table-column>
                <el-table-column label="启用"  header-align="center" align="center" width="120">
                    <template slot-scope="scope">
                        <el-tag type="success" v-if="scope.row.isActive">是</el-tag>
                        <el-tag type="danger" v-else>否</el-tag>
                    </template> 
                </el-table-column>                 
          </template>
          <template slot="formItems">
               <div style="width:30vw;margin-left:20%">
                    <el-form-item label="名称" prop="name">
                        <el-input v-model="mainForm.name" placeholder=""></el-input>
                    </el-form-item> 
                    <el-form-item label="编码" prop="code">
                        <el-input v-model="mainForm.code" placeholder=""></el-input>
                    </el-form-item> 
                    <el-form-item label="库存数量" prop="count">
                       <el-input-number v-model="mainForm.count" style="width:100%"></el-input-number>
                    </el-form-item>
                    <el-form-item label="成本价" prop="cost">
                       <el-input-number v-model="mainForm.cost" :precision="2" :step="0.1" style="width:100%"></el-input-number>
                    </el-form-item>
                    <el-form-item label="国内批发价" prop="internalPrice">
                       <el-input-number v-model="mainForm.internalPrice" :precision="2" :step="0.1" style="width:100%"></el-input-number>
                    </el-form-item> 
                    <el-form-item label="国外批发价" prop="externalPrice">
                       <el-input-number v-model="mainForm.externalPrice" :precision="2" :step="0.1" style="width:100%"></el-input-number>
                    </el-form-item>    
                    <el-form-item label="代发价" prop="insteadPrice">
                       <el-input-number v-model="mainForm.insteadPrice" :precision="2" :step="0.1" style="width:100%"></el-input-number>
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
  name: 'sell_product',
  data() {
      return {
        queryForm:{
              filter:"",
              name:'',
              code:'',
              isActive:true
        },
        apiUrl: {
            queryList: '/api/services/app/products/GetAll',
            getById: '/api/services/app/products/GetproductForEdit',
            add: '/api/services/app/products/CreateOrEdit',
            edit: '/api/services/app/products/CreateOrEdit',
            del: '/api/services/app/products/Delete',            
        },
        permissionNames: {
            add: 'Pages.Sell.Products.Create',
            edit: 'Pages.Sell.Products.Edit',
            del: 'Pages.Sell.Products.Delete'
        },
        mainForm:{
            name:'',
            code:'',
            count:0,
            cost:0,
            internalPrice:0,
            externalPrice:0,
            insteadPrice:0,
            isActive:true
        },
        mainFormRule:{
            name: [
                { required: true, message: '名称为必须项', trigger: 'blur' },
                { min: 2, max: 200, message: '长度在 2 到 200 个字符', trigger: 'blur' }
            ],
            code: [
                { required: true, message: '编码为必须项', trigger: 'blur' },
                { min: 2, max: 200, message: '长度在 2 到 128 个字符', trigger: 'blur' }
            ]                               
        },          
      }
  },
  methods: {
    handlerTableDatas(datas) {
      return datas.map(p=>{
         return p.product
      })
    },
    ExportExcel () {
        let params =this.queryForm;
        let getProductsToExcelUrl = '/api/services/app/products/GetProductsToExcel'
        httpClient.get(getProductsToExcelUrl, {
            params: params
        })
        .then(result => {
            _fileDownloadService.downloadTempFile(result)
        })
    }, 
  },
 }
</script>