<style lang='less' scoped>
  .crud{
      height: 100%;
  }
</style>

<template>
  <a-card :bordered="false" class="crud">
    <div class="table-page-search-wrapper" v-show="showQuery">
        <el-form :inline="true" :model="queryForm" ref="queryForm">
            <slot name="queryItems"></slot>
            <el-button type="primary" @click="query">查 询</el-button>
        </el-form>             
    </div>
    <el-table ref="tableList" :data="tableData" border style="width: 100%" @row-click="rowClick" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" header-align="center" align="center"></el-table-column>
        <slot name="tableItems"></slot>                  
    </el-table>
    <sPagination v-if="paged" ref="pagin" :request="request" :spSize.sync="pageSize" @paginationData="getPaginData" :serverPagin="sPagin"></sPagination>          
  </a-card>
</template>

<script>
export default {
    name: 'spTable',
    props: {
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
            default:10
        },
        //是否允许多选
        multipleSelected:{
            type:Boolean,
            default:false
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
            type:String,
            default:''             
        },
        handlerQueryParams: {
            type: Function,
            default: (r) => { return r }
        }, 
        handlerTableDatas: {
            type: Function,
            default: (r) => { return r }
        }                   
    },
    data() { 
        return {
            tableData: []
        }
    },
    computed: {
        //（分页模式才有此计算属性）
        request:{
            // getter
            get: function () {
                    return {
                    url:this.apiUrl,
                    type:'get'
                }     
            },
            // setter
            set: function (newValue) {
            }            
        }      
    },
    mounted(){
        this.query();
    },
    methods: {

        query() {
            this.loadTableData();
        },    
        rowClick(row, event, column) {
            this.$refs.tableList.toggleRowSelection(row, true);
        },  
        handleSelectionChange(rows) {
            if(!this.multipleSelected){
                if (rows) {
                    if(rows.length==0){
                        this.selectDataId =null;
                        return
                    }
                    for (let index = 0; index < rows.length - 1; index++) {
                        const row = rows[index];
                        this.$refs.tableList.toggleRowSelection(row, false);
                    }
                    this.$refs.tableList.toggleRowSelection(rows[rows.length - 1], true);
                    this.selectDataId = rows[rows.length - 1][this.keyId];
                    this.$emit('selectRows',rows[rows.length - 1]);
                } else {
                    this.$refs.tableList.clearSelection();
                    this.selectDataId =null;
                }
            }else{
                this.$emit('selectRows',rows);
            }
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
                }) 
            }
        },
        getAllListByServer(queryParams){
            return httpClient.get(this.apiUrl.queryList,{
                params: queryParams
            })            
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
        }, 
    }, 
 }
</script>