<style lang='less' scoped>
  .sPagination{

  }
</style>

<template>
  <div class="sPagination">
      <el-pagination v-bind="_props" :total="totalCount" :current-page="pageIndex" :page-size="spSize"
       :style="`text-align: ${position};margin-top:5px`" :layout="spLayout"
       @current-change="pageChange" @size-change="sizeChange">
       </el-pagination>
  </div>
</template>

<script>
// 服务端分页组件
// 1.继承自element-ui 的 Pagination组件，支持Pagination组件的全部属性和api
// 2.支持服务端分页
// 3.支持内存分页
// 4.匹配不同服务端api,自行修改相关代码

import { Pagination } from 'element-ui'
export default {
  name: 'sPagination',
  mixins: [Pagination],
  props: {
     request: {
      type: Object,
      default: function () {
        return {
          url: '',
          type: 'post'
        }
      }
    }, 
    serverPagin: {
      type: Boolean,
      default: true
    },       
    position: {
        type: String,
        default:'center' 
    },
    spSize: {
        type: Number,
        default: 20
    },
    spLayout:{
        type: String,
        default: 'sizes,prev, pager, next, jumper, ->, total'       
    },    
  },
  data() { 
    return {
        totalCount: 0,
        pageIndex: 1,
        allData:[],
        params:{}
    }
  },
  methods: {
    query (newParams) {
      this.params = newParams
      this.pageIndex = 1
      this.allData = []
      this.getTableData()
    },
    pageChange (pageIndex) {
      this.pageIndex = pageIndex
      this.getTableData()
    },
    sizeChange (ps) {
      // 不能直接修改父组件传过来的props 属性,可以给props属性添加.sync关键字,并触发以下事件,通过父组件来间接修改spSize
      this.$emit('update:spSize', ps)
      // 通过上面方式修改spSize属性之后,不能立即获得，下面方法将回调延迟到下次 DOM 更新循环之后执行。在修改数据之后立即使用它，然后等待 DOM 更新，可以获取最新修改后的spSize
      this.$nextTick(() => {
        this.getTableData()
      })
    },
    async getTableData () {
      this.$emit('beforeGetData')
      if (this.serverPagin) {
        await this.loadServerPagin()
        return
      }
      // 内存分页逻辑
      await this.loadNoServerPagin()
    },
    async loadServerPagin () {
      let pagedParams = {
        ...this.params,
        ...{
          MaxResultCount: this.spSize,
          SkipCount: (this.pageIndex - 1) * this.spSize
        }
      }
      try {
        let data = {}
        if (this.request.type == 'post') {
          httpClient.post(this.request.url, pagedParams)
            .then(result => {
              this.totalCount = result.totalCount
              this.$emit('paginationData', result.items)
            })
        } else {
          httpClient.get(this.request.url, {
            params: pagedParams
          })
            .then(result => {
              this.totalCount = result.totalCount
              this.$emit('paginationData', result.items)
            })
        }
      } catch (e) {
        console.log(e)
        this.$emit('paginationData', [])
        this.$message.error(e)
      }
    },
    async loadNoServerPagin () {
      if (this.allData.length != 0) {
        this.$emit('paginationData', this.pagination(this.pageIndex, this.spSize, this.allData))
        return
      }
      try {
        let data = {}
        if (this.request.type == 'post') {
          data = await httpCalc.postAsync(
            this.request.url,
            this.params
          )
        } else {
          data = await httpCalc.getAsync(
            this.request.url, this.params
          )
        }
        if (this.request.type == 'post') {
          httpClient.post(this.request.url, pagedParams)
            .then(result => {
              this.totalCount = result.items.length
              this.allData = result.items
              this.$emit('paginationData', this.pagination(this.pageIndex, this.spSize, this.allData))
            })
        } else {
          httpClient.get(this.request.url, {
            params: pagedParams
          })
            .then(result => {
              this.totalCount = result.items.length
              this.allData = result.items
              this.$emit('paginationData', this.pagination(this.pageIndex, this.spSize, this.allData))
            })
        }
      } catch (e) {
        console.log(e)
        this.$message.error(e)
      }
    },
    pagination (pageNo, spSize, array) {
      var offset = (pageNo - 1) * spSize
      return (offset + spSize >= array.length) ? array.slice(offset, array.length) : array.slice(offset, offset + spSize)
    }
  },
 }
</script>