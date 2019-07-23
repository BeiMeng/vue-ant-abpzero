
let AbpSessionService = class AbpSessionService {
    get userId() {
        return abp.session.userId;
    }
    get tenantId() {
        return abp.session.tenantId;
    }
    get impersonatorUserId() {
        return abp.session.impersonatorUserId;
    }
    get impersonatorTenantId() {
        return abp.session.impersonatorTenantId;
    }
    get multiTenancySide() {
        return abp.session.multiTenancySide;
    }
};
export { AbpSessionService };
