<template>
   <div class="tenantChange">
    {{l("CurrentTenant")}}: <span v-if="tenant.tenancyName" :title="tenant.name"><strong>{{tenant.tenancyName}}</strong></span> <span v-if="!tenant.tenancyName">{{l("NotSelected")}}</span> (<a href="javascript:;" @click="showChangeModal()">{{l("Change")}}</a>)  
    <tenantChangeModal ref="tenantChangeModal"></tenantChangeModal>     
   </div>
</template>

<script>
import tenantChangeModal from './tenantChangeModal'
export default {
  name:'tenantChange',
  components: {
      tenantChangeModal,
  },
  computed: {
    tenant() {
      if(this.$store.state.appSession.tenant!=null){
        return this.$store.state.appSession.tenant
      }else{
        return {
            tenancyName:'',
            name:''
        }
      }      
    }   
  },
  methods: {
      showChangeModal() {
          this.$refs.tenantChangeModal.show(this.tenant.tenancyName)
      }
  },    
}
</script>

<style lang='less' scoped>
    .tenantChange{
        text-align: center;
        margin-bottom: 12px;        
    }
</style>