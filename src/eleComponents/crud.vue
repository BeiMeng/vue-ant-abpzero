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
                <slot name="queryItems"></slot>
                <el-button type="primary" @click="query" icon="el-icon-search">查询</el-button>
            </el-form>             
        </div>
        <a-divider v-show="showQuery"/>
        <div class="table-operator" :style="`text-align: ${opPosition}`">
            <el-button v-if="isGranted(permissionNames.add)"  icon="el-icon-plus" type="success" @click="add">新增</el-button>
            <slot name="moreBtns"></slot>
        </div>
        <el-table ref="tableList" :data="tableData" border style="width: 100%" @row-click="rowClick">
            <!-- <el-table-column type="selection" width="55" header-align="center" align="center"></el-table-column> -->
            <slot name="tableItems"></slot>                  
            <el-table-column v-if="isGranted(permissionNames.edit) || isGranted(permissionNames.del)" fixed="right" label="操作" width="120" header-align="center" align="center">
                <template slot-scope="scope">
                    <el-row>
                        <i v-if="isGranted(permissionNames.edit)" class="el-icon-edit rowEdit" title="编辑" @click="rowEdit(scope.row)"></i>
                        <i v-if="isGranted(permissionNames.del)" class="el-icon-delete rowDel" title="删除" @click="rowDel(scope.row)"></i>
                    </el-row>
                </template>
            </el-table-column> 
        </el-table>
        <sPagination v-if="paged" ref="pagin" :request="request" :spSize.sync="spSize" @paginationData="getPaginData" :serverPagin="sPagin" @beforeGetData="beforeGetData"></sPagination>    
    </div>
    <div v-show="pageState!='list'">
        <div class="table-operator" :style="`text-align: ${opPosition}`">
            <el-button  icon="el-icon-back" @click="goListPage">返回</el-button>
            <el-button  icon="el-icon-document" type="primary" @click="save" :disabled="formDisabled" :loading="saveLoading">{{saveingTxt}}</el-button>
            <slot name="moreFormBtns"></slot>
        </div>      
        <el-form :model="mainForm" ref="mainForm" :rules="mainFormRule" label-width="100px" :disabled="formDisabled">
            <slot name="formItems"></slot>                               
        </el-form>          
    </div>  
  </a-card>

</template>

<script>
let defaultForm
export default {
    name: 'crud',
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
        queryForm: {
            type: Object,
            default:()=>{} 
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
        //数据Api
        apiUrl:{
            type: Object,
            default: {
                queryList:'',
                getById:'',
                del:'',
                save:''
            }               
        },
        permissionNames:{
            type: Object,
            default: {
                add:'',
                edit:'',
                del:''
            }             
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
            default: (r) => { return r }
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
            pageState:'list',
            tableData: [],
            loading:false,
            saveLoading:false,
            spSize:20
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
        this.spSize=this.pageSize;        
        defaultForm = _.cloneDeep(this.mainForm);
        this.query();
    },
    methods: {     
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
            
            if(this.paged){
                this.$refs.pagin.query(queryParams);
            }else{
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
            }
        },
        getAllListByServer(queryParams){
            return httpClient.get(this.apiUrl.queryList,{
                params: queryParams
            })            
        },        
        beforeGetData(){
            this.loading=true;
        },
        //设置分页数据
        getPaginData(list){
            //warp
            let warpData=this.handlerTableDatas(list);
            if(warpData){
                this.tableData=warpData;
            }else{
                this.tableData=list;
            }
            this.loading=false;                                   
        },                
        add () {
            if(!this.addBefore()){
                return;
            }
            this.pageState = 'add'
            Object.keys(this.mainForm).forEach((k) => {
                this.mainForm[k] = defaultForm[k]
            })
            if(this.addFromServe){
                this.setFormInfoById(null)
            }           
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
            this.$refs['mainForm'].validate((valid) => {
                if (!valid) { // 表单验证失败
                    return false
                }
                let saveData = _.cloneDeep(this.mainForm)
                if (this.pageState == 'edit') {
                    saveData[this.keyId] = this.selectDataId
                }
                let data;
                if(!this.warp){
                    data=saveData;
                }else{   //特殊的有嵌套
                    data=new Object();
                    data[this.dataName] = saveData;
                }

                // todo warp
                let handlerData=data;
                let warpData = this.handlerSaveData(data)
                if(warpData){
                    handlerData=warpData;
                }               
                this.saveLoading = true
                this.saveServer(handlerData)
                .then((result) => {
                    this.loadTableData()
                    this.goListPage();
                    this.saveLoading = false;
                    this.$message.success('数据保存成功！')
                })
                .catch((error)=>{
                     this.saveLoading = false;
                });                                
            })
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