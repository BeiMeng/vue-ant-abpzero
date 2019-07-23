import { AbpMultiTenancyService } from '@/abpZero/abp-vue-module/multi-tenancy/abp-multi-tenancy.service';
import { SessionServiceProxy } from '@/abpZero/shared/service-proxies/SessionServiceProxy';
// 此服务修改放到store 的 appSession 里
let AppSessionService = class AppSessionService {
    constructor() {
        this._sessionService = new SessionServiceProxy();
        this._abpMultiTenancyService = new AbpMultiTenancyService();
    }
    get application() {
        return this._application;
    }
    get user() {
        return this._user;
    }
    get userId() {
        return this.user ? this.user.id : null;
    }
    get tenant() {
        return this._tenant;
    }
    get tenancyName() {
        return this._tenant ? this.tenant.tenancyName : '';
    }
    get tenantId() {
        return this.tenant ? this.tenant.id : null;
    }
    getShownLoginName() {
        const userName = this._user.userName;
        if (!this._abpMultiTenancyService.isEnabled) {
            return userName;
        }
        return (this._tenant ? this._tenant.tenancyName : '.') + '\\' + userName;
    }
    get theme() {
        return this._theme;
    }
    init() {
        return new Promise((resolve, reject) => {
            this._sessionService.getCurrentLoginInformations()
            .then(result=>{           
                this._application = result.application;
                this._user = result.user;
                this._tenant = result.tenant;
                this._theme = result.theme; 
                resolve(result.theme);              
            })
            .catch(function (error) {
                reject(error);
            });              
        });
    }
    changeTenantIfNeeded(tenantId) {
        if (this.isCurrentTenant(tenantId)) {
            return false;
        }
        abp.multiTenancy.setTenantIdCookie(tenantId);
        location.reload();
        return true;
    }
    isCurrentTenant(tenantId) {
        let isTenant = tenantId > 0;
        if (!isTenant && !this.tenant) {
            return true;
        }
        if (!tenantId && this.tenant) {
            return false;
        }
        else if (tenantId && (!this.tenant || this.tenant.id !== tenantId)) {
            return false;
        }
        return true;
    }
};
export { AppSessionService };
