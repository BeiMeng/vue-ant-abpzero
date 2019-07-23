
let AbpMultiTenancyService = class AbpMultiTenancyService {
    get isEnabled() {
        return abp.multiTenancy.isEnabled;
    }
};
export { AbpMultiTenancyService };
