<style lang='less' scoped>
  .crud{
      height: 100%;
        .rowEdit{
            font-size:18px;
            color: #409EFF;
            cursor:pointer;
        }
        .rowDel{
            margin-left:15px;
            font-size:18px;
            color: red;
            cursor:pointer;
        }      
  }
</style>

<template>
  <a-card :bordered="false" class="crud" v-loading="loading" element-loading-text="拼命加载中">
    <div v-show="pageState=='list'">
        <div class="table-page-search-wrapper" v-show="showQuery">
            <el-form :inline="true" :model="queryForm" ref="queryForm">
                <el-form-item label="销售类型">
                    <el-select v-model="queryForm.sellTypeFilter" placeholder="" clearable>
                      <el-option v-for="(item,index) in sellTypes" :key="index" :label="item.name" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="客户名称">
                    <el-input v-model="queryForm.customerNameFilter" placeholder="" clearable ></el-input>
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
                <el-button type="primary" @click="query" icon="el-icon-search">查询</el-button>
            </el-form>             
        </div>
        <a-divider v-show="showQuery"/>
        <div class="table-operator" :style="`text-align: ${opPosition}`">
            <el-button v-if="isGranted(permissionNames.add)"  icon="el-icon-plus" type="success" @click="add">新增</el-button>
            <slot name="moreBtns"></slot>
        </div>
        <template v-for="(item,index) in tableData" >
            <el-table :data="item" :key="index" :span-method="objectListSpanMethod">
              <el-table-column label="创建时间" prop="" :index='item.length'></el-table-column>
              <el-table-column label="客户名称" prop="" :index='item.length'></el-table-column>
              <el-table-column label="产品名称" prop=""></el-table-column>
              <el-table-column label="产品数量" prop=""></el-table-column>
              <el-table-column label="产品单价" prop=""></el-table-column>
              <el-table-column label="总价" prop="" :index='item.length'></el-table-column>
            </el-table>
        </template>
    </div>
    <div v-show="pageState!='list'">
        <div class="table-operator" :style="`text-align: ${opPosition}`">
            <el-button  icon="el-icon-back" @click="goListPage">返回</el-button>
            <el-button  icon="el-icon-document" type="primary" @click="save" :disabled="formDisabled" :loading="saveLoading">{{saveingTxt}}</el-button>
            <slot name="moreFormBtns"></slot>
        </div>      
        <el-form :model="mainForm" ref="mainForm" :rules="mainFormRule" label-width="100px" :disabled="formDisabled">
            <el-row>
                <el-col :span="4">
                    <el-form-item label="销售类型">
                        <el-select v-model="createdSellType" placeholder="" style="width:100%" @change="sellTypeChange">
                        <el-option v-for="(item,index) in sellTypes" :key="index" :label="item.name" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>                    
                </el-col>
                <el-col :span="8">
                    <el-form-item label="选择客户">
                        <el-select v-model="createdCustomer" placeholder="" style="width:100%" filterable @change="customerChange">
                            <el-option v-for="(item,index) in customerList" :key="index" :label="item.name" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>                    
                </el-col>
                <el-col :span="12">
                    <el-form-item label="选择产品">
                        <el-select v-model="createdProducts" placeholder="" multiple filterable @change="productChange" style="width:100%">
                        <el-option v-for="(item,index) in productList" :key="index" :label="item.name" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>                    
                </el-col>                                  
            </el-row>
            <el-table :data="quoteInfo" border :span-method="objectSpanMethod">
              <el-table-column label="客户名称" prop="cname" :index='quoteInfo.length' header-align="center" align="center"></el-table-column>
              <el-table-column label="产品名称" prop="pname"></el-table-column>
              <el-table-column label="产品数量" prop="count" width="300">
                <template slot-scope="scope">
                    <el-input-number v-model="scope.row.count" placeholder="" style="width:100%" @change="countChange"></el-input-number>
                </template>
              </el-table-column>
              <el-table-column label="产品单价" prop="price" header-align="center" align="center"></el-table-column>
              <el-table-column label="总价" prop="totalPrice" :index='quoteInfo.length' header-align="center" align="center"></el-table-column>
            </el-table>                                                    
        </el-form>          
    </div>  
  </a-card>

</template>

<script>
import { extname } from 'path';
let defaultForm
export default {
    name: 'sell_quote',
    props: {
        mainForm: {
            type: Object,
            default:()=>{} 
        },
        mainFormRule: {
            type: Object,
            default:()=>{} 
        },
        //主键Id名称
        keyId:{
            type:String,
            default:'id'
        },
        dataName:{
            type:String,
            default:'item'            
        },
        warp:{
            type:Boolean,
            default:false
        },        
        opPosition:{
            type:String,
            default:'right'
        },
        //是否显示查询条件
        showQuery:{
            type:Boolean,
            default:true
        },
        //是否分页
        paged:{
            type:Boolean,
            default:true
        },
        //分页数量
        pageSize:{
            type:Number,
            default:20
        },
        //服务端分页
        sPagin:{
            type:Boolean,
            default:true            
        },
        //排序
        sorting:{
            type:String,
            default:''
        },
        //点新增按钮之前的业务判断
        addBefore: {
            type: Function,
            default: () => {return true}
        },
        addFromServe:{
            type:Boolean,
            default:false
        },         
        handlerQueryParams: {
            type: Function,
            default: (r) => {
               r.createStartTime=r.timeRange[0];
               r.createEndTime=r.timeRange[1]
            }
        }, 
        handlerTableDatas: {
            type: Function,
            default: (r) => { return r }
        },
        handlerAddData: {
            type: Function,
            default: (r) => { return r }
        },
        handlerEditData: {
            type: Function,
            default: (r) => { return r }
        },
        handlerGoList: {
            type: Function,
            default: () => {}
        },
        handlerSaveData: {
            type: Function,
            default: (r) => { return r }
        }                           
    },
    data() { 
        return {
            queryForm:{
                sellTypeFilter:null,
                customerNameFilter:'',
                timeRange:[]
            },
            sellTypes:[{name:'内贸',value:'internalPrice'},{name:'外贸',value:'externalPrice'},{name:'代发',value:'insteadPrice'}],    
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
            apiUrl: {
                queryList: '/api/services/app/quotes/GetAll',
                getById: '/api/services/app/quotes/GetproductForEdit',
                del: '/api/services/app/quotes/Delete',
                save: '/api/services/app/quotes/CreateOrEdit'
            },
            permissionNames: {
                add: 'Pages.Sell.Quotes.Create',
                edit: 'Pages.Sell.Quotes.Edit',
                del: 'Pages.Sell.Quotes.Delete'
            },            

            customerList:[],
            productList:[],
            createdSellType:'internalPrice',
            createdCustomer:'',
            createdProducts:[],
            quoteInfo:[],

            pageState:'list',
            tableData: [],
            loading:false,
            saveLoading:false
        }
    },
    computed: {
        //（分页模式才有此计算属性）
        request:{
            // getter
            get: function () {
                    return {
                    url:this.apiUrl.queryList,
                    type:'get'
                }     
            },
            // setter
            set: function (newValue) {
            }            
        },
        formDisabled: function () {
            return this.pageState=="browse" || this.pageState=="list";
        },
        saveingTxt: function () {
            return this.saveLoading?'保存中...':'保存';
        }                 
    },
    mounted(){
        this.query();
        httpClient.get("/api/services/app/quotes/GetAllCustomers")
        .then(result => { 
            this.customerList=result.items.map(p=>{
                return p.customer;
            });                 
        }) 
        httpClient.get("/api/services/app/quotes/GetAllProducts")
        .then(result => { 
            this.productList=result.items.map(p=>{
                return p.product;
            });                 
        })

        defaultForm = _.cloneDeep(this.mainForm);        
    },
    methods: {
        objectListSpanMethod({ row, column, rowIndex, columnIndex }) {            
            if (columnIndex === 0 || columnIndex === 1 || columnIndex === 5) {
                if (rowIndex ===0) {
                    return {
                        rowspan: column.index,
                        colspan: 1
                    };
                } else {
                    return {
                        rowspan: 0,
                        colspan: 0
                    };
                }
            }
        },        
        objectSpanMethod({ row, column, rowIndex, columnIndex }) {            
            if (columnIndex === 0 || columnIndex === 4) {
                if (rowIndex ===0) {
                    return {
                        rowspan: column.index,
                        colspan: 1
                    };
                } else {
                    return {
                        rowspan: 0,
                        colspan: 0
                    };
                }
            }
        },                 
        sellTypeChange(val){            
            if(this.createdProducts.length!=0){
               let exitInfo=_.cloneDeep(this.quoteInfo); 
               let customer={id:'',name:''};
               if(this.createdCustomer!=''){
                   customer=this.customerList.find(p=>p.id==this.createdCustomer);
               }
               this.quoteInfo=[];
                for (let index = 0; index < this.createdProducts.length; index++) {
                    const element = this.createdProducts[index];
                    let product=this.productList.find(p=>p.id==element);
                    let exitProduct=exitInfo.find(p=>p.pid==element);
                    let count=exitProduct?exitProduct.count:0;
                    this.quoteInfo.push({
                        cid:customer.id,
                        cname:customer.name,
                        pid:product.id,
                        pname:product.name,
                        count:count,
                        price:product[val]
                    })              
                }             
            }
        },     
        customerChange(val){
            if(this.createdProducts.length!=0){
               let customer=this.customerList.find(p=>p.id==val);
               for (let index = 0; index < this.quoteInfo.length; index++) {
                   const element = this.quoteInfo[index];
                   element.cid=customer.id;
                   element.cname=customer.name;
               }
            }
        },
        productChange(val){
            let exitInfo=_.cloneDeep(this.quoteInfo); 
            this.quoteInfo=[];
            let customer={id:'',name:''};
            if(this.createdCustomer!=''){
                customer=this.customerList.find(p=>p.id==this.createdCustomer);
            } 

            for (let index = 0; index < this.createdProducts.length; index++) {
                const element = this.createdProducts[index];
                let product=this.productList.find(p=>p.id==element);
                let exitProduct=exitInfo.find(p=>p.pid==element);
                let count=exitProduct?exitProduct.count:0;                
                this.quoteInfo.push({
                    cid:customer.id,
                    cname:customer.name,
                    pid:product.id,
                    pname:product.name,
                    count:count,
                    price:product[this.createdSellType]
                })                
            }                    
        },  
        countChange(){
             console.log(this.quoteInfo);
             let totalPrice=0;
             for (let index = 0; index < this.quoteInfo.length; index++) {
                 const element = this.quoteInfo[index];
                 totalPrice+=element.count*element.price
             }
             for (let index = 0; index < this.quoteInfo.length; index++) {
                 const element = this.quoteInfo[index];
                 element.totalPrice=totalPrice;
             }             
        },      
        rowClick(row, event, column) {
            this.$refs.tableList.toggleRowSelection(row, true);
        }, 
        query() {
            this.loading=true;
            this.loadTableData();
        },               
        loadTableData(){
            let queryParams={};
            if(this.showQuery){
                queryParams=this.queryForm;
            }            
            if(this.sorting!==""){
                queryParams=Object.assign({sorting:this.sorting},queryParams);
            }
            //warp
            let warpData=this.handlerQueryParams(queryParams);
            if(warpData){
                queryParams=warpData;
            }
            
            this.getAllListByServer(queryParams)
            .then(result => {
                //warp
                let warpData=this.handlerTableDatas(result.items);
                if(warpData){
                    this.tableData=warpData;
                }else{
                    this.tableData=result.items;
                }
                this.loading=false;                                                                           
            }) 
        },
        getAllListByServer(queryParams){
            return httpClient.get(this.apiUrl.queryList,{
                params: queryParams
            })            
        },        
        beforeGetData(){
            this.loading=true;
        },               
        add () {
            if(!this.addBefore()){
                return;
            }
            this.pageState = 'add';
            this.createdSellType='internalPrice';
            this.createdCustomer='';
            this.createdProducts=[];
            this.quoteInfo=[];                  
        },
        rowEdit (row) {
            this.pageState = 'edit'
            this.setFormInfoById(row[this.keyId])
        },
        setFormInfoById (dataId) {
            this.selectDataId = dataId
            this.loading=true;
            this.getByServer(dataId)
                .then(result => {
                this.loading=false;
                let handlerResult = result
                if (this.pageState == 'add') {
                    let warpData=this.handlerAddData(handlerResult);
                    if(warpData){
                        handlerResult=warpData;
                    }              
                } else {
                    let warpData=this.handlerEditData(handlerResult);
                    if(warpData){
                        handlerResult=warpData;
                    }                  
                }
                this.setFormInfo(handlerResult[this.dataName])
            })
        },
        setFormInfo (result) {
            let formData
            formData = result
            Object.keys(this.mainForm).forEach((k) => {
                this.mainForm[k] = formData[k]
            })   
        },
        rowDel (row) {
            let self=this;
            this.$confirm({
                title: '提示',
                content: '此操作将永久删除该数据, 是否继续?',
                onOk () {
                //后端删除
                    self.delByServer(row[self.keyId])
                    .then(()=>{
                        self.pageState="list";
                        self.loadTableData();
                        self.$message.success("数据删除成功！");
                    }) 
                },
                onCancel () {
                    self.$message.info('已取消删除');                  
                }
            })            
        },
        save () {
            console.log(this.quoteInfo);
            // this.$refs['mainForm'].validate((valid) => {
            //     if (!valid) { // 表单验证失败
            //         return false
            //     }
            //     let saveData = _.cloneDeep(this.mainForm)
            //     if (this.pageState == 'edit') {
            //         saveData[this.keyId] = this.selectDataId
            //     }
            //     let data;
            //     if(!this.warp){
            //         data=saveData;
            //     }else{   //特殊的有嵌套
            //         data=new Object();
            //         data[this.dataName] = saveData;
            //     }

            //     // todo warp
            //     let handlerData=data;
            //     let warpData = this.handlerSaveData(data)
            //     if(warpData){
            //         handlerData=warpData;
            //     }               
            //     this.saveLoading = true
            //     this.saveServer(handlerData)
            //     .then((result) => {
            //         this.loadTableData()
            //         this.goListPage();
            //         this.saveLoading = false;
            //         this.$message.success('数据保存成功！')
            //     })
            //     .catch((error)=>{
            //          this.saveLoading = false;
            //     });                                
            // })
        },
        goListPage () {
            this.handlerGoList();
            this.$refs['mainForm'].resetFields()
            this.pageState = 'list'
        },
        getByServer (dataId) {
            let params = {}
            params[this.keyId] = dataId
            return httpClient.get(this.apiUrl.getById, {
                params: params
            })
        },
        saveServer (data) {
            return httpClient.post(this.apiUrl.save, data)
        },
        delByServer (dataId) {
            let params = {}
            params[this.keyId] = dataId
            return httpClient.delete(this.apiUrl.del, {
                params: params
            })
        }       
    }, 
 }
</script>