<template>
    <el-dialog :title="l('ChangeTenant')" :visible.sync="selfVisible" v-loading="loading" :close-on-click-modal="false">

        <el-form class="el-form-small" size="small" ref="textForm">

            <el-form-item :label="l('TenancyName')" prop="tenancyName">
                <el-input id="tenancyNameInput" ref="tenancyName" v-model="tenancyName" autofocus></el-input>
                <span class="help-block">{{l("LeaveEmptyToSwitchToHost")}}</span>
            </el-form-item>

        </el-form>

        <span slot="footer" class="dialog-footer">
            <el-button  @click="selfVisible = false">{{l('Cancel')}}</el-button>
            <el-button type="primary" @click="save">{{l('Save')}}</el-button>
        </span>
    </el-dialog>
</template>

<script>
export default {
    name: 'tenantChangeModal',
    data() {
        return {
            tenancyName: '',
            selfVisible:false,
            loading:false,
        }
    },
    methods: {
        show(currentTenancyName){
            this.tenancyName=currentTenancyName;
            this.selfVisible=true;
        },
        focusTenancyNameInput(){
            setTimeout(() => {
                document.getElementById('tenancyNameInput').focus();
            }, 100);
        },        
        save() {
            let AppTenantAvailabilityState={
                Available:1,
                InActive:2,
                NotFound:3
            }
            this.loading=true;
            if (!this.tenancyName) {
                abp.multiTenancy.setTenantIdCookie(undefined);
                this.selfVisible=false;
                location.reload();
                return;
            } 
            let input = {};
            input.tenancyName = this.tenancyName;
            httpClient.post("/api/services/app/Account/IsTenantAvailable",input)
            .then(result => {
                this.loading = false;
                switch (result.state) {
                    case AppTenantAvailabilityState.Available:
                        abp.multiTenancy.setTenantIdCookie(result.tenantId);
                        this.selfVisible = false;
                        location.reload();
                        return;
                    case AppTenantAvailabilityState.InActive:
                        this.$message.warning(this.l('TenantIsNotActive', this.tenancyName));
                        this.focusTenancyNameInput();
                        break;
                    case AppTenantAvailabilityState.NotFound: // NotFound
                        this.$message.warning(this.l('ThereIsNoTenantDefinedWithName{0}', this.tenancyName));
                        this.focusTenancyNameInput();
                        break;
                }
            })
            .catch(() => {
                this.loading = false;
            });                                  
        }
    },
}
</script>

<style lang='less' scoped>

</style>