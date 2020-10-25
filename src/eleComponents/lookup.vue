<style lang='less' scoped>
  .lookup{

  }
</style>

<template>
    <a-modal class="lookup" :z-index="9999" destroyOnClose
    :title="title"
    v-model="dialogVisible"
    :width="width" :mask="false" @ok="ok">
        <spTable v-bind="$attrs" v-on="$listeners" @selectRows="selectRows">
            <template slot="queryItems">
                <slot name="queryItems"></slot>                           
            </template> 
            <template slot="tableItems">
                <slot name="tableItems"></slot>               
            </template>           
        </spTable>  
    </a-modal>
</template>

<script>
import spTable from '@/eleComponents/spTable'
export default {
  name: 'lookup',  
  mixins:spTable,
  components: {
      spTable,
  },
  props: {
      title: {
          type: String,
          default:'选择数据' 
      },
      width:{
          type:String,
          default:'50%'
      }
  },
  data() { 
    return {
        dialogVisible:false,
        selectedData:null
    }
  },
  methods: {
      show() {
          this.dialogVisible=true;
      },    
      ok() {
          this.$emit('getSelectedData',this.selectedData);
          this.dialogVisible=false;
      },
      selectRows(data){
          this.selectedData=data;
      }
  },
 }
</script>