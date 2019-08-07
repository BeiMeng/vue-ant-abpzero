<style lang='less' scoped>
    .saveImg{
        width:auto; 
        display:inline-block !important;
        display:inline;      
    }
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
        <template v-for="(item,index) in tableData">
            <el-table :data="item" :key="index" :span-method="objectListSpanMethod" border>
              <el-table-column label="创建时间" prop="creationTime" :index='item.length' header-align="center" align="center">
                    <template slot-scope="scope">
                        {{dateTimeFormat(scope.row.creationTime)}}
                    </template>                       
              </el-table-column>
              <el-table-column label="销售类型" :index='item.length' header-align="center" align="center">
                    <template slot-scope="scope">
                        {{getSellTypeLabel(scope.row.sellType)}}
                    </template>  
              </el-table-column>
              <el-table-column label="客户名称" prop="cname" :index='item.length' header-align="center"></el-table-column>
              <el-table-column label="产品名称" prop="name" header-align="center"></el-table-column>
              <el-table-column label="产品数量" prop="count" header-align="center" align="center"></el-table-column>
              <el-table-column label="产品单价" prop="price" header-align="center" align="center"></el-table-column>
              <el-table-column label="总价" prop="totalPrice" :index='item.length' header-align="center" align="center"></el-table-column>
              <el-table-column label="下载图片" header-align="center" align="center" :index='item.length'>
                    <template slot-scope="scope">
                        <el-button type="primary" @click="downloadImg(item,scope.row.cname)">下载</el-button>
                    </template>                                   
              </el-table-column>
                <el-table-column v-if="isGranted(permissionNames.edit) || isGranted(permissionNames.del)" fixed="right" label="操作" width="120" header-align="center" align="center" :index='item.length'>
                    <template slot-scope="scope">
                        <el-row>
                            <i v-if="isGranted(permissionNames.edit)" class="el-icon-edit rowEdit" title="编辑" @click="rowEdit(item)"></i>
                            <i v-if="isGranted(permissionNames.del)" class="el-icon-delete rowDel" title="删除" @click="rowDel(scope.row)"></i>
                        </el-row>
                    </template>
                </el-table-column>               
            </el-table>
            <a-divider/>
        </template>
    </div>
    <div v-show="pageState!='list'">
        <div class="table-operator" :style="`text-align: ${opPosition}`">
            <el-button  icon="el-icon-back" @click="goListPage">返回</el-button>
            <el-button  icon="el-icon-document" type="primary" @click="save" :disabled="formDisabled" :loading="saveLoading">{{saveingTxt}}</el-button>
            <el-button  icon="el-icon-document" type="primary" @click="saveAndDownLoad" :disabled="formDisabled" :loading="saveLoading">{{saveingAndDownLoadTxt}}</el-button>
        </div>      
        <el-form label-width="100px" :disabled="formDisabled">
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
            <el-table :data="quoteInfo" border :span-method="objectSpanMethod" v-show="!saveImg">
                <el-table-column label="客户名称" prop="cname" :index='quoteInfo.length' header-align="center"></el-table-column>
                <el-table-column label="产品名称" prop="name" header-align="center"></el-table-column>
                <el-table-column label="产品数量" prop="count" width="300" header-align="center" align="center">
                    <template slot-scope="scope">
                        <el-input-number v-model="scope.row.count" placeholder="" style="width:100%" @change="countChange"></el-input-number>
                    </template>
                </el-table-column>
                <el-table-column label="产品单价" prop="price" header-align="center" align="center"></el-table-column>
                <el-table-column label="总价" prop="totalPrice" :index='quoteInfo.length' header-align="center" align="center"></el-table-column>
            </el-table>                                                             
        </el-form>          
    </div> 
    <div ref="quoteInfo" class="saveImg" v-if="saveImg">
        <el-table :data="downImgInfo" border :span-method="objectSpanMethod">
            <el-table-column label="客户名称" prop="cname" :index='downImgInfo.length' header-align="center" align="center"  width="100%"></el-table-column>
            <el-table-column label="产品名称" prop="name" width="100%" header-align="center" align="center"></el-table-column>
            <el-table-column label="产品数量" prop="count" width="100%" header-align="center" align="center"></el-table-column>
            <el-table-column label="产品单价" prop="price" header-align="center" align="center" width="100%"></el-table-column>
            <el-table-column label="总价" prop="totalPrice" :index='downImgInfo.length' header-align="center" align="center" width="100%"></el-table-column>
        </el-table>
    </div>        
  </a-card>

</template>

<script>
import html2canvas from "html2canvas"
let defaultForm
export default {
    name: 'sell_quote',
    props: {    
        opPosition:{
            type:String,
            default:'right'
        },
        //是否显示查询条件
        showQuery:{
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
        handlerTableDatas: {
            type: Function,
            default: (r) => { 
                let d=r.map(p=>{
                    let cname=p.customerName;
                    let quote=p.quote;
                    let item=p.quote.productInfos.map(t=>{
                        t.cid=p.customerId;
                        t.cname=cname;
                        t.sellType=quote.sellType;
                        t.creationTime=quote.creationTime;
                        t.totalPrice=quote.totalPrice;
                        t.qId=quote.id;
                        return t;
                    });
                    return item;
                });
                return d 
            }
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
            sellTypes:[{name:'内贸',value:'internalPrice',index:0},{name:'外贸',value:'externalPrice',index:1},{name:'代发',value:'insteadPrice',index:2}],    
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
            saveImg:false,
            createdCustomerObj:null,
            downImgInfo:[],

            editId:null,
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
        },
        saveingAndDownLoadTxt: function () {
            return this.saveLoading?'保存中...':'保存并截图';
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
    },
    methods: {
        getSellTypeLabel(val){
            let sellType=this.sellTypes.find(p=>p.index==val);
            return sellType.name;
        },
        objectListSpanMethod({ row, column, rowIndex, columnIndex }) {            
            if (columnIndex === 0 || columnIndex === 1 || columnIndex === 2 || columnIndex === 6 || columnIndex === 7 || columnIndex === 8) {
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
                    let exitProduct=exitInfo.find(p=>p.id==element);
                    let count=exitProduct?exitProduct.count:0;
                    this.quoteInfo.push({
                        cid:customer.id,
                        cname:customer.name,
                        id:product.id,
                        name:product.name,
                        count:count,
                        price:product[val]
                    })              
                }             
            }
        },     
        customerChange(val){
            let customer=this.customerList.find(p=>p.id==val);
            this.createdCustomerObj=customer;
            if(this.createdProducts.length!=0){               
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
                let exitProduct=exitInfo.find(p=>p.id==element);
                let count=exitProduct?exitProduct.count:0;                
                this.quoteInfo.push({
                    cid:customer.id,
                    cname:customer.name,
                    id:product.id,
                    name:product.name,
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
            let queryInfo=_.cloneDeep(queryParams); 
            let sellTypeObj=this.sellTypes.find(p=>p.value==queryInfo.sellTypeFilter);

            queryInfo.sellTypeFilter=sellTypeObj==null?null:sellTypeObj.index;
            queryInfo.createStartTime=queryInfo.timeRange[0];
            queryInfo.createEndTime=queryInfo.timeRange[1]                        
            this.getAllListByServer(queryInfo)
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
            this.editId=null;                  
        },
        rowEdit (item) {
            this.pageState = 'edit';
            let sellType=this.sellTypes.find(p=>p.index==item[0].sellType);
            this.createdSellType=sellType.value;
            this.createdCustomer=item[0].cid;
            this.createdProducts=item.map(p=>{
                return p.id
            });
            this.quoteInfo=item;
            this.editId=item[0].qId;
            //this.setFormInfoById(row[this.keyId])
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
                    self.delByServer(row.qId)
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
        downloadImg(downImgInfo,picName){
            this.saveImg=true;                    
            this.$nextTick(()=>{
                this.downImgInfo=_.cloneDeep(downImgInfo);
                setTimeout(() => {
                    html2canvas(this.$refs.quoteInfo, {
                        dpi: window.devicePixelRatio*2,
                        scale:2,
                    }).then(canvas => {
                        // 转成图片，生成图片地址
                        let imgUrl = canvas.toDataURL("image/png",1.0);
                        // 创建隐藏的可下载链接
                        var eleLink = document.createElement("a");
                        eleLink.href = imgUrl; // 转换后的图片地址
                        eleLink.download = picName;
                        // 触发点击
                        document.body.appendChild(eleLink);
                        eleLink.click();
                        // 然后移除
                        document.body.removeChild(eleLink); 
                        this.saveImg=false;             
                    }); 
                }, 1000)                               
            })
        },
        getSaveInfo(){
            if(this.createdProducts.length==0){
                this.$message.warning("请选择至少一个产品！");
                return false;
            }            
            if(this.createdCustomer==''){
                this.$message.warning("请选择一个客户！");
                return false;
            }
            let existZero=false;
            for (let index = 0; index < this.quoteInfo.length; index++) {
                const element = this.quoteInfo[index];
                if(element.count==0){
                    existZero=true;
                    break;
                }
            } 
            if(existZero){
                this.$message.warning("选择的产品的数量不能为0！");
                return false;
            }
            this.countChange();
            let sellTypeObj=this.sellTypes.find(p=>p.value==this.createdSellType);
            let productInfos=this.quoteInfo.map(p=>{
                return {
                    id:p.id,
                    name:p.name,
                    count:p.count,
                    price:p.price
                };
            });
            let saveData={
                id:this.editId,
                sellType:sellTypeObj.index,
                customerId:this.createdCustomer,
                productInfos:productInfos
            }; 
            return saveData; 
        },
        saveAndDownLoad(){
            let saveData=this.getSaveInfo();
            if(!saveData){
                return;
            }         
            this.saveLoading = true
            this.saveServer(saveData)
            .then((result) => {
                this.goListPage();
                this.saveLoading = false;
                this.query();
                this.$message.success('数据保存成功！');
                this.downloadImg(this.quoteInfo,this.createdCustomerObj.name);
            })
            .catch((error)=>{
                this.saveLoading = false;
            }); 
        },
        save () {
            let saveData=this.getSaveInfo();
            if(!saveData){
                return;
            }         
            console.log(saveData);
            this.saveLoading = true
            this.saveServer(saveData)
            .then((result) => {
                this.goListPage();
                this.query();
                this.saveLoading = false;
                this.$message.success('数据保存成功！')
            })
            .catch((error)=>{
                this.saveLoading = false;
            }); 
        },
        goListPage () {
            this.handlerGoList();
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
            params['id'] = dataId
            return httpClient.delete(this.apiUrl.del, {
                params: params
            })
        }       
    }, 
 }
</script>