<template>
  <div>
    <el-input v-model="key" placeholder=""></el-input>
    <el-button type="primary" @click="show"></el-button>
   <el-dialog
  title="提示" :z-index="9999"
  :visible.sync="dialogVisible"
  width="30%">
  <span>这是一段信息</span>
  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
  </span>
</el-dialog>    
  </div>
</template>

<script>

export default {
  name: 'admin_test1',
  data() {
    return {
      key: "value",
      dialogVisible:false
    }
  },
  methods: {
    show() {
      this.dialogVisible=true;
    }
  },
}
</script>

<style scoped>

</style>